import { deleteLeague, getLeagueById, updateLeague } from "@/services/leagueService";
import { LeagueFormSchema, LeagueType } from "@/type/league";


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
    const leagueId = parseInt((await params).id)

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
            photoUrl: 'xxx',
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


        const updatedLeague = await updateLeague(leagueId, {
            name: parsedData.name,
            startDate: normalizedStartDate,
            endDate: normalizedEndDate,
            visible: parsedData.visible,
            type: parsedData.type as LeagueType,
            scoringMethodId: parsedData.scoringMethodId,
            photo: bannerFile,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            participants: parsedData.participants.map(({ id, ...rest }) => ({ ...rest })),
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            races: parsedData.races.map(({ id, ...rest }) => ({ ...rest })),
        })
        return Response.json({ success: true, league: updatedLeague });
    } catch (error) {
        console.error("Ocurrió un error:", error);
        return Response.json({ success: false, error: 'Error al actualizar la Liga' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const leagueId = parseInt((await params).id)

    try {
        await deleteLeague(leagueId)

        return Response.json({ success: true });
    } catch (error) {
        console.error("Ocurrió un error:", error);
        return Response.json({ success: false, error: 'Error al eliminar la Liga' }, { status: 500 });
    }
}