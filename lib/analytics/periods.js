import { fromZonedTime, toZonedTime } from "date-fns-tz";

const TIME_ZONE = "Europe/Berlin";

function startOfDay(date, daysBack = 0) {
    const berlinDate = toZonedTime(date, TIME_ZONE);

    berlinDate.setHours(0, 0, 0, 0);
    berlinDate.setDate(berlinDate.getDate() - daysBack);

    return fromZonedTime(berlinDate, TIME_ZONE);
}

export function getPeriodRange(period, now = new Date()) {
    const to = new Date(now);

    switch (period) {
        case "today":
            return {
                from: startOfDay(now),
                to,
            };

        case "7d":
            return {
                from: startOfDay(now, 6),
                to,
            };

        case "30d":
            return {
                from: startOfDay(now, 29),
                to,
            };

        case "all":
            return {
                from: new Date(0),
                to,
            };

        default:
            throw new Error(`Unsupported period: ${period}`);
    }
}