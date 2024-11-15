import { deleteParticipant, updateParticipant } from "@/services/leagueService";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string, participantId: string }> }) {
    const participantId = parseInt((await params).participantId)

    const { runnerId, bibNumber } = await request.json();

    // Validar los datos
    // Normalización de los datos

    try {
        const participant = await updateParticipant(participantId, { runnerId, bibNumber })
        return Response.json({ success: true, participant });
    } catch (error) {
        console.error("Ocurrió un error al actualizar un participante:", error);
        return Response.json({ success: false, error: 'Ocurrió un error al asignar un participante.' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string, participantId: string }> }) {
    const participantId = parseInt((await params).participantId)

    // Validar los datos
    // Normalización de los datos

    try {
        await deleteParticipant(participantId)

        return Response.json({ success: true });
    } catch (error) {
        console.error("Ocurrió un error al eliminar un participante:", error);
        return Response.json({ success: false, error: 'Ocurrió un error al eliminar un participante' }, { status: 500 });
    }
}
