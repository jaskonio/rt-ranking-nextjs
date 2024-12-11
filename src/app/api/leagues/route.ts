import { createLeague, getAllLeagues } from "@/services/leagueService";
import { LeagueFormSchema, LeagueType } from "@/type/league";


export async function GET() {
    try {
        const leagues = await getAllLeagues()
        const formattedLeagues = leagues.map((league) => {
            return {
                ...league,
                startDate: league.startDate.toISOString().split('T')[0], // Formatear a 'YYYY-MM-DD'
                endDate: league.endDate.toISOString().split('T')[0], // Formatear a 'YYYY-MM-DD'
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

        const rawData = {
            name: formData.get("name"),
            startDate: formData.get("startDate"),
            endDate: formData.get("endDate"),
            scoringMethodId: formData.get("scoringMethodId"),
            photo: formData.get("photo"),
            visible: formData.get("visible"),
            type: formData.get("type"),
            participants: formData.get("participants"),
            races: formData.get("races"),
        };

        const parsedData = LeagueFormSchema.parse({
            name: rawData.name,
            startDate: rawData.startDate,
            endDate: rawData.endDate,
            photoUrl: "xx",
            visible: rawData.visible === "true",
            type: rawData.type,
            scoringMethodId: rawData.scoringMethodId ? Number(rawData.scoringMethodId) : undefined,
            participants: JSON.parse(rawData.participants as string),
            races: JSON.parse(rawData.races as string),
        });

        // Normalizar fechas
        const normalizedStartDate = new Date(parsedData.startDate);
        const normalizedEndDate = new Date(parsedData.endDate);
        const bannerFile = rawData.photo as File;

        const newLeague = await createLeague({
            name: parsedData.name,
            startDate: normalizedStartDate,
            endDate: normalizedEndDate,
            scoringMethodId: parsedData.scoringMethodId || 1,
            photo: bannerFile,
            visible: parsedData.visible,
            type: parsedData.type as LeagueType,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            participants: parsedData.participants.map(({ id, ...rest }) => ({ ...rest })),
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            races: parsedData.races.map(({ id, ...rest }) => ({ ...rest }))
        })

        return Response.json({ success: true, league: newLeague });
    } catch (error) {
        console.error("Ocurrió un error:", error);

        return Response.json({ success: false, message: "Error al crear la Liga" }, { status: 500 });
    }
}