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
        const name = formData.get("name") as string;
        const surname = formData.get("surname") as string;
        const photoFile = formData.get("photo") as File;

        if (!photoFile) return Response.json({ error: 'Photo is required' }, { status: 400 });

        const buffer = await photoFile.arrayBuffer();
        const photoUrl = await uploadToS3(Buffer.from(buffer), undefined);

        const runner = await addRunner({ name, surname }, photoUrl);
        return Response.json({ success: true, runner });
    } catch (error) {
        console.error("Ocurrió un error al añadir el runner:", error);
        return Response.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
