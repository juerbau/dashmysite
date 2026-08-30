/**
 * Session entity
 *
 * @property {string} id
 * @property {string} site_id
 * @property {string|null} match_key
 * @property {Date} started_at
 * @property {Date} last_seen_at
 * @property {string} entry_path
 * @property {string|null} referrer_domain
 * @property {string} referrer_type
 * @property {string|null} browser
 * @property {string|null} operating_system
 * @property {string} device_type
 * @property {string|null} language
 * @property {string|null} country
 * @property {number} pageview_count
 */

import { pool } from "@/lib/database/pool";

export const SESSION_COLUMNS = `
    id,
    site_id,
    match_key,
    started_at,
    last_seen_at,
    entry_path,
    referrer_domain,
    referrer_type,
    browser,
    operating_system,
    device_type,
    language,
    country,
    pageview_count
`.trim();

/**
 * Sucht eine noch aktive Session.
 *
 * `db` kann entweder der normale Pool oder später ein
 * PostgreSQL-Client innerhalb einer Transaktion sein.
 */
export async function findActiveByMatchKey(
    {
        siteId,
        matchKey,
        timeoutMinutes = 30,
    },
    db = pool
) {
    const { rows } = await db.query(
        `
            SELECT
                ${SESSION_COLUMNS}
            FROM sessions
            WHERE site_id = $1
              AND match_key = $2
              AND last_seen_at >= NOW() - ($3 * INTERVAL '1 minute')
            ORDER BY last_seen_at DESC
            LIMIT 1;
        `,
        [
            siteId,
            matchKey,
            timeoutMinutes,
        ]
    );

    return rows[0] ?? null;
}

/**
 * Legt einen neuen Besuch an.
 *
 * pageview_count beginnt bei 1, weil eine Session immer
 * zusammen mit ihrem ersten Seitenaufruf erzeugt wird.
 */
export async function create(
    {
        siteId,
        matchKey,
        entryPath,
        referrerDomain = null,
        referrerType = "direct",
        browser = null,
        operatingSystem = null,
        deviceType = "unknown",
        language = null,
        country = null,
    },
    db = pool
) {
    const { rows } = await db.query(
        `
            INSERT INTO sessions (
                site_id,
                match_key,
                entry_path,
                referrer_domain,
                referrer_type,
                browser,
                operating_system,
                device_type,
                language,
                country
            )
            VALUES (
                $1,
                $2,
                $3,
                $4,
                $5,
                $6,
                $7,
                $8,
                $9,
                $10
            )
            RETURNING
                ${SESSION_COLUMNS};
        `,
        [
            siteId,
            matchKey,
            entryPath,
            referrerDomain,
            referrerType,
            browser,
            operatingSystem,
            deviceType,
            language,
            country,
        ]
    );

    return rows[0];
}

/**
 * Aktualisiert eine bestehende Session nach einem weiteren Pageview.
 */
export async function touch(sessionId, db = pool) {
    const { rows } = await db.query(
        `
            UPDATE sessions
            SET
                last_seen_at = NOW(),
                pageview_count = pageview_count + 1
            WHERE id = $1
            RETURNING
                ${SESSION_COLUMNS};
        `,
        [sessionId]
    );

    return rows[0] ?? null;
}

/**
 * Entfernt abgelaufene Match-Keys.
 *
 * Die Session und ihre Auswertungsdaten bleiben bestehen.
 * Nur die kurzfristige Zuordnung weiterer Requests verschwindet.
 */
export async function clearExpiredMatchKeys(
    {
        olderThanMinutes = 120,
    } = {},
    db = pool
) {
    const result = await db.query(
        `
            UPDATE sessions
            SET match_key = NULL
            WHERE match_key IS NOT NULL
              AND last_seen_at < NOW() - ($1 * INTERVAL '1 minute');
        `,
        [olderThanMinutes]
    );

    return result.rowCount;
}