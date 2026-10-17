import { test, expect } from "@playwright/test";

test.describe("Newsroom smoke test", () => {
  test("loads discover page, displays news list and allows source switching", async ({
    page,
  }) => {
    await page.goto("/");

    // Verify main discover title
    await expect(page.getByRole("heading", { name: "Discover" })).toBeVisible();

    // Verify presence of filter panel
    await expect(page.getByRole("combobox", { name: "Data source" })).toBeVisible();

    // Verify news or status panel loads
    const hasCards = (await page.locator("article").count()) > 0;
    const hasStatus = await page.getByRole("region", { name: "News list" }).isVisible();
    expect(hasCards || hasStatus).toBeTruthy();

    // Switch data source to The Guardian
    await page.getByRole("combobox", { name: "Data source" }).click();
    await page.getByRole("option", { name: "The Guardian" }).click();
    await expect(page.getByText("The Guardian")).toBeVisible();

    // Verify author input becomes enabled for Guardian
    await expect(page.getByLabel("Authors")).toBeEnabled();
  });

  test("allows saving a custom search preset to local storage", async ({
    page,
  }) => {
    await page.goto("/");

    // Click Save as feed
    const saveButton = page.getByRole("button", { name: "Save as feed" });
    await expect(saveButton).toBeVisible();
    await saveButton.click();

    // Fill in feed name in modal
    const nameInput = page.getByLabel("Feed name");
    await expect(nameInput).toBeVisible();
    await nameInput.fill("Morning Tech");
    await page.getByRole("button", { name: "Save", exact: true }).click();

    // Verify saved feed notice appears
    await expect(page.getByText("Feed saved.")).toBeVisible();

    // Verify dropdown reflects saved feed
    const select = page.getByLabel("Saved feeds");
    await expect(select).toContainText("Morning Tech");
  });
});
