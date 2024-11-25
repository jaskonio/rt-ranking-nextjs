import { addParticipant } from "@/services/leagueService";
import { LeagueSetParticipantResponse } from "@/type/league";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const leagueId = parseInt((await params).id)
    const participants = await request.json() as { runnerId: number, bibNumber: number }[];

    // Validar los datos
    // Normalización de los datos

    // eslint-disable-next-line prefer-const
    let results: LeagueSetParticipantResponse = {
        success: true,
        added: [],
        failed: [],
    };

    for (const participant of participants) {
        const { runnerId, bibNumber } = participant;

        try {
            const addedParticipant = await addParticipant(leagueId, runnerId, bibNumber);
            results.added.push(addedParticipant);
        } catch (error) {
            console.error(`Error al añadir participante: RunnerID=${runnerId}, BibNumber=${bibNumber}`, error);
            results.failed.push({
                runnerId,
                bibNumber,
                error: error instanceof Error ? error.message : 'Error desconocido',
            });
        }
    }

    if (results.failed.length > 0) {
        results.success = false;
    }

    return Response.json(results);
}