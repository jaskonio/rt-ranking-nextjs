export type LeagueParticipant = {
    id: number;
    leagueId: number;
    runnerId: number;
    bibNumber: number;
}

export type LeagueRace = {
    id: number;
    leagueId: number;
    raceId: number;
    order: number;
}

export type ScoringMethod = {
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
    pointsDistribution: string[];
}

export type League = {
    id: number;
    name: string;
    startDate: string;
    endDate: string;
    scoringMethodId: number
    scoringMethod: ScoringMethod;
    participants: LeagueParticipant[]
    races: LeagueRace[]
}

export type LeagueResponse = {
    success: boolean
    leagues: League[]
}