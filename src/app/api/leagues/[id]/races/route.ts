import { addRaceToLeague } from "@/services/leagueService";

export async function POST(request: Request, { params }: { params: { id: string } }) {
    const leagueId = parseInt(params.id)
    const { raceId } = await request.json();

    // Validar los datos
    // Normalización de los datos

    try {
        const race = await addRaceToLeague(leagueId, raceId)
        return Response.json({ success: true, race });
    } catch (error) {
        console.error("Ocurrió un error al asignar un carrera a la liga:", error);
        return Response.json({ success: false, error: 'Ocurrió un error al asignar una carrera a la liga' }, { status: 500 });
    }
}