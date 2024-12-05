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

export type RunnerDetail = {
    id: number;
    name: string;
    surname: string;
    photoUrl: string | null;
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