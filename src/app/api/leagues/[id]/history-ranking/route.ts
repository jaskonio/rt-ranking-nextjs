import { getGlobalRankingHistory } from "@/services/leagueService";


export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const leagueId = parseInt((await params).id)

    // Validar los datos
    // Normalización de los datos

    try {
        const ranking = await getGlobalRankingHistory(leagueId)

        const result = {
            success: true,
            globalRanking: ranking
        }

        return Response.json(result);
    } catch (error) {
        console.error("Ocurrió un error al generar el ranking:", error);
        return Response.json({ success: false, error: 'Ocurrió un error al generar el ranking' }, { status: 500 });
    }
}