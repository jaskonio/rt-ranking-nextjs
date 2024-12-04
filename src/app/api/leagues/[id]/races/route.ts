import prisma from "@/lib/db";
import { addRaceToLeague, updateLeagueRace } from "@/services/leagueService";
import { LeagueSetRacesResponse, LeagueUpdateRacesResponse } from "@/type/league";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const leagueId = parseInt((await params).id)
    const races = await request.json() as { raceId: number, order: number }[];

    // Validar los datos
    // Normalización de los datos

    // eslint-disable-next-line prefer-const
    let results: LeagueSetRacesResponse = {
        success: true,
        added: [],
        failed: [],
    };

    for (const race of races) {
        const { raceId, order } = race;

        try {
            const addedRace = await addRaceToLeague(leagueId, raceId, order);
            results.added.push(addedRace);
        } catch (error) {
            console.error(`Error al añadir carrera: RaceID=${raceId}, Order=${order}`, error);
            results.failed.push({
                raceId,
                order,
                error: error instanceof Error ? error.message : 'Error desconocido',
            });
        }
    }

    if (results.failed.length > 0) {
        results.success = false;
    }

    return Response.json(results);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const leagueId = parseInt((await params).id)
    const races = await request.json() as { id: number, raceId: number, order: number }[];

    // Validar los datos
    // Normalización de los datos

    // eslint-disable-next-line prefer-const
    let results: LeagueUpdateRacesResponse = {
        success: true,
        updated: [],
        failed: [],
    };

    if (races.length == 0) {
        try {
            await prisma.leagueRace.deleteMany({ where: { leagueId: leagueId } })
        } catch (error) {
            console.error(`Error al eliminar todas: leagueId=${leagueId}`, error);
        }
    }

    for (const race of races) {
        const { id, raceId, order } = race;

        try {
            if (id) {
                const updatedRace = await updateLeagueRace(id, { leagueId, raceId, order });
                results.updated.push(updatedRace);
            } else {
                const addedRace = await addRaceToLeague(leagueId, raceId, order);
                results.updated.push(addedRace);
            }
        } catch (error) {
            console.error(`Error al actualizar las carreras: RaceID=${raceId}, Order=${order}`, error);
            results.failed.push({
                raceId,
                order,
                error: error instanceof Error ? error.message : 'Error desconocido',
            });
        }
    }

    if (results.failed.length > 0) {
        results.success = false;
    }

    return Response.json(results);
}