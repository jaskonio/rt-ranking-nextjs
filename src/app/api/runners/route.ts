import prisma from '@/lib/db';
import { addRunner } from '../../../services/runnerService';
import { uploadToS3 } from '@/services/awsService';

export async function GET() {
    try {
        const runners = await prisma.runner.findMany({ orderBy: { id: 'asc' } });

        return Response.json({ success: true, runners: runners });
    } catch (error) {
        console.error("Ocurrió un error al obtener las correrdores:", error);
        return Response.json({ success: false, error: 'Error al obtener las runners' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const data = JSON.parse(formData.get("data") as string);
        const photoFile = formData.get("photo") as File;

        if (!photoFile) return Response.json({ error: 'Photo is required' }, { status: 400 });

        const buffer = await photoFile.arrayBuffer();
        const photoUrl = await uploadToS3(Buffer.from(buffer), photoFile.name);

        const runner = await addRunner({ ...data }, photoUrl);
        return Response.json(runner, { status: 201 });
    } catch (error) {
        console.error("Ocurrió un error al añadir el runner:", error);
        return Response.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
