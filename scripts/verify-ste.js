const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch();
  const errors = [];
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  page.on("pageerror", (err) => errors.push(String(err)));
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });

  await page.goto("http://127.0.0.1:3002/pairwise-v4/", { waitUntil: "networkidle" });
  await page.locator("#gate-pass").fill("Pairwise2026!");
  await page.getByRole("button", { name: "Open" }).click();
  await page.getByText("Behavioral Review").first().waitFor({ timeout: 15000 });

  const home = await page.locator("body").innerText();
  if (home.includes("DEVELOPER MODE")) throw new Error("developer chip visible on home");
  if (home.includes("Developer mode")) throw new Error("developer modal visible before secret");
  if (!home.includes("A COURSE FOR NEW TASKERS")) throw new Error("home missing eyebrow");
  if (/\bReset\b/.test(home) && home.includes("Progress is stored")) {
    const progress = home.split("Progress is stored")[1] || "";
    if (progress.includes("Reset")) throw new Error("home Reset visible without developer mode");
  }

  const eyebrow = page.getByText("A COURSE FOR NEW TASKERS");
  for (let i = 0; i < 5; i++) await eyebrow.click();
  await page.getByText("Enter the developer password", { exact: false }).waitFor({ timeout: 5000 });

  await page.locator("#timer-pw").fill("wrong");
  await page.getByText("TURN ON").click();
  await page.getByText("Not correct.").waitFor();

  await page.locator("#timer-pw").fill("pairwisev4");
  await page.getByText("TURN ON").click();
  await page.getByText("Enter the developer password", { exact: false }).waitFor({ state: "hidden" });
  await page.getByText("Reset", { exact: true }).waitFor({ timeout: 5000 });

  await page.getByText("START", { exact: true }).first().click();
  await page.getByText("RESET PAGE").waitFor({ timeout: 5000 });
  await page.getByText("What you do").waitFor();
  const lesson = await page.content();
  if (!lesson.includes("The flagged issue.")) throw new Error("glossary line missing");
  if (lesson.includes("The pre-written complaint on the transcript.")) {
    throw new Error("old glossary line present");
  }

  await page.getByText("CONTINUE", { exact: true }).click();
  await page.getByText("CONTINUE", { exact: true }).click();
  await page.getByText("Behavior or code?").waitFor();
  await page.getByText("The bug in the code.", { exact: true }).click();
  await page.getByText("CHECK", { exact: true }).click();
  await page.getByText("TRY AGAIN", { exact: true }).waitFor({ timeout: 5000 });

  await page.getByText("EXIT MODULE").click();
  await page.getByText("START", { exact: true }).last().click();
  await page.getByText("Twelve questions").waitFor({ timeout: 5000 });
  const quiz = await page.locator("body").innerText();
  if (quiz.includes("TRY AGAIN")) throw new Error("TRY AGAIN on final quiz");

  await browser.close();
  const ignore = errors.filter((e) => !/favicon|unpkg|Failed to load/i.test(e));
  if (ignore.length) {
    console.error(ignore.join("\n"));
    process.exit(1);
  }
  console.log("verify-ste ok");
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
