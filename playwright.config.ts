import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  workers: 4,
  reporter: "list",
  use: { baseURL: "http://127.0.0.1:5176", trace: "retain-on-failure" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    {
      name: "mobile",
      use: { ...devices["iPhone 13"], defaultBrowserType: "chromium" },
    },
  ],
  webServer: {
    command:
      "pnpm exec vite build --outDir .e2e-dist && pnpm exec vite preview --outDir .e2e-dist --host 127.0.0.1 --port 5176 --strictPort",
    url: "http://127.0.0.1:5176",
    reuseExistingServer: false,
    env: {
      VITE_NEWSAPI_BASE_URL: "https://newsapi.org/v2",
      VITE_GUARDIAN_BASE_URL: "https://content.guardianapis.com",
      VITE_NYT_BASE_URL: "https://api.nytimes.com/svc/search/v2",
      VITE_NEWSAPI_API_KEY: "test-key",
      VITE_GUARDIAN_API_KEY: "test-key",
      VITE_NYT_API_KEY: "test-key",
    },
  },
});
