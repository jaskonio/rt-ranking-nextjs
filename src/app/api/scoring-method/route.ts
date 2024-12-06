import { createScoringMethod, getAllScoringMethod, ScoringMethodDTO } from '@/services/scoringMethodService';
import { NextResponse } from 'next/server';


export async function GET() {
    const scoringMethods = await getAllScoringMethod()
    return NextResponse.json({ success: true, scoringMethods: scoringMethods });
}

export async function POST(request: Request) {
    const body = await request.json() as ScoringMethodDTO;

    const newScoringMethod = await createScoringMethod(body);

    return NextResponse.json({ success: true, scoringMethod: newScoringMethod });
}
