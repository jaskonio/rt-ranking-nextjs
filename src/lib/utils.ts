const paceToSeconds = (pace: string): number => {
    const match = pace.match(/(\d+)m(\d+)s\/km/);
    if (!match) {
        throw new Error(`Invalid pace format: ${pace}`);
    }
    const [_, minutes, seconds] = match;
    return parseInt(minutes) * 60 + parseInt(seconds);
};

export const sortPaces = (paces: string[]): string[] => {
    return paces
        .map((pace) => ({ original: pace, seconds: paceToSeconds(pace) }))
        .sort((a, b) => a.seconds - b.seconds) // Más rápido primero
        .map((entry) => entry.original);
};
