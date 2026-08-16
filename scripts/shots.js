const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const dir = "/tmp/courses-shots";
  fs.mkdirSync(dir, { recursive: true });

  await page.goto("http://127.0.0.1:3002/", { waitUntil: "networkidle" });
  await page.getByRole("heading", { name: "Courses" }).waitFor();
  await page.screenshot({ path: path.join(dir, "00-hub.png"), fullPage: true });
  await page.getByRole("link", { name: "Pairwise v4" }).click();
  await page.waitForURL("**/pairwise-v4/**");
  await page.screenshot({ path: path.join(dir, "00-lock.png"), fullPage: true });
  await page.locator("#gate-pass").fill("Pairwise2026!");
  await page.getByRole("button", { name: "Open" }).click();
  await page.getByText("Behavioral Review").first().waitFor({ timeout: 15000 });
  await page.screenshot({ path: path.join(dir, "01-open.png"), fullPage: true });
  await browser.close();
  console.log("shots ok");
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
