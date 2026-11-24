import { defineConfig } from "@playwright/test";

/**
 * Account & newsletter flows against a real Postgres, with emails written to a
 * local outbox file instead of being sent. Run:
 *   ACCOUNTS_DB=postgres://... npm run test:accounts
 * (the script builds with accounts switched on, runs, and the normal build is
 * restored by `npm run build` afterwards).
 */
const PORT = 3230;
export default defineConfig({
  testDir: "e2e/accounts",
  timeout: 60_000,
  workers: 1,
  reporter: [["list"]],
  use: { baseURL: `http://localhost:${PORT}`, trace: "off", viewport: { width: 1280, height: 900 } },
  webServer: { command: `npx next start -p ${PORT}`, port: PORT, reuseExistingServer: false, timeout: 60_000, env: { ...process.env } as Record<string, string> },
});
