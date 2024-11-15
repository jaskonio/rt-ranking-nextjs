import { NextResponse } from 'next/server';
import { updateRunner, deleteRunner } from '@/services/runnerService';
import { uploadToS3 } from '@/services/awsService';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    try {
        const formData = await req.formData();
        const data = JSON.parse(formData.get("data") as string);
        const photoFile = formData.get("photo") as File | null;

        let photoUrl: string | undefined;
        if (photoFile) {
            const buffer = await photoFile.arrayBuffer();
            photoUrl = await uploadToS3(Buffer.from(buffer), photoFile.name);
        }

        const runner = await updateRunner(parseInt(id), { ...data, ...(photoUrl ? { photoUrl } : {}) });
        return NextResponse.json(runner, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    try {
        await deleteRunner(parseInt(id));
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
