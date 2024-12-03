import { PrismaClient } from '@prisma/client';
import csvParser from 'csv-parser';
import fs from 'fs';
import path from 'path';


const prisma = new PrismaClient()

interface RunnerData {
    name: string;
    surname: string;
    photoUrl: string;
}

export const loadRunnersFromCSV = async (filePath: string): Promise<void> => {
    const runners: RunnerData[] = [];

    return new Promise((resolve, reject) => {
        const stream = fs.createReadStream(filePath)
            .pipe(csvParser())
            .on('data', (row) => {
                const { name, surname } = row;
                if (name && surname) {
                    runners.push({
                        name: name.trim(),
                        surname: surname.trim(),
                        photoUrl: 'https://i.pravatar.cc/300'
                    });
                }
            })
            .on('end', async () => {
                try {
                    await prisma.runner.deleteMany()

                    await prisma.runner.createMany({ data: runners });
                    console.log(`${runners.length} runners have been imported successfully.`);
                    resolve();
                } catch (error) {
                    console.error('Error importing runners:', error);
                    reject(error);
                } finally {
                    await prisma.$disconnect();
                }
            })
            .on('error', (error) => {
                console.error('Error reading CSV file:', error);
                reject(error);
            });
    });
};

async function main() {
    const filePath = path.join(__dirname, 'datos', 'runners.csv');

    loadRunnersFromCSV(filePath)
        .then(() => console.log('Import completed.'))
        .catch((error) => console.error('Import failed:', error));
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