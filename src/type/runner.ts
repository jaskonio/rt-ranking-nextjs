export type RunnerDetail = {
    id: number;
    name: string;
    surname: string;
    photoUrl: string;
};

export type RunnerResponse = {
    success: boolean
    runner: RunnerDetail
}