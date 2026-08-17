const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  page.on("pageerror", (err) => errors.push(String(err)));

  await page.goto("http://127.0.0.1:3002/pairwise-v4/faq/", { waitUntil: "networkidle" });
  await page.locator("#gate-pass").fill("Pairwise2026!");
  await page.getByRole("button", { name: "Open" }).click();
  await page.getByRole("heading", { name: "Admin FAQ" }).waitFor({ timeout: 15000 });
  await page.locator("#count").getByText("62 questions").waitFor();

  await page.getByRole("button", { name: /Getting in/ }).click();
  await page.getByText(/questions/).first().waitFor();

  await page.locator("#search").fill("honsety");
  await page.getByText("Honesty or Confidence?").waitFor({ timeout: 5000 });

  await page.locator("#search").fill("why i dont recieve my payement for task i finish last week");
  await page.getByText("The amount I received does not match").waitFor({ timeout: 5000 });

  await page.evaluate(() => {
    location.hash = "quiz-fail";
  });
  await page.getByText("I failed the quiz. Can I retake it?").waitFor();
  await page.getByText("No, you cannot.").waitFor();

  const hrefs = await page.$$eval("a[href]", (els) => els.map((el) => el.getAttribute("href")));
  const bad = hrefs.filter((h) => h && (h.startsWith("/cascade") || h.startsWith("/bank") || h === "/definitions"));
  if (bad.length) throw new Error("internal Abdu links leaked: " + bad.join(", "));

  await page.goto("http://127.0.0.1:3002/pairwise-v4/", { waitUntil: "networkidle" });
  if (await page.locator("#gate-pass").count()) {
    await page.locator("#gate-pass").fill("Pairwise2026!");
    await page.getByRole("button", { name: "Open" }).click();
  }
  await page.getByText("Behavioral Review").first().waitFor({ timeout: 15000 });
  await page.setViewportSize({ width: 800, height: 900 });
  const narrow = await page.getByRole("link", { name: /Admin FAQ/ }).first().boundingBox();
  if (!narrow || narrow.height > 80) throw new Error("narrow admin faq is too tall: " + JSON.stringify(narrow));
  await page.setViewportSize({ width: 1280, height: 900 });
  const wide = await page.getByRole("link", { name: /Admin FAQ/ }).first().boundingBox();
  if (!wide || wide.width > 280 || wide.x < 8) throw new Error("wide admin faq is not a left square: " + JSON.stringify(wide));
  await page.getByRole("link", { name: /Admin FAQ/ }).first().click();
  await page.waitForURL("**/pairwise-v4/faq/**");
  await page.getByRole("heading", { name: "Admin FAQ" }).waitFor();

  await browser.close();
  if (errors.length) {
    console.error(errors.join("\n"));
    process.exit(1);
  }
  console.log("faq page ok");
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
