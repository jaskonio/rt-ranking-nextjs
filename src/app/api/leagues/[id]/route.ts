import { saveBannerContent } from "@/services/awsService";
import { getLeagueById, updateLeague } from "@/services/leagueService";


export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const id = parseInt((await params).id)

    try {
        const league = await getLeagueById(id)
        if (!league) return Response.json({ success: false, error: 'Liga no encontrada' }, { status: 404 });

        const formattedLeague = {
            ...league,
            startDate: league.startDate.toISOString().split('T')[0], // Formatear a 'YYYY-MM-DD'
            endDate: league.endDate.toISOString().split('T')[0], // Formatear a 'YYYY-MM-DD'
        }

        return Response.json({ success: true, league: formattedLeague });
    } catch (error) {
        console.error("Ocurrió un error al obtener la liga:", error);
        return Response.json({ success: false, error: 'Error al obtener la liga' }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const id = parseInt((await params).id)

    const formData = await request.formData();
    const name = formData.get("name") as string;
    const startDateString = formData.get("startDate") as string;
    const endDateString = formData.get("endDate") as string;
    const scoringMethodId = formData.get("scoringMethodId") as string;
    // const bannerFile = formData.get("imageContent") as File;

    // Validar los datos
    // Normalización de los datos
    const startDate = startDateString ? new Date(startDateString) : undefined
    const endDate = endDateString ? new Date(endDateString) : undefined

    try {
        const bannerFileUrl = await saveBannerContent();

        const newLeague = await updateLeague(id, { name, startDate, endDate, scoringMethodId: parseInt(scoringMethodId), photoUrl: bannerFileUrl })
        return Response.json({ success: true, league: newLeague });
    } catch (error) {
        console.error("Ocurrió un error:", error);
        return Response.json({ success: false, error: 'Error al actualizar la Liga' }, { status: 500 });
    }
}