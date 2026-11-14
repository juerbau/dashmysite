
import "server-only";

import { pool } from "@/lib/database/pool";

export async function getDailyPageviews(siteId, period = "7d") {
    const allowedPeriods = ["today", "7d", "30d", "all"];

    if (!allowedPeriods.includes(period)) {
        throw new Error("Ungültiger Zeitraum");
    }

    const result = await pool.query(
        `
    WITH bounds AS (
      SELECT
        CASE
          WHEN $2 = 'today' THEN CURRENT_DATE
          WHEN $2 = '7d' THEN CURRENT_DATE - 6
          WHEN $2 = '30d' THEN CURRENT_DATE - 29
          ELSE (
            SELECT MIN(pv.visited_at::date)
            FROM public.page_views pv
            JOIN public.sessions s ON s.id = pv.session_id
            WHERE s.site_id = $1
          )
        END AS start_day
    ),
    days AS (
      SELECT generate_series(
        start_day,
        CURRENT_DATE,
        INTERVAL '1 day'
      )::date AS day
      FROM bounds
    ),
    daily_views AS (
      SELECT
        pv.visited_at::date AS day,
        COUNT(*)::integer AS pageviews
      FROM public.page_views pv
      JOIN public.sessions s ON s.id = pv.session_id
      WHERE s.site_id = $1
      GROUP BY pv.visited_at::date
    )
    SELECT
      days.day::text AS day,
      COALESCE(daily_views.pageviews, 0)::integer AS pageviews
    FROM days
    LEFT JOIN daily_views
      ON daily_views.day = days.day
    ORDER BY days.day
    `,
        [siteId, period]
    );

    return result.rows;
}
