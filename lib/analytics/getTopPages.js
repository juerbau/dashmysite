
import "server-only";

import { pool } from "@/lib/database/pool";
import { getPeriodRange } from "@/lib/analytics/periods";


export async function getTopPages(siteId, period = "7d") {
    const { from, to } = getPeriodRange(period);

    const result = await pool.query(
        `
            SELECT pv.pathname,
                   COUNT(*)::integer AS pageviews
            FROM public.page_views pv
                     JOIN public.sessions sess
                          ON sess.id = pv.session_id
            WHERE sess.site_id = $1
              AND pv.visited_at >= $2
              AND pv.visited_at < $3
            GROUP BY pv.pathname
            ORDER BY pageviews DESC, pv.pathname ASC;
    `,
        [siteId, from, to]
    );

    return result.rows;
}
