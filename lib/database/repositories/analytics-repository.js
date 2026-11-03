import {pool} from "@/lib/database/pool";

export async function getOverview(
    siteId,
    from,
    to,
) {

    const { rows } = await pool.query(
        `
            WITH session_stats AS (
                SELECT
                    COUNT(*)::INTEGER AS sessions,
                    COUNT(DISTINCT match_key)::INTEGER AS visitors
                FROM sessions
                WHERE
                    site_id = $1
                  AND started_at >= $2
                  AND started_at < $3
            ),
                 page_view_stats AS (
                     SELECT
                         COUNT(*)::INTEGER AS page_views
                     FROM page_views pv
                              INNER JOIN sessions s
                                         ON s.id = pv.session_id
                     WHERE
                         s.site_id = $1
                       AND pv.visited_at >= $2
                       AND pv.visited_at < $3
                 )
            SELECT
                session_stats.sessions,
                session_stats.visitors,
                page_view_stats.page_views
            FROM session_stats
                     CROSS JOIN page_view_stats;
        `,
        [
            siteId,
            from,
            to,
        ]
    );

    return rows[0];

}