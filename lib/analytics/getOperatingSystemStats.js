import "server-only";

import { pool } from "@/lib/database/pool";
import {getPeriodRange} from "@/lib/analytics/periods";

export async function getOperatingSystemStats(siteId, period = "7d") {

    const {from, to} = getPeriodRange(period);

    const result = await pool.query(
        `
            SELECT
                sess.operating_system,
                COUNT(*)::integer AS visits
            FROM public.sessions sess
            WHERE sess.site_id = $1
              AND sess.started_at >= $2
              AND sess.started_at < $3
            GROUP BY sess.operating_system
            ORDER BY visits DESC;
        `,
        [siteId, from, to]
    );

    return result.rows;

}