import prisma from '@/lib/db';

export const createScoringMethod = async (data: {
  name: string;
  description: string;
  formula: string;
  primaryAttribute: string;
  primaryOrder: string;
  secondaryAttribute?: string;
  secondaryOrder?: string;
  tertiaryAttribute?: string;
  tertiaryOrder?: string;
  pointsDistribution: number[];
}) => {
  return prisma.scoringMethod.create({
    data: {
      name: data.name,
      description: data.description,
      formula: data.formula,
      primaryAttribute: data.primaryAttribute,
      primaryOrder: data.primaryOrder,
      secondaryAttribute: data.secondaryAttribute,
      secondaryOrder: data.secondaryOrder,
      tertiaryAttribute: data.tertiaryAttribute,
      tertiaryOrder: data.tertiaryOrder,
      pointsDistribution: data.pointsDistribution,
    },
  });
}

export const updateScoringMethod = async (
  id: number,
  data: {
    name?: string;
    description?: string;
    formula?: string;
    primaryAttribute?: string;
    primaryOrder?: string;
    secondaryAttribute?: string;
    secondaryOrder?: string;
    tertiaryAttribute?: string;
    tertiaryOrder?: string;
    pointsDistribution?: number[];
  }
) => {
  return prisma.scoringMethod.update({
    where: { id },
    data,
  });
}