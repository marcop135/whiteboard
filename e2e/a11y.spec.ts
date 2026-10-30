import { expect, test } from "./fixtures";

test("home has no serious axe violations", async ({ page, makeAxeBuilder }) => {
  await page.goto("/");
  await expect(page.locator("#root")).toBeVisible();
  const results = await makeAxeBuilder().analyze();
  const serious = results.violations.filter((v) =>
    ["serious", "critical"].includes(v.impact || ""),
  );
  expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
});
