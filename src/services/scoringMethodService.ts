import prisma from '@/lib/db';

export interface ScoringMethodDTO {
  name: string;
  description: string;
  modelType: 'CIRCUITO' | 'BASKET';
  pointsDistribution: string;
  sortingAttributes: SortingAttributeDTO[];
}

export interface SortingAttributeDTO {
  attribute: string;
  order: "ASC" | "DESC";
  priorityLevel: number;
}

export const createScoringMethod = async (data: ScoringMethodDTO) => {
  const { name, description, modelType, sortingAttributes, pointsDistribution } = data;

  return prisma.scoringMethod.create({
    data: {
      name,
      description,
      modelType,
      pointsDistribution: pointsDistribution,
      sortingAttributes: {
        create: sortingAttributes.map((attr) => ({
          attribute: attr.attribute,
          order: attr.order,
          priorityLevel: attr.priorityLevel
        }))
      }
    },
  });
}

export const updateScoringMethod = async (id: number, data: Partial<ScoringMethodDTO>) => {
  const { name, description, modelType, sortingAttributes, pointsDistribution } = data;

  return await prisma.scoringMethod.update({
    where: { id },
    data: {
      ...(name && { name }),
      ...(description && { description }),
      ...(modelType && { modelType }),
      ...(description && { description }),
      ...(pointsDistribution && { pointsDistribution: pointsDistribution }),
      ...(sortingAttributes && {
        sortingAttributes: {
          deleteMany: {},
          create: sortingAttributes.map((attr) => ({
            attribute: attr.attribute,
            order: attr.order,
            priorityLevel: attr.priorityLevel
          }))
        }
      })
    },
    include: { sortingAttributes: true },
  });
}

export const deleteScoringMethod = async (id: number) => {
  try {

    const result = await prisma.$transaction([
      prisma.sortingAttribute.deleteMany({
        where: { methodId: id },
      }),
      prisma.scoringMethod.delete({
        where: { id },
      })
    ])

    return result;
  } catch (error) {
    console.error("Error al eliminar el ScoringMethod:", error);
    throw new Error("No se pudo eliminar el ScoringMethod");
  }
}

export const getAllScoringMethod = async () => {
  try {
    const scoringMethod = await prisma.scoringMethod.findMany({
      orderBy: { id: 'desc' },
      include: { sortingAttributes: true },
    });

    return scoringMethod;
  } catch (error) {
    console.error("Error al obtener el ScoringMethod:", error);
    throw new Error("No se pudo obtener el ScoringMethod");
  }
}

export const getScoringMethodById = async (id: number) => {
  try {
    const scoringMethod = await prisma.scoringMethod.findUnique({
      where: { id },
      include: { sortingAttributes: true },
    });

    if (!scoringMethod) throw new Error("ScoringMethod no encontrado");

    return scoringMethod;
  } catch (error) {
    console.error("Error al obtener el ScoringMethod:", error);
    throw new Error("No se pudo obtener el ScoringMethod");
  }
}