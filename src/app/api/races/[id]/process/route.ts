import { processRaceRunners } from '@/services/raceService';
import prisma from '@/lib/db';
import { Races } from '@/type/race';


export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const raceId = parseInt((await params).id)

  try {
    await processRaceRunners(raceId);

    const race = await prisma.race.findFirst({ where: { id: raceId } });

    if (!race) return Response.json({ success: false, error: 'Race not found' }, { status: 404 });


    const raceNormalized: Races = {
      ...race,
      date: race.date.toISOString().split('T')[0], // Formatear a 'YYYY-MM-DD'
    }

    return Response.json({ success: true, race: raceNormalized });
  } catch (error) {
    console.error(`Ocurrió un error al processar la carrea ${raceId}:`, error)
    // Guardar el error en el historial de procesamiento
    await prisma.race.update({
      where: { id: raceId },
      data: { processingStatus: 'ERROR' },
    });
    return Response.json({ success: false, error: 'Error al procesar la carrera' }, { status: 500 });
  }
}
