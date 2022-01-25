import { PlaywrightTestConfig, devices } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const config: PlaywrightTestConfig = {
  testDir: "./tests",
  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
  },
  use: {
    baseURL: process.env.URL_DOMAIN?.startsWith("localhost")
      ? `http://${process.env.URL_DOMAIN}`
      : `https://${process.env.URL_DOMAIN}`,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    screenshot: "only-on-failure",
    video: "retry-with-video",
  },

  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
    {
      name: "firefox",
      use: {
        ...devices["Desktop Firefox"],
      },
    },
    {
      name: "webkit",
      use: {
        ...devices["Desktop Safari"],
      },
    },
    // {
    //   name: "Mobile Chrome",
    //   use: {
    //     ...devices["Pixel 5"],
    //   },
    // },
    // {
    //   name: "Mobile Safari",
    //   use: {
    //     ...devices["iPhone 12"],
    //   },
    // },
    // {
    //   name: "Microsoft Edge",
    //   use: {
    //     channel: "msedge",
    //   },
    // },
    // {
    //   name: "Google Chrome",
    //   use: {
    //     channel: "chrome",
    //   },
    // },
  ],
};
export default config;
