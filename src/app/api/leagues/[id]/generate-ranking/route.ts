import { generateLeagueRanking } from "@/services/leagueService";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const leagueId = parseInt((await params).id)

    // Validar los datos
    // Normalización de los datos

    try {
        const participant = await generateLeagueRanking(leagueId)
        return Response.json({ success: true, participant });
    } catch (error) {
        console.error("Ocurrió un error al generar el ranking:", error);
        return Response.json({ success: false, error: 'Ocurrió un error al generar el ranking' }, { status: 500 });
    }
}