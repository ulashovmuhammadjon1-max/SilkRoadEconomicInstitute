#!/usr/bin/env node
/**
 * Applies db/migrations/*.sql in order, once each, inside a transaction.
 * Runs automatically before `next build` (package.json). Skips quietly when no
 * database is connected, so the site still builds without accounts.
 */
import fs from "node:fs";
import path from "node:path";
import pg from "pg";

const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
if (!url) {
  console.log("[migrate] no DATABASE_URL: skipping (accounts stay switched off)");
  process.exit(0);
}

const dir = path.join(process.cwd(), "db/migrations");
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".sql")).sort();
const client = new pg.Client({ connectionString: url });
await client.connect();
try {
  await client.query("select pg_advisory_lock(7020261)");
  await client.query("create table if not exists srei_migrations (name text primary key, applied_at timestamptz not null default now())");
  const done = new Set((await client.query("select name from srei_migrations")).rows.map((r) => r.name));
  for (const f of files) {
    if (done.has(f)) continue;
    const sql = fs.readFileSync(path.join(dir, f), "utf8");
    await client.query("begin");
    try {
      await client.query(sql);
      await client.query("insert into srei_migrations (name) values ($1)", [f]);
      await client.query("commit");
      console.log(`[migrate] applied ${f}`);
    } catch (e) {
      await client.query("rollback");
      console.error(`[migrate] failed on ${f}: ${e.message}`);
      process.exitCode = 1;
      break;
    }
  }
  if (!process.exitCode) console.log("[migrate] database is up to date");
} finally {
  await client.query("select pg_advisory_unlock(7020261)").catch(() => {});
  await client.end();
}
