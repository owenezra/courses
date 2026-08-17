const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const dir = path.join(__dirname, "..", "pairwise-v4", "faq");
const ctx = { console };
ctx.globalThis = ctx;
vm.runInNewContext(fs.readFileSync(path.join(dir, "faq-data.js"), "utf8"), ctx);
vm.runInNewContext(fs.readFileSync(path.join(dir, "faq-search.js"), "utf8"), ctx);

const { FAQ, distance, searchFaq, searchFaqDetailed, tokenize } = ctx;

assert.equal(FAQ.length, 62);
assert.equal(distance("honesty", "honesty"), 0);
assert.equal(distance("honsety", "honesty"), 1);
assert.equal(JSON.stringify(tokenize("Honsety / Lablebox")), JSON.stringify(["honesty", "labelbox"]));

const broad = [
  ["honsety", "honesty-confidence"],
  ["lablebox", "where-work"],
  ["hubstaf", "start-timer"],
  ["vercell", "where-submissions"],
  ["deferance", "deference-interaction"],
  ["paymet", "when-paid"],
  ["biling", "when-paid"],
  ["invoic", "when-paid"],
  ["severety", "severity-how"],
  ["q1", "q1-behavior"],
];

for (const [query, mustInclude] of broad) {
  const ids = searchFaq(FAQ, query).map((item) => item.id);
  assert.ok(ids.includes(mustInclude), `${query} should find ${mustInclude}, got ${ids.slice(0, 8).join(", ")}`);
}

const targeted = [
  ["money", "when-paid"],
  ["salary", "when-paid"],
  ["acces denied", "login-google-only"],
  ["lost task id", "forgot-ids"],
  ["quizz faild retak", "quiz-fail"],
  ["pasword reset", "reset-workforce"],
  ["stuck cant login", "login-google-only"],
  ["misclick relese", "release-vs-skip"],
  ["reviewed week ago not payd", "unpaid-contact-finance"],
  ["contact finance chat", "unpaid-contact-finance"],
  ["three platforms confused", "three-platforms"],
  ["hub stuff", "start-timer"],
  ["task id", "forgot-ids"],
];

for (const query of ["pyment", "pymnt"]) {
  const ids = searchFaq(FAQ, query).slice(0, 5).map((item) => item.id);
  const payIds = ["when-paid", "pay-mismatch", "unpaid-contact-finance", "pass-fail-pay"];
  assert.ok(
    ids.some((id) => payIds.includes(id)),
    `${query} should surface a pay item in top 5, got ${ids.join(", ")}`,
  );
}

{
  const ids = searchFaq(FAQ, "salary").slice(0, 5).map((item) => item.id);
  assert.ok(
    ids.includes("pay-mismatch") || ids.includes("when-paid"),
    `salary should surface pay-mismatch or when-paid, got ${ids.join(", ")}`,
  );
  assert.ok(!ids.includes("forgot-ids"), `salary must not surface forgot-ids, got ${ids.join(", ")}`);
}

{
  const ids = searchFaq(FAQ, "lost task id").map((item) => item.id);
  assert.equal(ids[0], "forgot-ids", `lost task id should rank forgot-ids first, got ${ids.slice(0, 5).join(", ")}`);
}

for (const [query, mustInclude] of targeted) {
  const ids = searchFaq(FAQ, query).map((item) => item.id);
  assert.ok(
    ids.slice(0, 5).includes(mustInclude),
    `${query} should surface ${mustInclude} in top 5, got ${ids.slice(0, 8).join(", ")}`,
  );
}

const longQueries = [
  ["why i dont recieve my payement for task i finish last week", "pay-mismatch"],
  ["i submited but my work is not apearing anywhere please help", "where-submissions"],
  ["hubstuff is not working it says i belong 0 project", "hubstaff-zero-projects"],
  ["the amount of money is wrong less than my tasks", "pay-mismatch"],
  ["my task fail but no feedback from reviewer why", "fail-no-feedback"],
];

for (const [query, mustInclude] of longQueries) {
  const result = searchFaqDetailed(FAQ, query);
  const ids = result.items.map((item) => item.id);
  assert.ok(ids.length > 0, `${query} should never return zero results`);
  assert.ok(
    ids.slice(0, 5).includes(mustInclude),
    `${query} should surface ${mustInclude} in top 5, got ${ids.slice(0, 8).join(", ")}`,
  );
}

assert.equal(searchFaq(FAQ, "xzqvwk").length, 0);
assert.ok(searchFaq(FAQ, "xzqvwk hubstaff").length > 0, "one good token should rescue the query");

console.log("faq search ok");
