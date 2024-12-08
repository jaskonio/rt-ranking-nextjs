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

export type RunnerParticipation = {
    id: number;
    raceId: number;
    runnerId: number | null;
    bibNumber: number;
    category: string;
    fullName: string;
    gender: string;
    name: string;
    surname: string;
    club: string;
    finished: boolean;

    officialPosition: number;
    officialTime: string;
    officialPace: string;
    officialCategoryPosition: number;
    officialGenderPosition: number;

    realPosition: number;
    realTime: string;
    realPace: string;
    realCategoryPosition: number;
    realGenderPosition: number
}

export type RunnerLeagueDetail = {
    id: number;
    position: number;
    previousPosition: number;
    name: string;
    points: number;
    photoUrl: string;
    pace: string;
    numTopFive: string; // 2, 4(x2)
    participation: number;
    bestPosition: string; // 2, 1(x2)
};

export type RaceLeagueDetail = {
    raceId: number;
    order: number;
    name: string;
    date: string;
    distance: string;
    category: string;
    runners: RunnerLeagueDetail[];
};

export type RunnerGlobalCircuito = {
    position: number;
    name: string;
    photoUrl: string;
    top5Finishes: number;
    numberParticipantion: number;
    bestPosition: number;
    bestRealPace: string;
    points: number;
};

export type RunnerGlobalBasket = {
    position: number;
    name: string;
    photoUrl: string;
    generalFirst: number;
    generalSecond: number;
    generalThird: number;
    categoryFirst: number;
    categorySecond: number;
    categoryThird: number;
    localFirst: number;
    localSecond: number;
    localThird: number;
    points: number;
};

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
    data: RunnerGlobalCircuito[] | RunnerGlobalBasket[];
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