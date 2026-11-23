import "server-only";

import { pool } from "@/lib/database/pool";
import {getPeriodRange} from "@/lib/analytics/periods";

export async function getReferrerStats(siteId, period = "7d") {

    const {from, to} = getPeriodRange(period);

    const result = await pool.query(
        `
            SELECT
                CASE
                    WHEN sess.referrer_source ILIKE '%.google.%'
                        OR sess.referrer_source ILIKE 'google.%'
                        THEN 'google'
                    WHEN sess.referrer_source ILIKE '%.instagram.%'
                        OR sess.referrer_source ILIKE 'instagram.%'
                        THEN 'instagram'
                    WHEN sess.referrer_source ILIKE '%.facebook.%'
                        OR sess.referrer_source ILIKE 'facebook.%'
                        THEN 'facebook'
                    ELSE COALESCE(sess.referrer_source, 'unknown')
                    END AS source,
                COUNT(*)::integer AS visits
            FROM public.sessions sess
            WHERE sess.site_id = $1
              AND sess.started_at >= $2
              AND sess.started_at < $3
            GROUP BY source
            ORDER BY visits DESC;
        `,
        [siteId, from, to]
    );

    return result.rows;

}