
import { fromZonedTime, toZonedTime } from "date-fns-tz";

const TIME_ZONE = "Europe/Berlin";

export const PERIODS = ["today", "7d", "30d", "all"];

export function normalizePeriod(period) {
    return PERIODS.includes(period) ? period : "7d";
}

function startOfDay(date, daysBack = 0) {
    const berlinDate = toZonedTime(date, TIME_ZONE);

    berlinDate.setHours(0, 0, 0, 0);
    berlinDate.setDate(berlinDate.getDate() - daysBack);

    return fromZonedTime(berlinDate, TIME_ZONE);
}

export function getPeriodRange(period, now = new Date()) {
    const selectedPeriod = normalizePeriod(period);
    const to = new Date(now);

    switch (selectedPeriod) {
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
    }
}
