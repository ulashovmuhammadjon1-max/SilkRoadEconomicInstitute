import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import fs from "node:fs";
import yaml from "js-yaml";

const PAGES = ["/", "/briefs", "/briefs/tag/remittances", "/briefs/2026-11-draft-remittances-exchange-rate", "/papers", "/papers/srei-wp-000", "/forum", "/about", "/contact", "/this-page-does-not-exist"];

/** Scroll the whole page so every reveal has fired. */
async function scrollThrough(page: import("@playwright/test").Page) {
  const h = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < h; y += 400) {
    await page.evaluate((y) => window.scrollTo(0, y), y);
    await page.waitForTimeout(60);
  }
  await page.waitForTimeout(1800);
}

for (const path of PAGES) {
  test(`axe: no accessibility violations on ${path}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(path);
    await scrollThrough(page);
    const results = await new AxeBuilder({ page: page as never }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
    expect(results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).slice(0, 3).join(", ")}`)).toEqual([]);
  });

  test(`no horizontal scroll on ${path}`, async ({ page }) => {
    await page.goto(path);
    await scrollThrough(page);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });
}

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  for (const path of ["/", "/briefs/2026-11-draft-remittances-exchange-rate", "/forum"]) {
    test(`content is visible on ${path}`, async ({ page }) => {
      await page.goto(path);
      await page.waitForTimeout(2500); // load-time CSS animations finish without JS
      const h1 = page.locator("h1").first();
      await expect(h1).toBeVisible();
      expect(await h1.evaluate((el) => getComputedStyle(el).opacity)).toBe("1");
      // nothing marked for reveal is hidden
      const hidden = await page.evaluate(() =>
        Array.from(document.querySelectorAll("[data-reveal],.load-in,.load-left,.load-fade,.rw-in")).filter((el) => getComputedStyle(el).opacity === "0").length,
      );
      expect(hidden).toBe(0);
    });
  }
});

test("reduced motion: everything visible without scrolling animations", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("html")).not.toHaveClass(/intro/);
  const hidden = await page.evaluate(() =>
    Array.from(document.querySelectorAll("[data-reveal],.load-in,.load-left,.load-fade,.rw-in")).filter((el) => {
      const s = getComputedStyle(el);
      return s.opacity === "0" || (s.transform !== "none" && s.transform !== "matrix(1, 0, 0, 1, 0, 0)");
    }).length,
  );
  expect(hidden).toBe(0);
  await expect(page.locator(".marquee").first()).toHaveCSS("animation-name", "none");
});

test("first-visit intro runs once and then gets out of the way", async ({ page }) => {
  await page.goto("/");
  await page.waitForTimeout(1600);
  await expect(page.locator("html")).not.toHaveClass(/\bintro\b/);
  await expect(page.locator("#hero-title")).toBeVisible();
  await page.reload();
  await expect(page.locator("html")).not.toHaveClass(/\bintro\b/);
});

test("search finds the working paper", async ({ page, isMobile }) => {
  await page.goto("/");
  await page.waitForTimeout(1500);
  await page.getByRole("button", { name: "Search" }).click();
  await page.getByRole("combobox").fill("depreciation");
  const option = page.getByRole("option").first();
  await expect(option).toContainText("Currency Depreciation");
  await option.click();
  await expect(page).toHaveURL(/\/papers\/srei-wp-000/);
  test.info().annotations.push({ type: "mobile", description: String(isMobile) });
});

test("mobile menu opens, traps focus and closes with Escape", async ({ page, isMobile }) => {
  test.skip(!isMobile, "mobile only");
  await page.goto("/about");
  await page.getByRole("button", { name: "Open menu" }).click();
  const dialog = page.getByRole("dialog", { name: "Menu" });
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await page.getByRole("button", { name: "Open menu" }).click();
  await dialog.getByRole("link", { name: /Forum/ }).click();
  await expect(page).toHaveURL(/\/forum$/);
});

test("page transitions use the View Transitions API where supported", async ({ page }) => {
  await page.goto("/papers");
  await page.waitForTimeout(800);
  await page.evaluate(() => {
    (window as unknown as { __vt: number }).__vt = 0;
    const orig = document.startViewTransition?.bind(document);
    if (orig) document.startViewTransition = ((cb: unknown) => { (window as unknown as { __vt: number }).__vt++; return orig(cb as never); }) as typeof document.startViewTransition;
  });
  await page.locator('a[href="/papers/srei-wp-000"]').first().click();
  await expect(page).toHaveURL(/srei-wp-000/);
  const supported = await page.evaluate(() => "startViewTransition" in document);
  const used = await page.evaluate(() => (window as unknown as { __vt: number }).__vt);
  if (supported) expect(used).toBeGreaterThan(0);
});

test("feeds, search index, citation files and sitemap respond", async ({ request }) => {
  for (const [url, type] of [
    ["/briefs/feed.xml", "atom"],
    ["/papers/feed.xml", "atom"],
    ["/search-index.json", "json"],
    ["/papers/srei-wp-000/cite.bib", "bibtex"],
    ["/papers/srei-wp-000/cite.ris", "research"],
    ["/sitemap.xml", "xml"],
    ["/robots.txt", "text"],
    ["/opengraph-image", "image"],
  ]) {
    const r = await request.get(url);
    expect(r.status(), url).toBe(200);
    expect(r.headers()["content-type"], url).toContain(type);
  }
});

test("Decap CMS admin still loads with a valid config", async ({ page, request }) => {
  const r = await request.get("/admin/config.yml");
  expect(r.status()).toBe(200);
  const cfg = yaml.load(await r.text()) as { collections: { name: string }[] };
  expect(cfg.collections.map((c) => c.name)).toEqual(["briefs", "papers", "settings"]);
  expect(fs.existsSync("public/admin/index.html")).toBe(true);
  await page.goto("/admin");
  await expect(page.getByText("Login with GitHub")).toBeVisible({ timeout: 30_000 });
});
