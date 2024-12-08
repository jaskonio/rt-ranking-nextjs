import prisma from "@/lib/db";
import { sortPaces, sortTimes } from "@/lib/utils";
import { LeagueType } from "@/type/league";
import { RunnerGlobalBasket, RunnerLeagueDetail } from "@/type/runner";
import { ScoringMethod } from "@/type/scoring-method";
import { GlobalRaceBasketClassification, LeagueParticipant, LeagueRanking, RunnerParticipation } from "@prisma/client";

type LeagueDTO = {
    name: string;
    startDate: Date;
    endDate: Date;
    scoringMethodId: number;
    photoUrl: string;
    visible: boolean;
    type: LeagueType;
    participants: LeagueParticipantDTO[];
    races: LeagueRaceDTO[];
}

type LeagueParticipantDTO = {
    runnerId: number;
    bibNumber: number;
    disqualified_at_race_order: number;
}

type LeagueRaceDTO = {
    raceId: number;
    order: number;
}

export const createLeague = async (data: LeagueDTO) => {
    const { name, startDate, endDate, scoringMethodId, photoUrl, visible, type, participants, races } = data
    return await prisma.league.create({
        data: {
            name,
            startDate,
            endDate,
            scoringMethodId,
            photoUrl,
            visible,
            type,
            participants: {
                create: participants
            },
            races: {
                create: races
            }
        }
    });
}

export const updateLeague = async (id: number, data: Partial<LeagueDTO>) => {
    const { name, startDate, endDate, scoringMethodId, photoUrl, visible, type, participants, races } = data

    await prisma.leagueRanking.deleteMany({
        where: { leagueId: id }
    })

    await prisma.leagueRankingHistory.deleteMany({
        where: { leagueId: id }
    })

    return await prisma.league.update({
        where: { id },
        data: {
            ...(name && { name }),
            ...(startDate && { startDate }),
            ...(endDate && { endDate }),
            ...(scoringMethodId && { scoringMethodId }),
            ...(photoUrl && { photoUrl }),
            ...(visible && { visible }),
            ...(type && { type }),
            ...(participants && {
                participants: {
                    deleteMany: {},
                    create: participants
                }
            }),
            ...(races && {
                races: {
                    deleteMany: {},
                    create: races
                }
            }),
        },
        include: {
            participants: true,
            races: true
        }
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
            scoringMethod: true,
            globalRaceBasketClassification: true,
            globalRaceBasketHistory: true
        },
    });
}

export const getGlobalRankingHistory = async (id: number) => {
    const league = await prisma.league.findUnique({
        where: { id },
        include: { participants: true, races: { include: { race: true } }, rankings: true, rankingHistory: { include: { participant: { include: { runner: true } } } } },
    });

    if (!league) throw new Error('League not found');

    let data: any[] = []

    if (league.type == LeagueType.CIRCUITO) {
        data = await generateGlobalCirucuitoRanking(league.id)
    } else if (league.type == LeagueType.BASKET) {
        data = await generateGlobalBasketRanking(league.id)
    }

    return {
        name: league.name,
        photoUrl: league.photoUrl,
        type: league.type,
        visible: league.visible,
        data: data
    }
}

