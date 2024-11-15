import prisma from '@/lib/db';
import { createScoringMethod } from '@/services/scoringMethodService';
import { NextResponse } from 'next/server';

export async function GET() {
    const scoringMethods = await prisma.scoringMethod.findMany({ orderBy: { id: 'asc' } });
    return NextResponse.json({ success: true, scoringMethods: scoringMethods });
}

export async function POST(request: Request) {
    const body = await request.json();

    const newScoringMethod = await createScoringMethod({
        name: body.name,
        description: body.description,
        formula: body.formula,
        primaryAttribute: body.primaryAttribute,
        primaryOrder: body.primaryOrder,
        secondaryAttribute: body.secondaryAttribute,
        secondaryOrder: body.secondaryOrder,
        tertiaryAttribute: body.tertiaryAttribute,
        tertiaryOrder: body.tertiaryOrder,
        pointsDistribution: body.pointsDistribution,
    });

    return NextResponse.json(newScoringMethod, { status: 201 });
}
