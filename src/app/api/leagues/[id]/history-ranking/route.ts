import { getRankingHistory } from "@/services/leagueService";
import { LeagueHistoryRankingResponse } from "@/type/league";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const leagueId = parseInt((await params).id)

    // Validar los datos
    // Normalización de los datos

    try {
        const league = await getRankingHistory(leagueId)
        const result: LeagueHistoryRankingResponse = {
            success: true,
            historyRanking: league
        }
        return Response.json(result);
    } catch (error) {
        console.error("Ocurrió un error al generar el ranking:", error);
        return Response.json({ success: false, error: 'Ocurrió un error al generar el ranking' }, { status: 500 });
    }
}