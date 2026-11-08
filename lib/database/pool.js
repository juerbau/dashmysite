import pg from "pg";
import { databaseConfig } from "@/lib/config/database";

const { Pool } = pg;

const globalForDatabase = globalThis;

export const pool =
    globalForDatabase.dashMySitePool ??
    new Pool({
        ...databaseConfig,
        max: 10,
        idleTimeoutMillis: 30_000,
        connectionTimeoutMillis: 5_000,
    });

if (process.env.NODE_ENV !== "production") {
    globalForDatabase.dashMySitePool = pool;
}

pool.on("error", (error) => {
    console.error("Unexpected PostgreSQL error:", error);
});