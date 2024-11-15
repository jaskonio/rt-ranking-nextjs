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

export const updateRunner = async (id: number, data: Partial<Omit<Runner, 'id' | 'photoUrl'>>, photo?: Buffer, fileName?: string): Promise<Runner | null> => {
    let photoUrl;
    if (photo && fileName) {
        photoUrl = await uploadToS3(photo, fileName);
    }

    return prisma.runner.update({
        where: { id },
        data: {
            ...data,
            ...(photoUrl ? { photoUrl } : {}), // Solo actualiza photoUrl si hay una nueva foto
        },
    });
};

export const deleteRunner = async (id: number): Promise<Runner | null> => {
    return prisma.runner.delete({
        where: { id },
    });
};
