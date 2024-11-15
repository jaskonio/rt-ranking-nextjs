import { addParticipant } from "@/services/leagueService";

export async function POST(request: Request, { params }: { params: { id: string } }) {
    const leagueId = parseInt(params.id)
    const { runnerId, bibNumber } = await request.json();

    // Validar los datos
    // Normalización de los datos

    try {
        const participant = await addParticipant(leagueId, runnerId, bibNumber)
        return Response.json({ success: true, participant });
    } catch (error) {
        console.error("Ocurrió un error al asignar un participante a la liga:", error);
        return Response.json({ success: false, error: 'Ocurrió un error al asignar un participante a la liga' }, { status: 500 });
    }
}