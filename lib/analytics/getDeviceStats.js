import "server-only";

import { pool } from "@/lib/database/pool";
import {getPeriodRange} from "@/lib/analytics/periods";

export async function getDeviceStats(siteId, period = "7d") {

    const {from, to} = getPeriodRange(period);

    const result = await pool.query(
        `
            SELECT
                sess.device_type,
                COUNT(*)::integer AS visits
            FROM public.sessions sess
            WHERE sess.site_id = $1
              AND sess.started_at >= $2
              AND sess.started_at < $3
            GROUP BY sess.device_type
            ORDER BY visits DESC;
        `,
        [siteId, from, to]
    );

    return result.rows;

}