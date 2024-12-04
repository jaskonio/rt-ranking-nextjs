import { NextResponse } from 'next/server';
import { updateRunner, deleteRunner, getRunnerById } from '@/services/runnerService';
import { uploadToS3 } from '@/services/awsService';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const runner = await getRunnerById(Number(id))

        return Response.json({ success: true, runner });
    } catch (error) {
        console.error("Ocurrió un error al obtener el corredor:", error);
        return Response.json({ success: false, error: 'Error al obtener las runners' }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    try {
        const formData = await req.formData();
        const name = formData.get("name") as string;
        const surname = formData.get("surname") as string;
        const photo = formData.get("photo") as File;

        let photoUrl: string | undefined;
        if (photo) {
            const buffer = await photo.arrayBuffer();
            photoUrl = await uploadToS3(Buffer.from(buffer), photo.name);
        }

        const runner = await updateRunner(parseInt(id), { name, surname, photoUrl });
        return Response.json({ success: true, runner });
    } catch (error) {
        console.error("Ocurrió un error al actualizar el runner:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    try {
        await deleteRunner(parseInt(id));
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Ocurrió un error al eliminar el runner:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