const generateGlobalCirucuitoRanking = async (leagueId: number) => {
    const league = await prisma.league.findUnique({
        where: { id: leagueId },
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

    return races
}

const generateGlobalBasketRanking = async (leagueId: number) => {
    const league = await prisma.league.findUnique({
        where: { id: leagueId },
        include: {
            globalRaceBasketClassification: {
                include: {
                    runner: true
                }
            }
        },
    });

    if (!league) throw new Error('League not found');

    const globalRaceBasketClassification: RunnerGlobalBasket[] = [];

    league.globalRaceBasketClassification.map((runnerClassification) => {
        globalRaceBasketClassification.push({
            position: runnerClassification.position,
            name: `${runnerClassification.runner.name}, ${runnerClassification.runner.surname}`,
            photoUrl: runnerClassification.runner.photoUrl || '',
            generalFirst: runnerClassification.generalFirst,
            generalSecond: runnerClassification.generalSecond,
            generalThird: runnerClassification.generalThird,
            categoryFirst: runnerClassification.categoryFirst,
            categorySecond: runnerClassification.categorySecond,
            categoryThird: runnerClassification.categoryThird,
            localFirst: runnerClassification.localFirst,
            localSecond: runnerClassification.localSecond,
            localThird: runnerClassification.localThird,
            points: runnerClassification.points
        })
    })

    return globalRaceBasketClassification
}

// Calcular el ranking de una carrera
export const generateLeagueRanking = async (leagueId: number) => {
    // Obtener datos necesarios
    const league = await prisma.league.findUnique({
        where: { id: leagueId }
    });

    if (!league) throw new Error('League not found');

    if (league.type == LeagueType.CIRCUITO) {
        calculateCircuitoRanking(leagueId)
    } else if (league.type == LeagueType.BASKET) {
        calculateBasketRanking(leagueId)
    } else {
        console.log('Model type not supported')
    }
}

// Ranking Circuito 
const calculateCircuitoRanking = async (leagueId: number) => {
    const league = await prisma.league.findFirstOrThrow({
        where: { id: leagueId },
        include: {
            races: {
                include:
                    { race: { include: { participations: true } } }
            },
            participants: { include: { runner: true } },
            scoringMethod: {
                include: {
                    sortingAttributes: true
                }
            },
        },
    });

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
        for (const sortingAttribute of scoringMethod.sortingAttributes) {
            const attribute = sortingAttribute.attribute as keyof typeof a;
            const order = sortingAttribute.order === 'ASC' ? 'ASC' : 'DESC';
            const result = compareAttribute(a, b, attribute, order);

            if (result !== 0) return result;
        }
        return 0;
    });

    // Asignar puntos y posiciones
    const pointsDistribution = JSON.parse(`[${scoringMethod.pointsDistribution}]`) as number[]
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

// Ranking Basket
const calculateBasketRanking = async (leagueId: number) => {
    const league = await prisma.league.findUnique({
        where: { id: leagueId },
        include: {
            races: {
                include: { race: { include: { RaceBasketClassification: true } } }
            },
            globalRaceBasketClassification: true
        }
    });

    if (!league) {
        throw new Error(`League with ID ${leagueId} not found`);
    }

    await prisma.globalRaceBasketHistory.deleteMany({ where: { leagueId: leagueId } })
    await prisma.globalRaceBasketClassification.deleteMany({ where: { leagueId: leagueId } })

    const globalClassifications = new Map<number, Omit<GlobalRaceBasketClassification, 'id' | 'position'>>();

    for (const leagueRace of league.races) {
        for (const classification of leagueRace.race.RaceBasketClassification.sort((a, b) => (a.points > b.points ? 1 : -1))) {
            const existing = globalClassifications.get(classification.runnerId) || {
                runnerId: classification.runnerId,
                leagueId: leagueId,
                generalFirst: 0,
                generalSecond: 0,
                generalThird: 0,
                categoryFirst: 0,
                categorySecond: 0,
                categoryThird: 0,
                localFirst: 0,
                localSecond: 0,
                localThird: 0,
                teamsFirst: 0,
                teamsSecond: 0,
                teamsThird: 0,
                points: 0,
            };

            // Sumar posiciones y puntos
            existing.points += classification.points;
            if (classification.generalPosition === 1) existing.generalFirst++;
            if (classification.generalPosition === 2) existing.generalSecond++;
            if (classification.generalPosition === 3) existing.generalThird++;
            if (classification.categoryPosition === 1) existing.categoryFirst++;
            if (classification.categoryPosition === 2) existing.categorySecond++;
            if (classification.categoryPosition === 3) existing.categoryThird++;
            if (classification.localPosition === 1) existing.localFirst++;
            if (classification.localPosition === 2) existing.localSecond++;
            if (classification.localPosition === 3) existing.localThird++;

            globalClassifications.set(classification.runnerId, existing);

            await prisma.globalRaceBasketHistory.create({
                data: {
                    raceId: leagueRace.race.id,
                    runnerId: classification.runnerId,
                    leagueId: leagueId,
                    generalFirst: existing.generalFirst,
                    generalSecond: existing.generalSecond,
                    generalThird: existing.generalThird,
                    categoryFirst: existing.categoryFirst,
                    categorySecond: existing.categorySecond,
                    categoryThird: existing.categoryThird,
                    localFirst: existing.localFirst,
                    localSecond: existing.localSecond,
                    localThird: existing.localThird,
                    teamsFirst: existing.teamsFirst,
                    teamsSecond: existing.teamsSecond,
                    teamsThird: existing.teamsThird,
                    points: existing.points,
                },
            });
        }
    }

    const classifications = Array.from(globalClassifications, ([runnerId, data]) => {
        return {
            ...data
        }
    })

    // Sort
    const updatedClassifications: Omit<GlobalRaceBasketClassification, 'id'>[] = classifications.sort((a, b) => (a.points > b.points ? 1 : -1))
        .map((runner, index) => ({
            position: index + 1,
            ...runner
        }));

    // Guardar las clasificaciones globales
    const savedClassifications = await prisma.globalRaceBasketClassification.createMany({
        data: updatedClassifications
    });

    return savedClassifications;
};
