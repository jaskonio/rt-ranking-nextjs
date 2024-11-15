import prisma from "@/lib/db";

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
        include: { participants: true, races: true },
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
