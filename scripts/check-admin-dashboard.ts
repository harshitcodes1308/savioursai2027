/** Run against a local Next server: ADMIN_TEST_PASSWORD=... npx tsx scripts/check-admin-dashboard.ts */
import { config } from "dotenv";
import { mkdir } from "node:fs/promises";
import { prisma as ledgerPrisma } from "../src/lib/prisma";
import { randomUUID } from "node:crypto";
import assert from "node:assert/strict";
import { chromium } from "playwright";
import { PrismaClient } from "@prisma/client";
import { SignJWT } from "jose";
import { recordCapturedPayment } from "../src/lib/payment-ledger";
config({ quiet: true });

async function main() {
  const base = process.env.ADMIN_TEST_URL ?? "http://localhost:3102";
  assert(["localhost", "127.0.0.1"].includes(new URL(base).hostname), "Use a local Next server for fixture tests");
  assert(process.env.ADMIN_TEST_PASSWORD, "ADMIN_TEST_PASSWORD is required");
  assert(process.env.JWT_SECRET, "JWT_SECRET is required");
  await mkdir("output/admin", { recursive: true });
  const prisma = new PrismaClient();
  const run = `admin-qa-${randomUUID()}`;
  const ids: string[] = [];
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  try {
    const baseline = await prisma.user.count({ where: { email: { not: "demo@saviours.test" } } });
    const baselineClaims = await prisma.user.count({ where: { email: { not: "demo@saviours.test" }, ebookSpinAt: { not: null } } });
    const now = new Date();
    for (const [index, planType] of (["FREE", "PRO", "PRO", "BUNDLE"] as const).entries()) {
      const id = `${run}-${index}`; ids.push(id);
      await prisma.user.create({ data: { id, email: `${id}@saviours.test`, name: `QA student ${index}`, planType,
        isPaid: index > 0, onboardingComplete: true, subscriptionStatus: "ACTIVE",
        subscriptionExpiry: index === 0 ? null : new Date(now.getTime() + (index === 2 ? -1 : 1) * 86400_000),
        ebookSpinAt: index === 0 || index === 2 ? now : null, ebookSpinPrize: index === 0 ? "biology" : index === 2 ? "physics" : null,
        ebooksUnlocked: index === 3, ebooksUnlockSource: index === 3 ? "BUNDLE" : null,
      } });
    }
    await prisma.auditLog.create({ data: { id: `presence:${ids[0]}`, userId: ids[0], action: "DASHBOARD_PRESENCE", timestamp: now } });
    await prisma.auditLog.create({ data: { id: `presence:${ids[1]}`, userId: ids[1], action: "DASHBOARD_PRESENCE", timestamp: new Date(now.getTime() - 180_000) } });
    await recordCapturedPayment(ids[0], { id: `${run}-single`, amount: 4900, currency: "INR" }, "EBOOK_SINGLE");
    await recordCapturedPayment(ids[0], { id: `${run}-single`, amount: 4900, currency: "INR" }, "EBOOK_SINGLE");
    await recordCapturedPayment(ids[3], { id: `${run}-bundle`, amount: 29900, currency: "INR" }, "EBOOK_BUNDLE");
    assert.equal(await prisma.auditLog.count({ where: { userId: { in: ids }, action: "PAYMENT_CAPTURED" } }), 2, "Capture retries must deduplicate");
    const student = await browser.newContext();
    const user = { id: ids[0], email: `${ids[0]}@saviours.test`, name: "QA", role: "STUDENT", planType: "FREE", isPaid: false, subscriptionStatus: "ACTIVE", onboardingComplete: true };
    const token = await new SignJWT({ user }).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("5m").sign(new TextEncoder().encode(process.env.JWT_SECRET));
    await student.addCookies([{ name: "auth-token", value: token, url: base, httpOnly: true }]);
    assert.equal((await student.request.post(base + "/api/activity", { data: { feature: "bad-feature", visit: true } })).status(), 400);
    for (let i = 0; i < 2; i++) assert.equal((await student.request.post(base + "/api/activity", { data: { feature: "ebooks", visit: true } })).status(), 204);
    assert.equal(await prisma.auditLog.count({ where: { userId: ids[0], action: "DASHBOARD_FEATURE_OPEN" } }), 1, "Feature retries deduplicate within a minute");
    assert.equal(await prisma.auditLog.count({ where: { userId: ids[0], action: "DASHBOARD_PRESENCE" } }), 1, "Heartbeats update one row per user");
    await student.close();

    const page = await browser.newPage({ viewport: { width: 1440, height: 1080 } });
    const errors: string[] = []; page.on("pageerror", error => errors.push(error.message));
    await page.goto(base + "/admin"); await page.getByRole("heading", { name: "Welcome back." }).waitFor();
    assert.equal(await page.getByText("Total signups", { exact: true }).count(), 0);
    assert.equal((await page.request.get(base + "/api/admin/creators")).status(), 401);
    assert.equal((await page.request.post(base + "/api/activity", { data: { feature: "ebooks", visit: true } })).status(), 401);
    await page.getByLabel("Email address", { exact: true }).fill("care.savioursai@gmail.com");
    await page.getByLabel("Password", { exact: true }).fill(process.env.ADMIN_TEST_PASSWORD);
    await page.getByRole("button", { name: "Sign in", exact: true }).click();
    await page.getByRole("heading", { name: "Overview", exact: true }).waitFor({ timeout: 90000 });
    const values = await page.locator(".admin-metric-value").allTextContents();
    assert.equal(values[0], (baseline + 4).toLocaleString("en-IN")); assert.equal(values[2], (baselineClaims + 2).toLocaleString("en-IN"));
    const paid = await prisma.user.count({ where: { email: { not: "demo@saviours.test" }, OR: [
      { isPaid: true, subscriptionExpiry: null }, { isPaid: true, subscriptionExpiry: { gt: now } },
      { planType: { in: ["PRO", "BUNDLE"] }, subscriptionStatus: "ACTIVE", OR: [{ subscriptionExpiry: null }, { subscriptionExpiry: { gt: now } }] },
    ] } });
    assert.equal(values[1], paid.toLocaleString("en-IN"), "Expired paid access must not count");
    assert(Number(values[3].replaceAll(",", "")) >= 1, "Recent heartbeat is online");
    await page.mouse.move(0, 0); await page.screenshot({ path: "output/admin/overview-desktop.png", fullPage: true });
    for (const [path, title] of [["users", "Users"], ["features", "Feature usage"], ["revenue", "Revenue"], ["creators", "Creators"]]) {
      await page.goto(`${base}/admin/${path}`); await page.locator("h1").filter({ hasText: title }).waitFor({ timeout: 90000 });
      assert.equal(await page.getByRole("heading", { name: "Unable to load this view." }).count(), 0);
      if (path === "users") {
        for (const plan of ["PRO", "BUNDLE", "FREE"]) {
          const select = page.getByRole("combobox", { name: "Plan for QA student 0", exact: true });
          await Promise.all([
            page.waitForResponse(response => response.request().method() === "POST" && new URL(response.url()).pathname === "/admin/users"),
            select.selectOption(plan),
          ]);
          const updated = await prisma.user.findUniqueOrThrow({ where: { id: ids[0] } });
          assert.equal(updated.planType, plan, "Admin-cookie login can change plans");
          if (plan === "BUNDLE") assert(updated.ebooksUnlocked, "Bundle grants library access");
          await page.waitForFunction(expected => document.querySelector<HTMLSelectElement>('select[aria-label="Plan for QA student 0"]')?.value === expected, plan);
        }
        await page.getByRole("button", { name: "Free ebook claimed", exact: true }).click();
        await page.waitForURL("**/admin/users?filter=claimed"); await page.getByRole("heading", { name: "Registered users" }).waitFor();
        assert.equal(await page.getByText("Not claimed", { exact: true }).count(), 0);
        await page.getByRole("button", { name: "All users", exact: true }).click(); await page.waitForURL(url => url.pathname === "/admin/users" && !url.search);
        await page.getByRole("textbox", { name: "Search users" }).fill("no-such-user-qa@example.invalid"); await page.getByRole("button", { name: "Search", exact: true }).click();
        await page.getByText("No users match this search.").waitFor();
      }
      if (path === "revenue") { await page.getByText(`${run}-bundle`, { exact: true }).waitFor(); }
    }
    await page.goto(base + "/admin"); await page.getByRole("heading", { name: "Overview", exact: true }).waitFor();
    await page.setViewportSize({ width: 390, height: 844 }); await page.reload(); await page.getByRole("heading", { name: "Overview", exact: true }).waitFor(); await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))); await page.screenshot({ path: "output/admin/overview-mobile.png", fullPage: true });
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "Mobile overview overflow");
    await page.goto(base + "/admin/users"); await page.getByRole("heading", { name: "Registered users" }).waitFor();
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "Mobile users overflow");
    await page.getByRole("button", { name: "Sign out", exact: true }).last().click(); await page.getByRole("heading", { name: "Welcome back." }).waitFor();
    assert(!(await page.context().cookies()).some(c => c.name === "admin-token" && c.value), "Logout clears HttpOnly cookie");
    assert.deepEqual(errors, [], "Browser runtime errors");
    console.log("PASS: admin auth, API guards, live counts, expired access, claim filters/search, payment deduplication, activity validation/deduplication, admin plan changes, all views, mobile layout and logout.");
  } finally {
    await prisma.user.deleteMany({ where: { id: { in: ids } } });
    await browser.close(); await prisma.$disconnect(); await ledgerPrisma.$disconnect();
  }
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
