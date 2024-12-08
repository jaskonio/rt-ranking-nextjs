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
    photoUrl: string;
}

export type RunnerResponse = {
    success: boolean
    runner: RunnerDetail
}