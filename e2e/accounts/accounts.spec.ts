import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import fs from "node:fs";
import pg from "pg";

const OUTBOX = process.env.EMAIL_DEV_OUTBOX ?? "";
/** Tests that need an email service are skipped when the suite runs with NO_EMAIL=1. */
const needsEmail = () => test.skip(!OUTBOX, "no email service in this run");
const db = new pg.Pool({ connectionString: process.env.DATABASE_URL });
test.afterAll(() => db.end());

type Mail = { to: string; subject: string; text: string };
function lastMail(to: string): Mail | undefined {
  if (!fs.existsSync(OUTBOX)) return undefined;
  return fs.readFileSync(OUTBOX, "utf8").trim().split("\n").filter(Boolean).map((l) => JSON.parse(l) as Mail).filter((m) => m.to === to).pop();
}
async function waitMail(to: string, subject: RegExp) {
  for (let i = 0; i < 40; i++) {
    const m = lastMail(to);
    if (m && subject.test(m.subject)) return m;
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error(`no email "${subject}" for ${to}`);
}
const linkIn = (m: Mail) => m.text.match(/https?:\/\/\S+/g)!.find((u) => !u.includes("unsubscribe")) ?? "";
const rand = () => Math.random().toString(36).slice(2, 8);
const local = (u: string) => u.replace(/^https?:\/\/[^/]+/, "");

async function signIn(page: Page, email: string) {
  await page.goto("/signin");
  await page.getByText("Forgot your password? Email me a sign-in link").click();
  await page.getByLabel("Email for the sign-in link").fill(email);
  await page.getByRole("button", { name: /Email me a sign-in link/ }).click();
  await expect(page.getByText("Check your inbox")).toBeVisible();
  const m = await waitMail(email, /sign-in link/);
  await page.goto(local(linkIn(m)));
}

async function fillProfile(page: Page, birthYear: string) {
  await page.getByLabel("Full name").fill("Test Student");
  await page.getByLabel("Country").selectOption("UZ");
  await page.getByLabel("Level of study").selectOption("high_school");
  await page.getByLabel("School or university").fill("Test School");
  await page.getByLabel("Year of birth").fill(birthYear);
}

test("private pages redirect signed-out visitors to sign in", async ({ page }) => {
  await page.goto("/account");
  await expect(page).toHaveURL(/\/signin\?next=%2Faccount/);
});

test("newsletter: double opt-in, then one-click unsubscribe", async ({ page }) => {
  needsEmail();
  const email = `news-${rand()}@example.test`;
  await page.goto("/briefs");
  await page.locator("#briefs-newsletter-email").fill(email);
  await page.getByRole("button", { name: /Subscribe/ }).first().click();
  await expect(page.getByText("Check your inbox.").first()).toBeVisible();
  let row = (await db.query("select status from newsletter_subscribers where email=$1", [email])).rows[0];
  expect(row.status).toBe("pending");
  const confirm = await waitMail(email, /Confirm your subscription/);
  await page.goto(local(linkIn(confirm)));
  await expect(page.getByRole("heading", { name: "You're subscribed" })).toBeVisible();
  row = (await db.query("select status from newsletter_subscribers where email=$1", [email])).rows[0];
  expect(row.status).toBe("confirmed");
  const welcome = await waitMail(email, /You're subscribed/);
  const unsub = welcome.text.match(/https?:\/\/\S+unsubscribe\S+/)![0];
  await page.goto(local(unsub));
  await expect(page.getByRole("heading", { name: "You've been unsubscribed" })).toBeVisible();
  row = (await db.query("select status from newsletter_subscribers where email=$1", [email])).rows[0];
  expect(row.status).toBe("unsubscribed");
  // a forged unsubscribe link does nothing
  await page.goto(`/newsletter/unsubscribe?e=${encodeURIComponent(email)}&t=forged`);
  await expect(page.getByRole("heading", { name: "That link didn't work" })).toBeVisible();
});

test("sign up, create profile, edit it, then delete the account", async ({ page }) => {
  needsEmail();
  const email = `adult-${rand()}@example.test`;
  await signIn(page, email);
  await expect(page).toHaveURL(/\/account\/setup/);
  const a11y = await new AxeBuilder({ page: page as never }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(a11y.violations.map((v) => v.id)).toEqual([]);
  await fillProfile(page, "2000");
  await page.getByRole("button", { name: "Create my profile" }).click();
  await expect(page).toHaveURL(/\/account\?welcome=1/);
  await expect(page.getByRole("heading", { name: /Welcome, Test/ })).toBeVisible();

  await page.getByLabel("School or university").fill("Updated University");
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByText("Saved.")).toBeVisible();
  const uid = (await db.query(`select id from "user" where email=$1`, [email])).rows[0].id;
  expect((await db.query("select institution from profiles where user_id=$1", [uid])).rows[0].institution).toBe("Updated University");

  await page.getByRole("button", { name: "Delete my account…" }).click();
  await page.getByLabel(/Type DELETE to confirm/).fill("DELETE");
  await page.getByRole("button", { name: "Permanently delete" }).click();
  await expect(page).toHaveURL(/\/account\/deleted/);
  expect((await db.query(`select count(*)::int c from "user" where id=$1`, [uid])).rows[0].c).toBe(0);
  expect((await db.query(`select count(*)::int c from profiles where user_id=$1`, [uid])).rows[0].c).toBe(0);
  await waitMail(email, /has been deleted/);
  await page.goto("/account");
  await expect(page).toHaveURL(/\/signin/);
});

test("under-13: no account is kept", async ({ page }) => {
  needsEmail();
  const email = `kid-${rand()}@example.test`;
  await signIn(page, email);
  await expect(page).toHaveURL(/\/account\/setup/);
  await fillProfile(page, String(new Date().getUTCFullYear() - 10));
  await page.getByRole("button", { name: "Create my profile" }).click();
  await expect(page.getByText(/you need to be at least 13/i).first()).toBeVisible();
  await expect.poll(async () => (await db.query(`select count(*)::int c from "user" where email=$1`, [email])).rows[0].c).toBe(0);
});

test("13–17: guardian agreement is required and recorded", async ({ page }) => {
  needsEmail();
  const email = `teen-${rand()}@example.test`;
  await signIn(page, email);
  await fillProfile(page, String(new Date().getUTCFullYear() - 16));
  await expect(page.getByText(/Because you are under 18/)).toBeVisible();
  await page.getByRole("button", { name: "Create my profile" }).click();
  await expect(page.locator("#guardianConfirmed-error")).toBeVisible();
  await page.getByLabel(/My parent or guardian knows/).check();
  await page.getByLabel(/Parent's or guardian's email/).fill("parent@example.test");
  await page.getByRole("button", { name: "Create my profile" }).click();
  await expect(page).toHaveURL(/\/account\?welcome=1/);
  const uid = (await db.query(`select id from "user" where email=$1`, [email])).rows[0].id;
  const g = (await db.query("select confirmed, guardian_email from guardian_consents where user_id=$1", [uid])).rows[0];
  expect(g).toEqual({ confirmed: true, guardian_email: "parent@example.test" });
});

test("expired or reused sign-in link shows a clear message", async ({ page }) => {
  needsEmail();
  const email = `reuse-${rand()}@example.test`;
  await page.goto("/signin");
  await page.getByText("Forgot your password? Email me a sign-in link").click();
  await page.getByLabel("Email for the sign-in link").fill(email);
  await page.getByRole("button", { name: /Email me a sign-in link/ }).click();
  const link = local(linkIn(await waitMail(email, /sign-in link/)));
  await page.goto(link);
  await page.context().clearCookies();
  await page.goto(link);
  await expect(page).toHaveURL(/\/signin\?error=/);
  await expect(page.getByText(/expired or was already used/)).toBeVisible();
});

// ---------- Password sign-up: works without any email service ----------

async function signUp(page: Page, email: string, password = "correct horse 42") {
  await page.goto("/signup");
  await page.getByLabel("Full name").fill("Pass Word");
  await page.getByLabel("Email address").fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page).toHaveURL(/\/account\/setup/);
}

test("password sign-up: no verification, straight to profile, then sign out and back in", async ({ page }) => {
  const email = `pw-${rand()}@example.test`;
  await page.goto("/signup");
  const a11y = await new AxeBuilder({ page: page as never }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(a11y.violations.map((v) => v.id)).toEqual([]);
  await signUp(page, email);
  expect(lastMail(email)).toBeUndefined(); // no verification email
  await expect(page.getByLabel("Full name")).toHaveValue("Pass Word");
  await page.getByLabel("Country").selectOption("KZ");
  await page.getByLabel("Level of study").selectOption("undergraduate");
  await page.getByLabel("School or university").fill("Test University");
  await page.getByLabel("Year of birth").fill("2001");
  await page.getByRole("button", { name: "Create my profile" }).click();
  await expect(page).toHaveURL(/\/account\?welcome=1/);

  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page).toHaveURL("/");
  await page.goto("/account");
  await expect(page).toHaveURL(/\/signin/);

  await page.getByLabel("Email address").fill(email);
  await page.getByLabel("Password", { exact: true }).fill("wrong password!");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page.getByText("The email or password is incorrect.")).toBeVisible();
  await page.getByLabel("Password", { exact: true }).fill("correct horse 42");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page).toHaveURL(/\/account$/);
  await expect(page.getByRole("heading", { name: "Pass Word" })).toBeVisible();

  // passwords are stored hashed, never in plain text
  const row = (await db.query(`select a.password from account a join "user" u on u.id = a."userId" where u.email = $1`, [email])).rows[0];
  expect(row.password).toBeTruthy();
  expect(row.password).not.toContain("correct horse");
});

test("password sign-up: duplicate email and short password are rejected clearly", async ({ page }) => {
  const email = `dup-${rand()}@example.test`;
  await signUp(page, email);
  await page.context().clearCookies();
  await page.goto("/signup");
  await page.getByLabel("Full name").fill("Someone Else");
  await page.getByLabel("Email address").fill(email);
  await page.getByLabel("Password", { exact: true }).fill("another pass 1");
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page.getByText(/already exists/)).toBeVisible();
  await page.getByLabel("Password", { exact: true }).fill("short");
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page.getByText("Use at least 8 characters.").first()).toBeVisible();
});

test("password sign-up: under-13 is removed completely", async ({ page }) => {
  const email = `pwkid-${rand()}@example.test`;
  await signUp(page, email);
  await fillProfile(page, String(new Date().getUTCFullYear() - 11));
  await page.getByRole("button", { name: "Create my profile" }).click();
  await expect(page.getByText(/you need to be at least 13/i).first()).toBeVisible();
  await expect.poll(async () => (await db.query(`select count(*)::int c from "user" where email=$1`, [email])).rows[0].c).toBe(0);
});
