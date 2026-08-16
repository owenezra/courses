const { chromium } = require("playwright");
const path = require("path");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "networkidle" });
  const dir = "/tmp/courses-shots";
  const fs = require("fs");
  fs.mkdirSync(dir, { recursive: true });
  await page.screenshot({ path: path.join(dir, "01-open.png"), fullPage: true });

  const cards = page.locator("article.card");
  await cards.nth(0).getByRole("button", { name: "No. This is only a code bug." }).click();
  await cards.nth(1).getByRole("button", { name: "Yes. This is a behavior problem." }).click();
  await page.screenshot({ path: path.join(dir, "02-answered.png"), fullPage: true });
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Continue" }).click();

  await page.getByText("Drag a case into a bin").waitFor();
  await page.screenshot({ path: path.join(dir, "03-bins.png"), fullPage: true });

  const chip = page.locator(".chip").first();
  const bin = page.locator('[data-bin="behavior"]');
  const chipBox = await chip.boundingBox();
  const binBox = await bin.boundingBox();
  await page.mouse.move(chipBox.x + chipBox.width / 2, chipBox.y + chipBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(binBox.x + binBox.width / 2, binBox.y + binBox.height / 2, { steps: 12 });
  await page.screenshot({ path: path.join(dir, "04-dragging.png") });
  await page.mouse.up();
  await page.waitForTimeout(250);
  await page.screenshot({ path: path.join(dir, "05-dropped.png"), fullPage: true });

  const inBin = await page.locator('[data-bin="behavior"] .item').count();
  if (inBin < 1) throw new Error("drag did not place a case");
  console.log("shots ok", inBin);
  await browser.close();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
