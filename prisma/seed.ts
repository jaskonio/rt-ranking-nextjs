import { ModelType, PrismaClient, SortOrder } from '@prisma/client';
import csvParser from 'csv-parser';
import fs from 'fs';
import path from 'path';


const prisma = new PrismaClient()

interface RunnerData {
    name: string;
    surname: string;
    photoUrl: string;
}

interface RunnerEntity {
    id: number,
    name: string;
    surname: string;
    photoUrl: string | null;
}

export const loadRunnersFromCSV = async (filePath: string): Promise<RunnerEntity[]> => {
    const runners: RunnerData[] = [];

    try {
        const rows = fs.createReadStream(filePath).pipe(csvParser());
        for await (const row of rows) {
            const { name, surname } = row;
            if (name && surname) {
                runners.push({
                    name: name.trim(),
                    surname: surname.trim(),
                    photoUrl: 'https://i.pravatar.cc/300'
                });
            }
        }

        await prisma.runner.createMany({ data: runners });
        const runnerInserted = await prisma.runner.findMany()
        console.log(`${runners.length} runners have been imported successfully.`)

        return runnerInserted
    } catch (error) {
        console.error('Error importing runners:', error);
        throw error;
    }
};

async function main() {
    const deleteLeague = prisma.league.deleteMany()
    const deleteLeagueRace = prisma.leagueRace.deleteMany()
    const deleteLeagueParticipant = prisma.leagueParticipant.deleteMany()
    const deleteScoringMethod = prisma.scoringMethod.deleteMany()
    const deleteRace = prisma.race.deleteMany()

    await prisma.$transaction([deleteLeague, deleteLeagueRace, deleteLeagueParticipant, deleteScoringMethod, deleteRace])

    const filePath = path.join(__dirname, 'datos', 'runners.csv');

    const runners = await loadRunnersFromCSV(filePath)

    // Default Race
    const race = await prisma.race.create({
        data: {
            name: "DEFAULT RACE",
            date: new Date("2024-10-11"),
            url: "https://sportmaniacs.com/es/races/edreams-mitja-marat-barcelona-2022/6246a8e4-6bf8-488b-aa11-0d36ac1f2f4a/results#rankings",
            platform: "sportmaniacs"
        }
    })

    console.log(`Race '${race.name}' created.`);

    // Default Method Score
    const scoringCircuitoMethod = await prisma.scoringMethod.create({
        data: {
            name: "DEFAULT REGLA DE PUNTUACION CIRCUITO",
            description: "Custom method with multi-level attributes",
            modelType: ModelType.CIRCUITO,
            pointsDistribution: "10, 8, 6, 4, 2"
        }
    })

    console.log(`Rule '${scoringCircuitoMethod.name}' created.`);

    const runnerDataKeys = [
        "officialPosition",
        "officialTime",
        "officialPace",
        "officialCategoryPosition",
        "officialGenderPosition",
        "realPosition",
        "realTime",
        "realPace",
        "realCategoryPosition",
        "realGenderPosition"
    ]

    const sortingCircuitoAttribute = await prisma.sortingAttribute.createManyAndReturn({
        data: runnerDataKeys.map((key, index) => {
            return {
                methodId: scoringCircuitoMethod.id,
                attribute: key,
                order: 'ASC',
                priorityLevel: index + 1
            }
        })
    })

    console.log(`sortingCircuitoAttribute '${sortingCircuitoAttribute.length}' created.`);

    // Default League
    const league = await prisma.league.create({
        data: {
            name: "Default Liga",
            startDate: new Date(),
            endDate: new Date(),
            scoringMethodId: scoringCircuitoMethod.id,
            photoUrl: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3'
        }
    })

    console.log(`League '${league.name}' created.`);

    // Default Add LeagueParticipant
    const leagueParticipants = runners.map((runner, index) => {
        return {
            leagueId: league.id,
            runnerId: runner.id,
            bibNumber: index
        }
    })
    const leagueParticipantsCreated = await prisma.leagueParticipant.createMany({
        data: leagueParticipants
    })
    console.log(`leagueParticipantsCreated '${runners.length}' created.`);

    // Default Add LeagueRace
    await prisma.leagueRace.create({
        data: {
            leagueId: league.id,
            raceId: race.id,
            order: 0
        }
    })
}
main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })