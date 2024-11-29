import { disqualifyParticipant } from "@/services/leagueService";
import { LeagueSetDisqualifyParticipantResponse } from "@/type/league";


export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const leagueId = parseInt((await params).id)
    const participants = await request.json() as { runnerId: number, raceOrder: number }[];

    // Validar los datos
    // Normalización de los datos

    // eslint-disable-next-line prefer-const
    let results: LeagueSetDisqualifyParticipantResponse = {
        success: true,
        added: [],
        failed: [],
    };

    for (const participant of participants) {
        const { runnerId, raceOrder } = participant;

        try {
            await disqualifyParticipant(leagueId, runnerId, raceOrder);
            results.added.push({ raceOrder, runnerId });
        } catch (error) {
            console.error(`Error al añadir participante: RunnerID=${runnerId}, raceOrder=${raceOrder}`, error);
            results.failed.push({
                runnerId,
                raceOrder,
                error: error instanceof Error ? error.message : 'Error desconocido',
            });
        }
    }

    if (results.failed.length > 0) {
        results.success = false;
    }

    return Response.json(results);
}