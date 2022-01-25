import { test, expect } from "@playwright/test";

// test("test view", async ({ page }) => {
//   // Go to http://localhost:3000/
//   await page.goto("http://localhost:3000/");

//   await page.waitForTimeout(5000);

//   // Click [data-test-id="loading_user_popup"]
//   await page.isHidden('[data-test-id="loading_user_popup"]');

//   // Click text=Meetsy
//   // await Promise.all([
//   //   page.waitForNavigation(/*{ url: 'http://localhost:3000/' }*/),
//   //   page.click("text=Meetsy"),
//   // ]);
//   expect(await page.screenshot()).toMatchSnapshot("mainPage.png", {
//     threshold: 0.3,
//   });

//   // expect(await page.screenshot()).toMatchSnapshot(["landing", "step2.png"]);
// });
