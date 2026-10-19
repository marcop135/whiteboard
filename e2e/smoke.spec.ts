import { expect, test } from "@playwright/test";

test("home loads and root mounts", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/whiteboard/i);
  await expect(page.locator("#root")).toBeVisible();

  // App chrome rendered: the floating toolbar's Export button is present.
  await expect(page.getByRole("button", { name: "Export" })).toBeVisible();
});


test("mobile toolbars stay docked and their menus fit the viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.locator(".App-toolbar-content .app-toolbar")).toBeVisible();
  const top = await page.locator(".App-toolbar--mobile").boundingBox();
  const bottom = await page.locator(".App-toolbar-content").boundingBox();
  expect(top).toMatchObject({ x: 0, y: 0, width: 390 });
  expect(bottom?.x).toBe(0);
  expect(bottom?.width).toBe(390);
  expect(bottom!.y + bottom!.height).toBe(844);

  await page.locator(".App-toolbar__extra-tools-trigger").click();
  const extraTools = page.locator(".App-toolbar__extra-tools-dropdown");
  await expect(extraTools).toBeVisible();
  const extraBox = await extraTools.boundingBox();
  expect(extraBox!.x).toBeGreaterThanOrEqual(0);
  expect(extraBox!.x + extraBox!.width).toBeLessThanOrEqual(390);
  await page.keyboard.press("Escape");

  await page.getByRole("button", { name: "Canvas tools", exact: true }).click();
  await expect(page.locator(".mobile-misc-tools-container")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator(".mobile-misc-tools-container")).toBeHidden();

  await page.locator(".main-menu-trigger").click();
  const mainMenu = page.locator(".App-toolbar-content .dropdown-menu--mobile");
  await expect(mainMenu).toBeVisible();
  const mainBox = await mainMenu.boundingBox();
  expect(mainBox!.x).toBeGreaterThanOrEqual(0);
  expect(mainBox!.x + mainBox!.width).toBeLessThanOrEqual(390);
});
