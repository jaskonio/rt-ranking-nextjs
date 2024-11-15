import { processRaceRunners } from '@/services/raceService';
import prisma from '@/lib/db';


export async function POST(request: Request) {
  const { raceId }: { raceId: number } = await request.json();

  try {
    await processRaceRunners(raceId);

    return Response.json({ success: true, message: 'Carrera procesada exitosamente' });
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
