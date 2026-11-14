
import "server-only";

import { pool } from "@/lib/database/pool";

export async function getTopPages(siteId, period = "7d") {
    const allowedPeriods = ["today", "7d", "30d", "all"];

    if (!allowedPeriods.includes(period)) {
        throw new Error("Ungültiger Zeitraum");
    }

    const result = await pool.query(
        `
    SELECT
      pv.pathname,
      COUNT(*)::integer AS pageviews
    FROM public.page_views pv
    JOIN public.sessions s
      ON s.id = pv.session_id
    WHERE s.site_id = $1
      AND (
        $2::text = 'all'
        OR pv.visited_at >= CASE
          WHEN $2::text = 'today' THEN CURRENT_DATE
          WHEN $2::text = '7d' THEN CURRENT_DATE - 6
          WHEN $2::text = '30d' THEN CURRENT_DATE - 29
        END
      )
    GROUP BY pv.pathname
    ORDER BY pageviews DESC, pv.pathname ASC
    `,
        [siteId, period]
    );

    return result.rows;
}
