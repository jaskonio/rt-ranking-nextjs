import { getGlobalRankingHistory } from "@/services/leagueService";


export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const leagueId = parseInt((await params).id)

    try {
        const ranking = await getGlobalRankingHistory(leagueId)

        return Response.json({ success: true, globalRanking: ranking });
    } catch (error) {
        console.error("Ocurrió un error al generar el ranking:", error);
        return Response.json({ success: false, error: 'Ocurrió un error al generar el ranking' }, { status: 500 });
    }
}