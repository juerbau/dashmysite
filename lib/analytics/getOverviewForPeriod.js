import { getPeriodRange } from "@/lib/analytics/periods";
import { getOverview } from "@/lib/database/repositories/analytics-repository";

export async function getOverviewForPeriod(siteId, period) {
    const { from, to } = getPeriodRange(period);

    return getOverview(
        siteId,
        from,
        to,
    );
}