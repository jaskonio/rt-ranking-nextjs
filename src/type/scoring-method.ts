export const RunnerCircuitoKeys = [
    "officialPosition",
    "officialTime",
    "officialPace",
    "officialCategoryPosition",
    "officialGenderPosition",
    "realPosition",
    "realTime",
    "realPace",
    "realCategoryPosition",
    "realGenderPosition"
]

export const RunnerBasketKeys = [
    "generalPosition",
    "categoryPosition",
    "localPosition",
    "time",
    "pace"
]

export type ScoringMethod = {
    id: number;
    name: string;
    description: string;
    modelType: string;
    pointsDistribution: string;
    sortingAttributes: SortingAttribute[]
}

export type SortingAttribute = {
    id: number;
    methodId?: number;
    attribute: string;
    order: string;
    priorityLevel: number;
};
