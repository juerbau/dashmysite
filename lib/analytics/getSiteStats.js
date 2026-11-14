
import "server-only";

import { pool } from "@/lib/database/pool";
import { getPeriodRange } from "@/lib/analytics/periods";

export async function getSiteStats(siteId, period = "7d") {
    const { from, to } = getPeriodRange(period);

    const result = await pool.query(
        `
        SELECT
            s.id AS site_id,
            s.name AS site_name,
            s.domain,

            (
                SELECT COUNT(*)::integer
                FROM public.sessions sess
                WHERE sess.site_id = s.id
                  AND sess.started_at >= $2
                  AND sess.started_at < $3
            ) AS total_visits,

            (
                SELECT COUNT(*)::integer
                FROM public.page_views pv
                JOIN public.sessions sess
                    ON sess.id = pv.session_id
                WHERE sess.site_id = s.id
                  AND pv.visited_at >= $2
                  AND pv.visited_at < $3
            ) AS total_pageviews

        FROM public.sites s
        WHERE s.id = $1
        `,
        [siteId, from, to]
    );

    return result.rows[0] ?? null;
}
