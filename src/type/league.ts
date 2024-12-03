import { RunnerLeagueDetail } from "./runner";

export type LeagueParticipant = {
    id: number;
    leagueId: number;
    runnerId: number;
    bibNumber: number;
    disqualified_at_race_order: number;
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
    photoUrl: string;
    scoringMethodId: number
    scoringMethod: ScoringMethod;
    participants: LeagueParticipant[]
    races: LeagueRace[];
    visible: boolean
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
    scoringMethodId: string;
    participants: { id: number, runnerId: number, bibNumber: number, disqualified_at_race_order?: number }[];
    races: { id?: number, raceId: number, order: number }[]
    imageUrl: string
    imageContent: string;
    visible: boolean
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

export type LeagueUpdateRacesResponse = {
    success: boolean;
    updated: { id: number; leagueId: number, raceId: number, order: number }[];
    failed: { raceId: number; order: number; error: string }[];
}

export type RacesHistoryRanking = {
    order: number;
    name: string;
    date: string;
    distance: string;
    runners: RunnerLeagueDetail[];
    raceId: number;
}

export type LeagueHistoryRanking = {
    name: string;
    visible: boolean;
    photoUrl: string;
    races: RacesHistoryRanking[];
}

export type LeagueHistoryRankingResponse = {
    success: boolean;
    historyRanking: LeagueHistoryRanking;
}