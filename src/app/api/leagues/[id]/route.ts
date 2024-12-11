import { deleteFromS3, uploadToS3 } from "@/services/awsService";
import { deleteLeague, getLeagueById, updateLeague } from "@/services/leagueService";
import { LeagueParticipant, LeagueRace, LeagueType } from "@/type/league";


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

    try {
        const buffer = await bannerFile.arrayBuffer();
        const bannerFileUrl = await uploadToS3(Buffer.from(buffer), undefined);

        const updatedLeague = await updateLeague(id, {
            name,
            startDate: normalizedStartDate,
            endDate: normalizedEndDate,
            visible: Boolean(visible),
            type,
            scoringMethodId: parseInt(scoringMethodId),
            photoUrl: bannerFileUrl,
            participants: participants.map(({ id, ...rest }) => ({ ...rest })),
            races: races.map(({ id, ...rest }) => ({ ...rest })),
        })
        return Response.json({ success: true, league: updatedLeague });
    } catch (error) {
        console.error("Ocurrió un error:", error);
        return Response.json({ success: false, error: 'Error al actualizar la Liga' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const id = parseInt((await params).id)

    try {
        const result = await deleteLeague(id)

        if (!result) {
            return Response.json({ error: 'Runner not found' }, { status: 500 });
        }

        if (!result.photoUrl) {
            return Response.json({ success: true });
        }

        const file_name = result.photoUrl.split('/').at(-1) || ''
        await deleteFromS3(file_name)
        return Response.json({ success: true });
    } catch (error) {
        console.error("Ocurrió un error:", error);
        return Response.json({ success: false, error: 'Error al actualizar la Liga' }, { status: 500 });
    }
}