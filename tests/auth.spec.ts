import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  // Go to http://localhost:3000/
  await page.goto("http://localhost:3000/");
  await page.isHidden('[data-test-id="loading_user_popup"]');
  // Click [data-test-id="button_login"]
  await Promise.all([
    page.waitForNavigation(/*{ url: 'http://localhost:3000/login' }*/),
    page.click('[data-test-id="button_login"]'),
  ]);
  // Click [data-test-id="login_email_input"]
  await page.click('[data-test-id="login_email_input"]');
  // Fill [data-test-id="login_email_input"]
  await page.fill('[data-test-id="login_email_input"]', "profronthm@gmail.com");
  // Press Tab
  await page.press('[data-test-id="login_email_input"]', "Tab");
  // Fill [data-test-id="login_password_input"]
  await page.fill('[data-test-id="login_password_input"]', "123123");
  // Press Enter
  await Promise.all([
    page.waitForNavigation(/*{ url: 'http://localhost:3000/' }*/),
    page.press('[data-test-id="login_password_input"]', "Enter"),
  ]);
});

test("test login user", async ({ page }) => {
  // await page.click("text=Meetsy");
  // await expect(page).toHaveURL("http://localhost:3000/");
  // Click button:has-text("WYLOGUJ")
  // await Promise.all([
  //   page.waitForNavigation(/*{ url: 'http://localhost:3000/' }*/),
  //   page.click('button:has-text("WYLOGUJ")'),
  // ]);
});
