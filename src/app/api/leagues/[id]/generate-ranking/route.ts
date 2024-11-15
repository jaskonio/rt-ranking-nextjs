import { generateLeagueRanking } from "@/services/leagueService";

export async function POST(request: Request, { params }: { params: { id: string } }) {
    const leagueId = parseInt(params.id)

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