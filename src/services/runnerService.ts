import prisma from '../lib/db';
import { Runner } from '@prisma/client';
import { uploadToS3 } from './awsService';

export const addRunner = async (data: Omit<Runner, 'id' | 'photoUrl'>, fileName: string): Promise<Runner> => {
    return prisma.runner.create({
        data: {
            ...data,
            photoUrl: fileName, // Guarda la URL de la foto en la base de datos
        },
    });
};

export const getRunnerById = async (runnerId: number): Promise<Runner | null> => {
    return prisma.runner.findFirst({
        where: { id: runnerId }
    });
};

export const updateRunner = async (id: number, data: Partial<Omit<Runner, 'id'>>): Promise<Runner | null> => {
    return prisma.runner.update({
        where: { id },
        data: {
            ...data,
        },
    });
};

export const deleteRunner = async (id: number): Promise<Runner | null> => {
    return prisma.runner.delete({
        where: { id },
    });
};
