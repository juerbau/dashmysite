/**
 * PageView entity
 *
 * @property {string} id
 * @property {string} session_id
 * @property {string} pathname
 * @property {Date} visited_at
 */

import { pool } from "@/lib/database/pool";

export const PAGE_VIEW_COLUMNS = `
    id,
    session_id,
    pathname,
    visited_at
`.trim();

export async function create(
    {
        sessionId,
        pathname,
    },
    db = pool
) {
    const { rows } = await db.query(
        `
            INSERT INTO page_views (
                session_id,
                pathname
            )
            VALUES (
                $1,
                $2
            )
            RETURNING
                ${PAGE_VIEW_COLUMNS};
        `,
        [
            sessionId,
            pathname,
        ]
    );

    return rows[0];
}

export async function findBySessionId(
    sessionId,
    db = pool
) {
    const { rows } = await db.query(
        `
            SELECT
                ${PAGE_VIEW_COLUMNS}
            FROM page_views
            WHERE session_id = $1
            ORDER BY visited_at ASC;
        `,
        [sessionId]
    );

    return rows;
}