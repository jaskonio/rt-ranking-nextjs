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

export type LeagueResponses = {
    success: boolean
    leagues: League[]
}

export type LeagueResponse = {
    success: boolean
    league: League
}

export type LeagueFormProps = {
    name: string;
    startDate: string;
    endDate: string;
    scoringMethodId: number;
    participants: { runnerId: number, bibNumber: number }[];
    races: { raceId: number, order: number }[]
    imageUrl: string
    imageContent: string
}

export type LeagueSetParticipantResponse = {
    success: boolean;
    added: { runnerId: number; bibNumber: number }[];
    failed: { runnerId: number; bibNumber: number; error: string }[];
}

export type LeagueSetRacesResponse = {
    success: boolean;
    added: { id: number; leagueId: number, raceId: number, order: number }[];
    failed: { raceId: number; order: number; error: string }[];
}