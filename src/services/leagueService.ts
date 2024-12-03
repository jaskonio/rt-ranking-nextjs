import prisma from "@/lib/db";
import { sortPaces, sortTimes } from "@/lib/utils";
import { LeagueHistoryRanking } from "@/type/league";
import { RunnerLeagueDetail } from "@/type/runner";
import { LeagueParticipant, LeagueRanking, RunnerParticipation, ScoringMethod } from "@prisma/client";

type LeagueProp = {
    name: string;
    startDate: Date;
    endDate: Date;
    scoringMethodId: number;
    photoUrl: string;
    visible: boolean;
}
export const createLeague = async (data: LeagueProp) => {
    return await prisma.league.create({
        data,
    });
}

export const updateLeague = async (id: number, data: Partial<LeagueProp>) => {
    return await prisma.league.update({
        where: { id },
        data,
    });
}

export const deleteLeague = async (id: number) => {
    await prisma.league.delete({ where: { id } });
}

export const getLeagueById = async (id: number) => {
    return await prisma.league.findUnique({
        where: { id },
        include: { participants: true, races: true, rankings: true, scoringMethod: true, rankingHistory: true },
    });
}

export const getAllLeagues = async () => {
    return await prisma.league.findMany({
        include: {
            participants: true,
            races: true,
            rankings: true,
            rankingHistory: true,
            scoringMethod: true
        },
    });
}

export const addParticipant = async (leagueId: number, runnerId: number, bibNumber: number, order?: number) => {
    return await prisma.leagueParticipant.create({
        data: {
            leagueId,
            runnerId,
            bibNumber,
            disqualified_at_race_order: order
        },
    });
}

export const updateParticipant = async (participantId: number, data: Partial<{ runnerId: number, bibNumber: number, disqualified_at_race_order: number }>) => {
    return await prisma.leagueParticipant.update({
        where: { id: participantId },
        data,
    });
}

export const deleteParticipant = async (participantId: number) => {
    await prisma.leagueParticipant.delete({ where: { id: participantId } });
}

export const addRaceToLeague = async (leagueId: number, raceId: number, order: number) => {
    return await prisma.leagueRace.create({
        data: {
            leagueId,
            raceId,
            order
        },
    });
}

export const updateLeagueRace = async (leagueRaceId: number, data: Partial<{ leagueId: number, raceId: number, order: number }>) => {
    return await prisma.leagueRace.update({
        where: { id: leagueRaceId },
        data
    });
}

export const removeRaceFromLeague = async (leagueRaceId: number) => {
    await prisma.leagueRace.delete({ where: { id: leagueRaceId } });
}

export const generateLeagueRanking = async (leagueId: number) => {
    // Obtener datos necesarios
    const league = await prisma.league.findUnique({
        where: { id: leagueId },
        include: {
            races: {
                include:
                    { race: { include: { participations: true } } }
            },
            participants: { include: { runner: true } },
            scoringMethod: true,
        },
    });

    if (!league) throw new Error('League not found');

    const { races, participants, scoringMethod } = league;

    // Validar que hay participantes y carreras en la liga
    if (participants.length === 0) throw new Error('No participants in the league');
    if (races.length === 0) throw new Error('No races in the league');

    const racesSorted = races.sort((a, b) => (a.order > b.order ? 1 : -1))
    const rankings = [];
    const globalRanking = new Map<number, {
        raceId: number;
        points: number;
        top5Finishes: number;
        bestRealPace: string;
        bestPosition: number;
        participations: number;
        previousPosition: number
    }>();

    const globalRankingsArray = []

    for (const leagueRace of racesSorted) {
        const { race } = leagueRace;
        if (!race) continue;

        const leagueParticipants: LeagueParticipant[] = participants.filter(p => p.disqualified_at_race_order > leagueRace.order)
        const raceRankings = await calculateRaceRanking(
            race.participations,
            leagueParticipants,
            scoringMethod
        );

        // Actualizar ranking global
        for (const rank of raceRankings) {
            const globalEntry = globalRanking.get(rank.participantId) || {
                raceId: 0,
                points: 0,
                top5Finishes: 0,
                bestRealPace: null,
                bestPosition: Infinity,
                participations: 0,
                previousPosition: 0,
            };

            let updatedTop5Finishes = globalEntry.top5Finishes;
            if (rank.top5Finishes) updatedTop5Finishes++;

            const updatedBestPace = globalEntry.bestRealPace != null ? [globalEntry.bestRealPace, rank.realPace].sort((a, b) => sortPaces(a, b, 'DESC'))[0] : rank.realPace

            globalRanking.set(rank.participantId, {
                raceId: rank.raceId,
                points: globalEntry.points + rank.points,
                top5Finishes: updatedTop5Finishes,
                bestRealPace: updatedBestPace,
                bestPosition: Math.min(globalEntry.bestPosition, rank.position),
                participations: globalEntry.participations + 1,
                previousPosition: globalEntry.previousPosition == 0 ? rank.position : globalEntry.previousPosition,
            });
        }

        // Guardar ranking de la carrera
        rankings.push(...raceRankings);

        // Guardar el global
        const globalRankingList = Array.from(globalRanking.entries()).sort((a, b) => (a[1].points < b[1].points) ? 1 : -1)

        const currentGlobalRanking = []
        let index = 1
        for (const globalRankingParticipant of globalRankingList) {
            const globalRankingParticipantId = globalRankingParticipant[0]
            const globalRankingParticipantData = globalRankingParticipant[1]

            currentGlobalRanking.push({
                raceId: race.id,
                leagueId: leagueId,
                participantId: globalRankingParticipantId,
                position: index,
                points: globalRankingParticipantData.points,
                top5Finishes: globalRankingParticipantData.top5Finishes,
                numberParticipantion: globalRankingParticipantData.participations,
                bestRealPace: globalRankingParticipantData.bestRealPace,
                bestPosition: globalRankingParticipantData.bestPosition,
                previousPosition: globalRankingParticipantData.previousPosition
            })

            index += 1
        }

        globalRankingsArray.push(...currentGlobalRanking)
    }

    // Guardar race rankings
    await prisma.$transaction([
        prisma.leagueRanking.deleteMany({ where: { leagueId } }),
        prisma.leagueRanking.createMany({ data: rankings }),
        prisma.leagueRankingHistory.deleteMany({ where: { leagueId } }),
        prisma.leagueRankingHistory.createMany({ data: globalRankingsArray })
    ])

    return { raceRankings: rankings, globalRankings: globalRankingsArray };
}

