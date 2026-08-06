/**
 * Site entity
 *
 * @property {number} id
 * @property {string} name
 * @property {string} domain
 * @property {string} site_key
 * @property {string} api_secret_hash
 * @property {boolean} is_active
 * @property {Date} created_at
 */

import { pool } from "@/lib/database/pool";

export const SITE_COLUMNS = `
    id,
    name,
    domain,
    site_key,
    api_secret_hash,
    is_active,
    created_at
`.trim();

export async function findByDomain(domain) {
    const { rows } = await pool.query(
        `
            SELECT ${SITE_COLUMNS}
            FROM sites
            WHERE domain = $1
            LIMIT 1;
        `,
        [domain]
    );

    return rows[0] ?? null;
}

export async function findBySiteKey(siteKey) {
    const { rows } = await pool.query(
        `
            SELECT ${SITE_COLUMNS}
            FROM sites
            WHERE site_key = $1
            LIMIT 1;
        `,
        [siteKey]
    );

    return rows[0] ?? null;
}

export async function create({
                                 name,
                                 domain,
                                 apiSecretHash,
                             }) {
    const { rows } = await pool.query(
        `
        INSERT INTO sites (
            name,
            domain,
            api_secret_hash
        )
        VALUES (
            $1,
            $2,
            $3
        )
        RETURNING
            ${SITE_COLUMNS};
        `,
        [
            name,
            domain,
            apiSecretHash,
        ]
    );

    return rows[0];
}

export async function deactivate(siteId) {
    const { rows } = await pool.query(
        `
            UPDATE sites
            SET
                is_active = FALSE
            WHERE id = $1
            RETURNING
                ${SITE_COLUMNS};
        `,
        [siteId]
    );

    return rows[0] ?? null;
}