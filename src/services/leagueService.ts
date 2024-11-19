import prisma from "@/lib/db";
import { sortPaces } from "@/lib/utils";
import { LeagueParticipant, LeagueRanking, RunnerParticipation, ScoringMethod } from "@prisma/client";

export const createLeague = async (data: {
    name: string;
    startDate: Date;
    endDate: Date;
    scoringMethodId: number;
}) => {
    return await prisma.league.create({
        data,
    });
}

export const updateLeague = async (id: number, data: Partial<{ name: string; startDate: Date; endDate: Date; scoringMethodId: number }>) => {
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
        include: { participants: true, races: true, rankings: true },
    });
}
export const getAllLeagues = async () => {
    return await prisma.league.findMany({
        include: { participants: true, races: true, rankings: true },
    });
}

export const addParticipant = async (leagueId: number, runnerId: number, bibNumber: number) => {
    return await prisma.leagueParticipant.create({
        data: {
            leagueId,
            runnerId,
            bibNumber,
        },
    });
}

export const updateParticipant = async (participantId: number, data: Partial<{ runnerId: number, bibNumber: number }>) => {
    return await prisma.leagueParticipant.update({
        where: { id: participantId },
        data,
    });
}

export const deleteParticipant = async (participantId: number) => {
    await prisma.leagueParticipant.delete({ where: { id: participantId } });
}

export const addRaceToLeague = async (leagueId: number, raceId: number) => {
    return await prisma.leagueRace.create({
        data: {
            leagueId,
            raceId,
        },
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
            races: { include: { race: { include: { participations: true } } } },
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

        const raceRankings = await calculateRaceRanking(
            race.participations,
            participants,
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

            const updatedBestPace = globalEntry.bestRealPace != null ? sortPaces([globalEntry.bestRealPace, rank.realPace])[0] : rank.realPace

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
        const currentGlobalRanking = Array.from(globalRanking.entries())
            .map(([participantId, { raceId, points, top5Finishes, bestRealPace, bestPosition, participations, previousPosition }]) => ({
                raceId,
                leagueId,
                participantId,
                position: 0, // Se calculará en ordenamiento
                points,
                top5Finishes,
                numberParticipantion: participations,
                bestRealPace,
                bestPosition,
                previousPosition
            }))
            .map((entry, index) => ({ ...entry, position: index + 1 }));

        globalRankingsArray.push(...currentGlobalRanking)
    }

    // Guardar race rankings
    await prisma.$transaction([
        prisma.leagueRanking.deleteMany({ where: { leagueId: leagueId } }),
        prisma.leagueRanking.createMany({ data: rankings })
    ])

    // Guardar ranking global
    await prisma.$transaction([
        prisma.leagueRankingHistory.deleteMany({ where: { leagueId: leagueId } }),
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

    // Ordenar resultados basados en la configuración del método de puntuación
    raceResults.sort((a, b) => {
        const primaryAttribute = scoringMethod.primaryAttribute as keyof typeof a;

        const primaryOrder =
            scoringMethod.primaryOrder === 'ASC'
                ? a[primaryAttribute] - b[primaryAttribute]
                : b[primaryAttribute] - a[primaryAttribute];

        if (primaryOrder !== 0 || !scoringMethod.secondaryOrder) return primaryOrder;

        const secondaryAttribute = scoringMethod.secondaryAttribute as keyof typeof a;

        const secondaryOrder =
            scoringMethod.secondaryAttribute && scoringMethod.secondaryOrder
                ? scoringMethod.secondaryOrder === 'ASC'
                    ? a[secondaryAttribute] - b[secondaryAttribute]
                    : b[secondaryAttribute] - a[secondaryAttribute]
                : 0;

        if (secondaryOrder !== 0 || !scoringMethod.tertiaryOrder) return secondaryOrder;


        const tertiaryAttribute = scoringMethod.tertiaryAttribute as keyof typeof a;

        const tertiaryOrder =
            scoringMethod.tertiaryAttribute && scoringMethod.tertiaryOrder
                ? scoringMethod.tertiaryOrder === 'ASC'
                    ? a[tertiaryAttribute] - b[tertiaryAttribute]
                    : b[tertiaryAttribute] - a[tertiaryAttribute]
                : 0;

        return tertiaryOrder;
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