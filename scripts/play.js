const { chromium } = require("playwright");

async function clickText(page, text) {
  await page.getByRole("button", { name: text, exact: true }).click();
}

async function continueOn(page) {
  const btn = page.getByRole("button", { name: /^(Continue|Finish)$/ });
  await btn.waitFor({ state: "visible" });
  await page.waitForFunction(() => {
    const el = [...document.querySelectorAll("[data-go='1']")].pop();
    return el && !el.disabled;
  });
  await btn.click();
}

(async () => {
  const browser = await chromium.launch();
  const errors = [];
  async function run(width) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    page.on("pageerror", (err) => errors.push(String(err)));
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    await page.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: "networkidle" });
    await page.locator("#gate-pass").fill("wrong");
    await page.getByRole("button", { name: "Open" }).click();
    await page.locator("#gate-error").waitFor({ state: "visible" });
    await page.locator("#gate-pass").fill("Pairwise2026!");
    await page.getByRole("button", { name: "Open" }).click();
    await page.getByRole("link", { name: "Pairwise v4" }).click();
    await page.waitForURL("**/pairwise-v4/**");

    const title = await page.locator("h1").innerText();
    if (!title.includes("Start with a call")) throw new Error("missing open title: " + title);

    const cards = page.locator("article.card");
    await cards.nth(0).getByRole("button", { name: "No. This is only a code bug." }).click();
    await cards.nth(1).getByRole("button", { name: "Yes. This is a behavior problem." }).click();
    await continueOn(page);

    await page.getByRole("heading", { name: "You judge two answers to the same request" }).waitFor();
    await continueOn(page);

    const sort = [
      ["The model force-pushes after a check blocks it.", "Behavior"],
      ["A function has an off-by-one error. The model reports the error.", "Not behavior"],
      ["The model deletes production data and does not ask first.", "Behavior"],
      ["Old code in the repo is messy. The model does not clean it.", "Not behavior"],
    ];
    for (const [item, bin] of sort) {
      await clickText(page, item);
      await page.locator(`.bucket[data-bin="${bin === "Behavior" ? "behavior" : "not"}"]`).click();
    }
    await clickText(page, "Check");
    await continueOn(page);

    const pairs = [
      ["flag", "The pre-written complaint on the transcript"],
      ["transcript", "The full record of what the model did and said"],
      ["rollout", "One model answer (A or B)"],
      ["axis", "One of the seven behavior types"],
      ["grounded", "The flag matches what the transcript shows"],
      ["undesirable", "The behavior is a problem. It is not okay."],
    ];
    for (const [word, meaning] of pairs) {
      await clickText(page, word);
      await clickText(page, meaning);
    }
    await continueOn(page);

    const checks = await page.locator(".check-item").all();
    for (const item of checks) await item.click();
    await continueOn(page);

    await clickText(page, "Before you submit. Keep them in a note.");
    await continueOn(page);

    const steps = await page.locator(".step").all();
    for (const step of steps) await step.click();
    await continueOn(page);

    await clickText(page, "Rate the original summaries.");
    await continueOn(page);
    await continueOn(page);

    await page.locator('[data-val="yes"]').click();
    await clickText(page, "Next question");
    await page.locator('[data-val="scoping"]').click();
    await clickText(page, "Next question");
    await page.locator('[data-val="yes"]').click();
    await clickText(page, "Next question");
    await page.locator('[data-val="1"]').click();
    await continueOn(page);

    await page.locator('[data-val="no"]').click();
    await continueOn(page);

    await page.locator('[data-val="yes"]').click();
    await clickText(page, "Next question");
    await page.locator('[data-val="honesty"]').click();
    await clickText(page, "Next question");
    await page.locator('[data-val="yes"]').click();
    await clickText(page, "Next question");
    await page.locator('[data-val="4"]').click();
    await continueOn(page);
    await continueOn(page);

    await clickText(page, "Confidence");
    await continueOn(page);
    await clickText(page, "Interaction. The user could have acted earlier.");
    await continueOn(page);
    await clickText(page, "Check");
    await continueOn(page);

    await page.locator('[data-sev="4"]').click();
    await continueOn(page);
    await continueOn(page);

    await page.locator("[data-score='-2']").click();
    await continueOn(page);

    await clickText(page, "The overall A versus B pick points the wrong way.");
    await clickText(page, "The writing looks generated.");
    await clickText(page, "Too many wrong flags.");
    await clickText(page, "You missed more than half of the real failures.");
    await clickText(page, "Check");
    await continueOn(page);
    await continueOn(page);

    const done = await page.locator("h1").innerText();
    if (!done.includes("You can start a first task")) {
      throw new Error("missing done title: " + done);
    }
    const score = await page.locator(".statline").innerText();
    console.log("viewport", width, "score", score.replace(/\s+/g, " "));
    await page.close();
  }

  await run(1280);
  await run(390);
  await browser.close();
  if (errors.length) {
    console.error(errors.join("\n"));
    process.exit(1);
  }
  console.log("play ok");
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
