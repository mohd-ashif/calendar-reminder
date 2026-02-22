
export const getUpcomingTimeWindow = (minutesAhead: number = 5) => {
    const now = new Date();
    const timeMax = new Date(now.getTime() + minutesAhead * 60000);

    return {
        timeMin: now.toISOString(),
        timeMax: timeMax.toISOString()
    };
};

export const isStartingSoon = (eventStartTimeStr: string, minutesAhead: number = 5): boolean => {
    const eventTime = new Date(eventStartTimeStr).getTime();
    const now = new Date().getTime();
    const diffMinutes = (eventTime - now) / 60000;

    return diffMinutes >= 0 && diffMinutes <= minutesAhead;
};
