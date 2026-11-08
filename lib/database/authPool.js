import pg from "pg";
import { databaseConfig } from "../config/database.js";

const { Pool } = pg;

const globalForAuthDatabase = globalThis;

export const authPool =
    globalForAuthDatabase.dashMySiteAuthPool ??
    new Pool({
        ...databaseConfig,
        max: 5,
        idleTimeoutMillis: 30_000,
        connectionTimeoutMillis: 5_000,
        options: "-c search_path=auth",
    });

if (process.env.NODE_ENV !== "production") {
    globalForAuthDatabase.dashMySiteAuthPool = authPool;
}

authPool.on("error", (error) => {
    console.error("Unexpected Auth PostgreSQL error:", error);
});