const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch();
  const errors = [];
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  page.on("pageerror", (err) => errors.push(String(err)));
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });

  await page.goto("http://127.0.0.1:3002/", { waitUntil: "networkidle" });
  await page.getByRole("heading", { name: "Courses" }).waitFor();
  await page.getByRole("link", { name: "Pairwise v4" }).click();
  await page.waitForURL("**/pairwise-v4/**");
  await page.locator("#gate-pass").fill("wrong");
  await page.getByRole("button", { name: "Open" }).click();
  await page.locator("#gate-error").waitFor({ state: "visible" });
  await page.locator("#gate-pass").fill("Pairwise2026!");
  await page.getByRole("button", { name: "Open" }).click();
  await page.getByText("Behavioral Review").first().waitFor({ timeout: 15000 });
  const body = await page.locator("body").innerText();
  if (!body.includes("A COURSE FOR NEW TASKERS") && !body.includes("The job")) {
    throw new Error("course home did not render: " + body.slice(0, 400));
  }
  await browser.close();
  const ignore = errors.filter((e) => !/favicon|unpkg|Failed to load/i.test(e));
  if (ignore.length) {
    console.error(ignore.join("\n"));
    process.exit(1);
  }
  console.log("play ok");
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
