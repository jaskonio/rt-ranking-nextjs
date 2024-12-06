import { saveBannerContent } from "@/services/awsService";
import { addParticipant, addRaceToLeague, createLeague, getAllLeagues } from "@/services/leagueService";
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

type LeagueResponse = {
    id: number;
    name: string;
    startDate: Date;
    endDate: Date;
    scoringMethodId: number;
    photoUrl: string;
    visible: boolean;
    type: 'CIRCUITO' | 'BASKET';
    participants: LeagueParticipant[];
    races: LeagueRace[];
};

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

        // Validar los datos
        // Normalización de los datos
        const normalizedStartDate = new Date(startDate)
        const normalizedEndDate = new Date(endDate)

        const bannerFileUrl = await saveBannerContent();

        const baseLeague = await createLeague({
            name,
            startDate: normalizedStartDate,
            endDate: normalizedEndDate,
            scoringMethodId: parseInt(scoringMethodId),
            photoUrl: bannerFileUrl,
            visible: Boolean(visible),
            type,
        })

        // set participants
        const participants = JSON.parse(participantsJsonString) as LeagueParticipant[]

        const addedParticipants = await Promise.all(
            participants.map(async (participant) => {
                const { runnerId, bibNumber } = participant;
                try {
                    return await addParticipant(baseLeague.id, runnerId, bibNumber);
                } catch (error) {
                    console.error(`Error al añadir participante: RunnerID=${runnerId}, BibNumber=${bibNumber}`, error);
                    return null;
                }
            })
        )

        // set races
        const races = JSON.parse(racesJsonString) as LeagueRace[]
        const addedRaces = await Promise.all(
            races.map(async (race) => {
                const { raceId, order } = race;
                try {
                    return await addRaceToLeague(baseLeague.id, raceId, order);
                } catch (error) {
                    console.error(`Error al añadir carrera: RaceID=${raceId}, Order=${order}`, error);
                    return null
                }
            })
        )

        const newLeague: LeagueResponse = {
            ...baseLeague,
            participants: addedParticipants.filter(Boolean) as LeagueParticipant[],
            races: addedRaces.filter(Boolean) as LeagueRace[],
        }

        return Response.json({ success: true, league: newLeague });
    } catch (error) {
        console.error("Ocurrió un error:", error);
        return Response.json({ success: false, error: 'Error al crear la Liga' }, { status: 500 });
    }
}