import "server-only";

import { pool } from "@/lib/database/pool";
import {getPeriodRange} from "@/lib/analytics/periods";

export async function getDailyPageviews(siteId, period = "7d") {
    const { from, to } = getPeriodRange(period);

    const result = await pool.query(
        `
            WITH bounds AS (
            SELECT
                CASE
                    WHEN $4 = 'all' THEN (
                        SELECT
                            COALESCE(MIN((pv.visited_at AT TIME ZONE 'Europe/Berlin')::date), ($3::timestamptz AT TIME ZONE 'Europe/Berlin')::date)
                        FROM public.page_views pv
                        JOIN public.sessions s ON s.id = pv.session_id
                        WHERE s.site_id = $1
                        )
                    ELSE ($2::timestamptz AT TIME ZONE 'Europe/Berlin')::date
                END AS start_day,
            
                ($3::timestamptz AT TIME ZONE 'Europe/Berlin')::date AS end_day),
                     
                days AS (SELECT generate_series(
                                             start_day,
                                             end_day,
                                             INTERVAL '1 day'
                                     )::date AS day
                FROM bounds
                    ),
                    
                daily_views AS (
                SELECT
                    (pv.visited_at AT TIME ZONE 'Europe/Berlin')::date AS day,
                    COUNT (*)::integer AS pageviews
                    FROM public.page_views pv
                        JOIN public.sessions s
                        ON s.id = pv.session_id
                        WHERE
                            s.site_id = $1
                            AND pv.visited_at >= $2
                            AND pv.visited_at < $3
                        GROUP BY (pv.visited_at AT TIME ZONE 'Europe/Berlin')::date
                    )
            
            SELECT days.day::text AS day,
            COALESCE(daily_views.pageviews, 0)::integer AS pageviews
            FROM days
                LEFT JOIN daily_views
                ON daily_views.day = days.day
            ORDER BY days.day
        `,
        [siteId, from, to, period]
    );

    return result.rows;
}
