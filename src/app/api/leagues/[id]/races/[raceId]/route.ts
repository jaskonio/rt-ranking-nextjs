import { removeRaceFromLeague } from "@/services/leagueService";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string, raceId: string }> }) {
    const raceId = parseInt((await params).raceId)

    // Validar los datos
    // Normalización de los datos

    try {
        await removeRaceFromLeague(raceId)
        return Response.json({ success: true });
    } catch (error) {
        console.error("Ocurrió un error al eliminar un participante:", error);
        return Response.json({ success: false, error: 'Ocurrió un error al eliminar un participante' }, { status: 500 });
    }
}
