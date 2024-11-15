import prisma from "@/lib/db";
import { LeagueParticipant, RunnerParticipation, ScoringMethod } from "@prisma/client";

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

    const rankings = [];
    const globalRanking = new Map<number, { points: number; top5Finishes: number }>();

    for (const leagueRace of races) {
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
                points: 0,
                top5Finishes: 0,
            };

            globalRanking.set(rank.participantId, {
                points: globalEntry.points + rank.points,
                top5Finishes: globalEntry.top5Finishes + (rank.position <= 5 ? 1 : 0),
            });
        }

        // Guardar ranking de la carrera
        rankings.push(...raceRankings);
        await prisma.leagueRanking.createMany({ data: raceRankings });
    }

    // Guardar ranking global
    const globalRankingsArray = Array.from(globalRanking.entries())
        .map(([participantId, { points, top5Finishes }]) => ({
            leagueId,
            participantId,
            position: 0, // Se calculará en ordenamiento
            points,
            top5Finishes,
        }))
        .sort((a, b) => b.points - a.points || a.top5Finishes - b.top5Finishes)
        .map((entry, index) => ({ ...entry, position: index + 1 }));

    await prisma.leagueRanking.createMany({ data: globalRankingsArray });

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
        const primaryOrder =
            scoringMethod.primaryOrder === 'ASC'
                ? a[scoringMethod.primaryAttribute] - b[scoringMethod.primaryAttribute]
                : b[scoringMethod.primaryAttribute] - a[scoringMethod.primaryAttribute];

        if (primaryOrder !== 0) return primaryOrder;

        const secondaryOrder =
            scoringMethod.secondaryAttribute && scoringMethod.secondaryOrder
                ? scoringMethod.secondaryOrder === 'ASC'
                    ? a[scoringMethod.secondaryAttribute] - b[scoringMethod.secondaryAttribute]
                    : b[scoringMethod.secondaryAttribute] - a[scoringMethod.secondaryAttribute]
                : 0;

        if (secondaryOrder !== 0) return secondaryOrder;

        const tertiaryOrder =
            scoringMethod.tertiaryAttribute && scoringMethod.tertiaryOrder
                ? scoringMethod.tertiaryOrder === 'ASC'
                    ? a[scoringMethod.tertiaryAttribute] - b[scoringMethod.tertiaryAttribute]
                    : b[scoringMethod.tertiaryAttribute] - a[scoringMethod.tertiaryAttribute]
                : 0;

        return tertiaryOrder;
    });

    // Asignar puntos y posiciones
    const pointsDistribution: any = scoringMethod.pointsDistribution // is {}
    return raceResults.map((result, index) => ({
        leagueId: participants[0].leagueId,
        raceId: result.raceId,
        participantId: result.participantId,
        position: index + 1,
        points: pointsDistribution[index] || 0,
    }));
}