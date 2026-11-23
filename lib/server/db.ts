import "server-only";
import { Pool } from "pg";

/** One shared Postgres pool (Neon in production, local Postgres in development). */
const globalForDb = globalThis as unknown as { sreiPool?: Pool };

export function databaseUrl() {
  return process.env.DATABASE_URL || process.env.POSTGRES_URL || "";
}

export const pool: Pool =
  globalForDb.sreiPool ??
  new Pool({
    connectionString: databaseUrl() || undefined,
    max: 5,
    idleTimeoutMillis: 10_000,
  });

if (process.env.NODE_ENV !== "production") globalForDb.sreiPool = pool;

export async function query<T extends Record<string, unknown> = Record<string, unknown>>(text: string, params: unknown[] = []) {
  const res = await pool.query<T>(text, params);
  return res.rows;
}
