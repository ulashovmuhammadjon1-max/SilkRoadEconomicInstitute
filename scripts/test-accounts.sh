#!/usr/bin/env bash
# Builds with accounts switched on against a local Postgres and runs e2e/accounts.
# Usage: ACCOUNTS_DB=postgres://user:pass@localhost:5432/db npm run test:accounts
set -euo pipefail
: "${ACCOUNTS_DB:?Set ACCOUNTS_DB to a throwaway local Postgres URL}"
export DATABASE_URL="$ACCOUNTS_DB"
export BETTER_AUTH_SECRET="test-secret-$(openssl rand -hex 16)"
export BETTER_AUTH_URL="http://localhost:3230"
export EMAIL_DEV_OUTBOX="$(mktemp -d)/outbox.jsonl"
export SREI_ALLOW_DEV_OUTBOX=1
node scripts/migrate.mjs
npx next build
npx playwright test -c playwright.accounts.config.ts "$@"
