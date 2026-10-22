import { instant } from "@next/playwright";
import { expect, type Page, test } from "@playwright/test";

async function signIn(page: Page) {
  const email = process.env.AUTH_EMAIL;
  const password = process.env.AUTH_PASSWORD;
  if (!email || !password) {
    throw new Error(
      "AUTH_EMAIL and AUTH_PASSWORD must be set for authenticated instant-nav tests",
    );
  }

  await page.goto("/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await page.waitForURL((url) => url.pathname === "/overview");
}

function sidebarLink(page: Page, name: string) {
  return page.getByRole("navigation").first().getByRole("link", { name });
}

test.describe("public landing", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("Create Free Account has the login form ready", async ({ page }) => {
    await page.goto("/");
    const link = page.getByRole("link", { name: "Create Free Account" });
    await expect(link).toBeVisible();

    await instant(page, async () => {
      await link.click();
      await page.waitForURL((url) => url.pathname === "/login");
      await expect(page.getByLabel("Email")).toBeVisible();
      await expect(page.getByLabel("Password")).toBeVisible();
    });
  });
});

test.describe("authenticated app", () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page);
  });

  test("Get Started has Overview ready", async ({ page }) => {
    await page.goto("/");
    const link = page.getByRole("link", { name: "Get Started" });
    await expect(link).toBeVisible();

    await instant(page, async () => {
      await link.click();
      await page.waitForURL((url) => url.pathname === "/overview");
      await expect(page.locator("div.font-bold.text-3xl > span")).toHaveText(
        "Overview",
      );
      await expect(
        page.getByRole("link", { name: "See details" }).first(),
      ).toBeVisible();
    });
  });

  test("sidebar Transactions has the table chrome ready", async ({ page }) => {
    const link = sidebarLink(page, "Transactions");
    await expect(link).toBeVisible();

    await instant(page, async () => {
      await link.click();
      await page.waitForURL((url) => url.pathname === "/transactions");
      await expect(
        page.getByRole("button", { name: "Create Transaction" }),
      ).toBeVisible();
    });
  });

  test("sidebar Budgets has the budgets chrome ready", async ({ page }) => {
    const link = sidebarLink(page, "Budgets");
    await expect(link).toBeVisible();

    await instant(page, async () => {
      await link.click();
      await page.waitForURL((url) => url.pathname === "/budgets");
      await expect(
        page.getByRole("button", { name: "Add Budget" }),
      ).toBeVisible();
    });
  });

  test("sidebar Pots has the pots chrome ready", async ({ page }) => {
    const link = sidebarLink(page, "Pots");
    await expect(link).toBeVisible();

    await instant(page, async () => {
      await link.click();
      await page.waitForURL((url) => url.pathname === "/pots");
      await expect(
        page.getByRole("button", { name: "+ Add New Pot" }),
      ).toBeVisible();
    });
  });

  test("sidebar Recurring Bills has the bills chrome ready", async ({
    page,
  }) => {
    const link = sidebarLink(page, "Recurring Bills");
    await expect(link).toBeVisible();

    await instant(page, async () => {
      await link.click();
      await page.waitForURL((url) => url.pathname === "/recurring");
      await expect(
        page.getByRole("button", { name: "Add Recurring Bill" }),
      ).toBeVisible();
    });
  });
});
