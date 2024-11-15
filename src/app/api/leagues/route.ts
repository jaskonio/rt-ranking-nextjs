import { createLeague, getAllLeagues } from "@/services/leagueService";

export async function GET() {
    try {
        const leagues = await getAllLeagues()

        return Response.json({ success: true, leagues });
    } catch (error) {
        console.error("Ocurrió un error al obtener las ligas:", error);
        return Response.json({ success: false, error: 'Error al obtener las ligas' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const { name, startDate, endDate, scoringMethodId } = await request.json();

    // Validar los datos
    // Normalización de los datos
    const normalizedStartDate = new Date(startDate)
    const normalizedEndDate = new Date(endDate)

    try {
        const newLeague = await createLeague({ name, startDate: normalizedStartDate, endDate: normalizedEndDate, scoringMethodId })
        return Response.json({ success: true, league: newLeague });
    } catch (error) {
        console.error("Ocurrió un error:", error);
        return Response.json({ success: false, error: 'Error al crear la Liga' }, { status: 500 });
    }
}