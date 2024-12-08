import { RunnerGlobalBasket, RunnerLeagueDetail } from "./runner";
import { ScoringMethod } from "./scoring-method";

export enum LeagueType {
    CIRCUITO = 'CIRCUITO',
    BASKET = 'BASKET',
}

export type LeagueParticipant = {
    id: number;
    runnerId: number;
    bibNumber: number;
    disqualified_at_race_order: number;
}

export type LeagueRace = {
    id: number;
    raceId: number;
    order: number;
}

export type League = {
    id: number;
    name: string;
    startDate: string;
    endDate: string;
    photoUrl: string;
    scoringMethodId: number
    scoringMethod: ScoringMethod;
    type: LeagueType;
    visible: boolean;
    participants: LeagueParticipant[]
    races: LeagueRace[];
}

export type RacesHistoryRanking = {
    order: number;
    name: string;
    date: string;
    distance: string;
    runners: RunnerLeagueDetail[];
    raceId: number;
}

export type LeagueGlobalRanking = {
    name: string;
    visible: boolean;
    photoUrl: string;
    type: string;
    data: RacesHistoryRanking[] | RunnerGlobalBasket[];
}

// API RESPONSE
export type LeagueResponses = {
    success: boolean
    leagues: League[]
}

export type LeagueResponse = {
    success: boolean
    league: League
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