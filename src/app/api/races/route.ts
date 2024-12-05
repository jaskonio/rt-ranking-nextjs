import prisma from '@/lib/db';
import { normalizeRaceData } from '@/lib/normalization';
import { validateRaceData } from '@/lib/validation';
import { Platform, RaceResponse, Races, RunnerCustomParticipation } from '@/type/race';
import { RunnerDetail } from '@/type/runner';


export async function GET() {
  try {
    const races = await prisma.race.findMany({ orderBy: { id: 'asc' } });

    const formattedRaces: Races[] = races.map((race) => ({
      ...race,
      date: race.date.toISOString().split('T')[0], // Formatear a 'YYYY-MM-DD'
    }));

    for (const race of formattedRaces) {
      if (race.platform == Platform.CUSTOM) {
        race.participants = await prisma.runnerParticipation.findMany({
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
  participations: RunnerCustomParticipation[]; // Ajusta el tipo según la estructura real de 'participations'
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
      const runners = await prisma.runner.findMany({})
      const mapRunners = runners.reduce((map, p) => {
        map.set(p.id, p)
        return map
      }, new Map<number, RunnerDetail>())

      const filledParticipations = participations.map((p) => {
        const runner = mapRunners.get(Number(p.runnerId))
        if (!runner) throw Error('Error al rellenar el participantes. Runner no encontrado')

        return {
          raceId: newRace.id,
          bibNumber: p.bib,
          fullName: `${runner.name} ${runner.surname}`,
          gender: '',
          name: runner.name,
          surname: runner.surname,
          club: '',
          finished: true,
          runnerId: Number(p.runnerId),
          category: '',

          realPosition: p.realPosition,
          realTime: p.realTime,
          realPace: p.realPace,
          officialPosition: p.officialPosition,
          officialTime: p.officialTime,
          officialPace: p.officialPace,
          realCategoryPosition: p.realCategoryPosition,
          realGenderPosition: p.realGenderPosition,
          officialCategoryPosition: p.officialCategoryPosition,
          officialGenderPosition: p.officialGenderPosition,
        }
      })

      const newParticipants = await prisma.runnerParticipation.createManyAndReturn({
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
