import { createLeague, getAllLeagues, getLeagueById, updateLeague } from "@/services/leagueService";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const id = parseInt((await params).id)

    try {
        const league = await getLeagueById(id)

        return Response.json({ success: true, league });
    } catch (error) {
        console.error("Ocurrió un error al obtener la liga:", error);
        return Response.json({ success: false, error: 'Error al obtener la liga' }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const id = parseInt((await params).id)

    const { name, startDate: startDateString, endDate: endDateString, scoringMethodId } = await request.json();

    // Validar los datos
    // Normalización de los datos
    const startDate = startDateString ? new Date(startDateString) : undefined
    const endDate = endDateString ? new Date(endDateString) : undefined

    try {
        const newLeague = await updateLeague(id, { name, startDate, endDate, scoringMethodId })
        return Response.json({ success: true, league: newLeague });
    } catch (error) {
        console.error("Ocurrió un error:", error);
        return Response.json({ success: false, error: 'Error al actualizar la Liga' }, { status: 500 });
    }
}