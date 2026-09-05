import {pool} from "@/lib/database/pool";

export async function getOverview(
    siteId,
    from,
    to,
) {

    const {rows} = await pool.query(
        `SELECT COUNT(*)::INTEGER AS sessions, COUNT(DISTINCT match_key) ::INTEGER AS visitors
         FROM sessions
         WHERE site_id = $1
           AND started_at BETWEEN $2 AND $3
        `,
        [
            siteId,
            from,
            to,
        ]
    );

    return rows[0];

}