import prisma from '@/lib/db';
import { normalizeRaceData } from '@/lib/normalization';
import { validateRaceData } from '@/lib/validation';
import { Platform, RaceResponse, Races, RunnerBasketClassification } from '@/type/race';


export async function GET() {
  try {
    const races = await prisma.race.findMany({ orderBy: { id: 'asc' } });

    const formattedRaces: Races[] = races.map((race) => ({
      ...race,
      date: race.date.toISOString().split('T')[0], // Formatear a 'YYYY-MM-DD'
    }));

    for (const race of formattedRaces) {
      if (race.platform == Platform.CUSTOM) {
        race.participants = await prisma.raceBasketClassification.findMany({
          where: { raceId: race.id }
        })
      }
    }
    return Response.json({ success: true, races: formattedRaces });
  } catch (error) {
    console.error("Ocurrió un error al obtener las carreras:", error);
    return Response.json({ success: false, error: 'Error al obtener las carreras' }, { status: 500 });
  }
}

interface RaceRequestData {
  name: string;
  date: string;
  isProcessed: boolean;
  platform: Platform;
  url: string;
  participations: RunnerBasketClassification[]; // Ajusta el tipo según la estructura real de 'participations'
}
export async function POST(request: Request) {
  const { name, date, isProcessed, platform, url, participations } = await request.json() as RaceRequestData;

  // Validar los datos
  const errors = validateRaceData(name, date, url, platform);
  if (errors.length > 0) {
    return Response.json({ success: false, errors }, { status: 400 });
  }

  // Normalización de los datos
  const { name: normalizedName, date: normalizedDate, url: normalizedUrl, platform: normalizedPlatform } = normalizeRaceData(name, date, url, platform);

  try {
    const newRace = await prisma.race.create({
      data: {
        name: normalizedName,
        date: normalizedDate,
        url: normalizedUrl,
        platform: normalizedPlatform,
        isProcessed: isProcessed,
      },
    });

    const result: RaceResponse = {
      success: true,
      race: { ...newRace, date: newRace.date.toISOString().split('T')[0] }
    }

    if (platform == Platform.CUSTOM && participations.length != 0) {


      const filledParticipations = participations.map(({ id, ...rest }) => {
        return {
          ...rest,
          raceId: newRace.id,
        }
      })

      const newParticipants = await prisma.raceBasketClassification.createManyAndReturn({
        data: filledParticipations
      })

      result.race.participants = newParticipants
    }

    return Response.json(result);
  } catch (error) {
    console.error("Ocurrió un error:", error);
    return Response.json({ success: false, error: 'Error al crear la carrera' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { name, date, url, platform } = await request.json();

  // Validar los datos
  const errors = validateRaceData(name, date, url, platform);
  if (errors.length > 0) {
    return Response.json({ success: false, errors }, { status: 400 });
  }

  // Normalización de los datos
  const { name: normalizedName, date: normalizedDate, url: normalizedUrl, platform: normalizedPlatform } = normalizeRaceData(name, date, url, platform);


  try {
    const updatedRace = await prisma.race.update({
      where: { id: parseInt(id) },
      data: {
        name: normalizedName,
        date: normalizedDate,
        url: normalizedUrl,
        platform: normalizedPlatform,
        isProcessed: false,
      },
    });

    return Response.json({ success: true, race: updatedRace });
  } catch (error) {
    console.error("Ocurrió un error al actualizar la carrera:", error);
    return Response.json({ success: false, error: 'Error al actualizar la carrera' }, { status: 500 });
  }
}
