import { addRaceToLeague } from "@/services/leagueService";
import { LeagueSetRacesResponse } from "@/type/league";

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
            console.error(`Error al añadir participante: RaceID=${raceId}, Order=${order}`, error);
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