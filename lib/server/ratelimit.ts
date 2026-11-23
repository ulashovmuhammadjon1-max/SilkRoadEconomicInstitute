import "server-only";
import { headers } from "next/headers";
import { query } from "./db";

/** Fixed-window rate limit stored in Postgres. Returns true if the request may proceed. */
export async function rateLimit(bucket: string, limit = 5, windowSeconds = 60) {
  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || h.get("x-real-ip") || "unknown";
  const key = `${bucket}:${ip}`;
  const rows = await query<{ count: number }>(
    `insert into rate_limits (key, window_start, count)
     values ($1, to_timestamp(floor(extract(epoch from now()) / $2) * $2), 1)
     on conflict (key, window_start) do update set count = rate_limits.count + 1
     returning count`,
    [key, windowSeconds],
  );
  // Housekeeping: drop old windows occasionally.
  if (Math.random() < 0.02) await query("delete from rate_limits where window_start < now() - interval '1 day'");
  return rows[0].count <= limit;
}
