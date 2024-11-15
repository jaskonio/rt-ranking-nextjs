import prisma from '@/lib/db';
import { updateScoringMethod } from '@/services/scoringMethodService';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

    const scoringMethod = await prisma.scoringMethod.findUnique({ where: { id } })

    if (!scoringMethod) return NextResponse.json({ error: 'Scoring method not found' }, { status: 404 });

    return NextResponse.json(scoringMethod);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

    const body = await request.json();

    const updatedScoringMethod = await updateScoringMethod(id, body);

    return NextResponse.json(updatedScoringMethod);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

    await prisma.scoringMethod.delete({ where: { id } });
    return NextResponse.json({ success: true });
}