// Calcular el ranking de una carrera
const calculateRaceRanking = async (participations: RunnerParticipation[], participants: LeagueParticipant[], scoringMethod: ScoringMethod) => {
    // Filtrar solo los corredores de la liga
    const leagueParticipants = participants.reduce((map, p) => {
        map.set(p.bibNumber, p.id);
        return map;
    }, new Map());

    const raceResults = participations
        .filter((p) => leagueParticipants.has(p.bibNumber))
        .map((p) => ({
            participantId: leagueParticipants.get(p.bibNumber),
            ...p,
        }));

    const compareAttribute = (
        a: typeof raceResults[0],
        b: typeof raceResults[0],
        attribute: keyof typeof a,
        order: 'ASC' | 'DESC'
    ): number => {
        const valueA = a[attribute];
        const valueB = b[attribute];

        if (['officialPace', 'realPace'].includes(attribute)) {
            return sortPaces(valueA as string, valueB as string, order);
        }

        if (['officialTime', 'realTime'].includes(attribute)) {
            return sortTimes(valueA as string, valueB as string, order);
        }

        return order === 'ASC' ? (valueA as number) - (valueB as number) : (valueB as number) - (valueA as number);
    };

    // Ordenar resultados basados en la configuración del método de puntuación
    raceResults.sort((a, b) => {
        const primaryAttribute = scoringMethod.primaryAttribute as keyof typeof a;
        const primaryOrderValue = scoringMethod.primaryOrder == 'ASC' ? 'ASC' : 'DESC'
        const primaryOrder = compareAttribute(a, b, primaryAttribute, primaryOrderValue);

        if (primaryOrder !== 0 || !scoringMethod.secondaryAttribute) return primaryOrder;

        const secondaryAttribute = scoringMethod.secondaryAttribute as keyof typeof a;
        const secondaryOrderValue = scoringMethod.secondaryOrder == 'ASC' ? 'ASC' : 'DESC'

        const secondaryOrder = compareAttribute(a, b, secondaryAttribute, secondaryOrderValue);

        if (secondaryOrder !== 0 || !scoringMethod.tertiaryAttribute) return secondaryOrder;

        const tertiaryAttribute = scoringMethod.tertiaryAttribute as keyof typeof a;
        const tertiaryOrderValue = scoringMethod.tertiaryOrder == 'ASC' ? 'ASC' : 'DESC'

        return compareAttribute(a, b, tertiaryAttribute, tertiaryOrderValue);
    });

    // Asignar puntos y posiciones
    const pointsDistribution = scoringMethod.pointsDistribution as number[]// is {}
    const leagueRanking: Omit<LeagueRanking, 'id'>[] = raceResults.map((result, index) => ({
        leagueId: participants[0].leagueId,
        raceId: result.raceId,
        participantId: result.participantId,
        position: index + 1,
        points: pointsDistribution[index] || 0,
        realPace: result.realPace,
        top5Finishes: (index + 1) <= 5 ? true : false
    }));

    return leagueRanking
}

export const getRankingHistory = async (id: number) => {
    const league = await prisma.league.findUnique({
        where: { id },
        include: { participants: true, races: { include: { race: true } }, rankings: true, rankingHistory: { include: { participant: { include: { runner: true } } } } },
    });

    if (!league) throw new Error('League not found');

    const racesMap = new Map<number, {
        order: number,
        name: string,
        date: string,
        distance: string,
        runners: RunnerLeagueDetail[],
    }>();

    league.races.map((race) => {
        const result = racesMap.get(race.raceId) || {
            order: race.order,
            name: race.race.name,
            date: race.race.date.toDateString(),
            distance: '',
            runners: []
        }

        racesMap.set(race.raceId, result)

        return result
    })
    league.rankingHistory.map((runner) => {
        const race = racesMap.get(runner.raceId)
        if (!race) return {}

        race.runners.push({
            id: runner.id,
            name: `${runner.participant.runner.name}, ${runner.participant.runner.surname}`,
            pace: runner.bestRealPace || '',
            photoUrl: runner.participant.runner.photoUrl || "https://i.pravatar.cc/300",
            points: runner.points,
            position: runner.position,
            previousPosition: runner.previousPosition,
            bestPosition: '1 (x2)',
            numTopFive: '2 (x4)',
            participation: runner.numberParticipantion
        })
    })

    const races = Array.from(racesMap, ([raceId, data]) => {
        return {
            raceId,
            ...data
        }
    })

    const data: LeagueHistoryRanking = {
        name: league.name,
        photoUrl: league.photoUrl,
        visible: league.visible,
        races: races
    }

    return data
}