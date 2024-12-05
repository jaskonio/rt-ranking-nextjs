import prisma from '@/lib/db';
import { Platform, Races } from '@/type/race';


export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const raceId = parseInt((await params).id)

  try {
    const race = await prisma.race.findUnique({ where: { id: raceId } })

    if (!race) return Response.json({ success: false, error: 'Race not found' }, { status: 404 });


    const formattedRace: Races = {
      ...race,
      date: race.date.toISOString().split('T')[0], // Formatear a 'YYYY-MM-DD'
    }

    if (formattedRace.platform == Platform.CUSTOM) {
      formattedRace.participants = await prisma.runnerParticipation.findMany({
        where: { raceId: race.id }
      })
    }

    return Response.json({ success: true, race: formattedRace });
  } catch (error) {
    console.error("Ocurrió un error al obtener las carreras:", error);
    return Response.json({ success: false, error: 'Error al obtener la carrera' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const raceId = parseInt((await params).id)

  try {
    const data = await request.json();

    const updataData = await prisma.race.update({
      where: { id: raceId }, data: {
        ...data,
        date: new Date(data.date)
      }
    })

    const formattedRace: Races =
    {
      ...updataData,
      date: updataData.date.toISOString().split('T')[0], // Formatear a 'YYYY-MM-DD'
    }

    return Response.json({ success: true, race: formattedRace });
  }
  catch (error) {
    console.error(`Ocurrió un error al actualizar la carrea ${raceId}:`, error)
    return Response.json({ success: false, error: 'Error al actualizar la carrera' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const raceId = parseInt((await params).id)

  try {
    await prisma.leagueRace.updateMany({ where: { raceId: raceId }, data: { raceId: 1 } });
    await prisma.leagueRanking.updateMany({ where: { raceId: raceId }, data: { raceId: 1 } });
    await prisma.leagueRankingHistory.updateMany({ where: { raceId: raceId }, data: { raceId: 1 } });

    await prisma.runnerParticipation.deleteMany({ where: { raceId: raceId } });
    await prisma.raceProcessingHistory.deleteMany({ where: { raceId: raceId } });

    await prisma.race.delete({ where: { id: raceId } });

    return Response.json({ success: true, message: 'Carrera eliminada exitosamente' });
  } catch (error) {
    console.error(`Ocurrió un error al eliminar la carrea ${raceId}:`, error)
    return Response.json({ success: false, error: 'Error al eliminar la carrera' }, { status: 500 });
  }
}