import { saveBannerContent } from "@/services/awsService";
import { createLeague, getAllLeagues } from "@/services/leagueService";

export async function GET() {
    try {
        const leagues = await getAllLeagues()
        const formattedLeagues = leagues.map((l) => {
            return {
                ...l,
                startDate: l.startDate.toISOString().split('T')[0], // Formatear a 'YYYY-MM-DD'
                endDate: l.endDate.toISOString().split('T')[0], // Formatear a 'YYYY-MM-DD'
            }
        })
        return Response.json({ success: true, leagues: formattedLeagues });
    } catch (error) {
        console.error("Ocurrió un error al obtener las ligas:", error);
        return Response.json({ success: false, error: 'Error al obtener las ligas' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const name = formData.get("name") as string;
        const startDate = formData.get("startDate") as string;
        const endDate = formData.get("endDate") as string;
        const scoringMethodId = formData.get("scoringMethodId") as string;
        // const bannerFile = formData.get("imageContent") as File;

        // Validar los datos
        // Normalización de los datos
        const normalizedStartDate = new Date(startDate)
        const normalizedEndDate = new Date(endDate)

        const bannerFileUrl = await saveBannerContent();

        const newLeague = await createLeague({ name, startDate: normalizedStartDate, endDate: normalizedEndDate, scoringMethodId: parseInt(scoringMethodId), photoUrl: bannerFileUrl })
        return Response.json({ success: true, league: newLeague });
    } catch (error) {
        console.error("Ocurrió un error:", error);
        return Response.json({ success: false, error: 'Error al crear la Liga' }, { status: 500 });
    }
}