import prisma from "@/lib/db";
import { getExtractor } from "./platformExtractors";
import { RunnerData } from "@/type/race";

/**
 * Inicia el procesamiento de una carrera y actualiza el estado a "IN_PROGRESS".
 */
const startRaceProcessing = async (raceId: number) => {
  await prisma.race.update({
    where: { id: raceId },
    data: { processingStatus: "IN_PROGRESS" },
  });
};

/**
 * Completa el procesamiento de una carrera y almacena el historial.
 */
const completeRaceProcessing = async (raceId: number, success: boolean, errorDetails: string | null = null) => {
  await prisma.race.update({
    where: { id: raceId },
    data: { processingStatus: success ? "COMPLETED" : "ERROR", isProcessed: success },
  });

  // Almacenar en el historial de procesamiento
  await prisma.raceProcessingHistory.create({
    data: {
      raceId,
      status: success ? "SUCCESS" : "FAILURE",
      errorDetails,
    },
  });
};

/**
 * Procesa los datos de corredores después de realizar validaciones y actualiza el estado.
 */
export const processRaceRunners = async (
  raceId: number
) => {
  const race = await prisma.race.findUnique({ where: { id: raceId } });
  if (!race) throw new Error('Carrera no encontrada.');

  try {
    // Iniciar el procesamiento
    await startRaceProcessing(race.id);

    const clubFiltered = ['redolat team', 'redolat', 'redolat valencia', 'redolatteam'];

    const extractor = getExtractor(race.platform);
    const runnersData: RunnerData[] = await extractor.extractRunnerData(race.url);

    const filteredRunners = runnersData.filter(runner => clubFiltered.includes(runner.club.toLocaleLowerCase()));

    // Guardar los datos de cada corredor en la base de datos
    await Promise.all(
      filteredRunners.map(async (runner) => {
        await prisma.runnerParticipation.create({
          data: {
            raceId,
            name: runner.name,
            surname: runner.surname,
            fullName: runner.fullName,
            bibNumber: runner.bib,
            gender: runner.gender,
            category: runner.category,
            club: runner.club,
            finished: runner.finished,

            realPosition: runner.realPosition,
            realTime: runner.realTime,
            realPace: runner.realPace,
            realCategoryPosition: runner.realCategoryPosition,
            realGenderPosition: runner.realGenderPosition,

            officialPosition: runner.officialPosition,
            officialTime: runner.officialTime,
            officialPace: runner.officialPace,
            officialCategoryPosition: runner.officialCategoryPosition,
            officialGenderPosition: runner.officialGenderPosition
          },
        });
      })
    );

    // Completar el procesamiento con éxito
    await completeRaceProcessing(race.id, true);
  } catch (error) {
    // Registrar el error y marcar la carrera como error
    await completeRaceProcessing(raceId, false, error);
    throw new Error(`Error en el procesamiento de la carrera: ${error}`);
  }
};
