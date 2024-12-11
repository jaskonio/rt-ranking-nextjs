import { uploadToS3 } from "@/services/awsService";
import { createLeague, getAllLeagues } from "@/services/leagueService";
import { LeagueParticipant, LeagueRace, LeagueType } from "@/type/league";

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
        const name = formData.get("name") as string;
        const startDate = formData.get("startDate") as string;
        const endDate = formData.get("endDate") as string;
        const scoringMethodId = formData.get("scoringMethodId") as string;
        const bannerFile = formData.get("photo") as File;
        const visible = formData.get("visible") as string;
        const type = formData.get("type") as LeagueType;
        const participantsJsonString = formData.get("participants") as string;
        const racesJsonString = formData.get("races") as string;

        const participants = JSON.parse(participantsJsonString) as LeagueParticipant[]
        const races = JSON.parse(racesJsonString) as LeagueRace[]

        // Validar los datos
        // Normalización de los datos
        const normalizedStartDate = new Date(startDate)
        const normalizedEndDate = new Date(endDate)

        const buffer = await bannerFile.arrayBuffer();
        const bannerFileUrl = await uploadToS3(Buffer.from(buffer), undefined);

        const newLeague = await createLeague({
            name,
            startDate: normalizedStartDate,
            endDate: normalizedEndDate,
            scoringMethodId: scoringMethodId === null ? 1 : parseInt(scoringMethodId),
            photoUrl: bannerFileUrl,
            visible: Boolean(visible),
            type,
            participants: participants.map(({ id, ...rest }) => ({ ...rest })),
            races: races.map(({ id, ...rest }) => ({ ...rest }))
        })

        return Response.json({ success: true, league: newLeague });
    } catch (error) {
        console.error("Ocurrió un error:", error);
        return Response.json({ success: false, error: 'Error al crear la Liga' }, { status: 500 });
    }
}