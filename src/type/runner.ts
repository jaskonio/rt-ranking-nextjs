
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

export type RunnerDetail = {
    id: number;
    name: string;
    surname: string;
    photoUrl: string;
};

export type RunnerFormProps = {
    name: string;
    surname: string;
    photoContent?: string;
    photoUrl?: string;
}

export type RunnerResponse = {
    success: boolean
    runner: RunnerDetail
}