import { deleteScoringMethod, getScoringMethodById, ScoringMethodDTO, updateScoringMethod } from '@/services/scoringMethodService';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const id = parseInt((await params).id, 10);
    if (isNaN(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

    const scoringMethod = await getScoringMethodById(id)

    if (!scoringMethod) return NextResponse.json({ error: 'Scoring method not found' }, { status: 404 });

    return NextResponse.json({ success: true, scoringMethod: scoringMethod });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const id = parseInt((await params).id, 10);
    if (isNaN(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

    const body = await request.json() as ScoringMethodDTO;

    const updatedScoringMethod = await updateScoringMethod(id, body);

    return NextResponse.json({ success: true, scoringMethod: updatedScoringMethod });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const id = parseInt((await params).id, 10);
    if (isNaN(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

    await deleteScoringMethod(id)

    return NextResponse.json({ success: true });
}
