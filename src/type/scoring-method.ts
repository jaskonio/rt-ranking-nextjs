export type ScoringMethodDetail = {
    id: number;
    name: string;
    description: string;
    formula: string;
    primaryAttribute: string;
    primaryOrder: string;
    secondaryAttribute: string;
    secondaryOrder: string;
    tertiaryAttribute: string;
    tertiaryOrder: string;
    pointsDistribution: string;
};

export type ScoringMethodFormPOST = Omit<ScoringMethodDetail, 'id' | 'pointsDistribution'> & {
    pointsDistribution: number[]
}

export type ScoringMethodFormForm = Omit<ScoringMethodDetail, 'id'>