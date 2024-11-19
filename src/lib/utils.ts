const paceToSeconds = (pace: string): number => {
    const match = pace.match(/(\d+)m(\d+)s\/km/);
    if (!match) {
        throw new Error(`Invalid pace format: ${pace}`);
    }
    const [_, minutes, seconds] = match;
    return parseInt(minutes) * 60 + parseInt(seconds);
};

export const sortPaces = (paceA: string, paceB: string, order: 'ASC' | 'DESC'): number => {
    const secondsA = paceToSeconds(paceA)
    const secondsB = paceToSeconds(paceB)
    return order === 'ASC' ? secondsA - secondsB : secondsB - secondsA;
};


const timeToSeconds = (time: string): number => {
    const [hours, minutes, seconds] = time.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
};

export const sortTimes = (timeA: string, timeB: string, order: 'ASC' | 'DESC'): number => {
    const secondsA = timeToSeconds(timeA);
    const secondsB = timeToSeconds(timeB);
    return order === 'ASC' ? secondsA - secondsB : secondsB - secondsA;
};