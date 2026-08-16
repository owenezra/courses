#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.join(__dirname, "..");
const src = fs.readFileSync(path.join(root, "pairwise-v4/js/content.js"), "utf8");
const ctx = {};
vm.createContext(ctx);
vm.runInContext(src, ctx);
const course = ctx.COURSE;
if (!course) {
  console.error("COURSE is missing");
  process.exit(1);
}

const types = new Set([
  "teach",
  "cards",
  "choice",
  "sort",
  "match",
  "checklist",
  "steps",
  "desk",
  "axes",
  "severity",
  "compare",
  "fail",
  "done",
]);

const errors = [];
const warnings = [];
const ids = new Set();

function words(text) {
  return String(text)
    .replace(/[“”]/g, '"')
    .split(/\s+/)
    .filter(Boolean).length;
}

function checkSentences(label, text, limit) {
  String(text)
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .forEach((sentence) => {
      const n = words(sentence);
      if (n > limit) {
        warnings.push(`${label} has ${n} words (limit ${limit}): ${sentence}`);
      }
    });
}

if (!course.screens.length) errors.push("no screens");
course.screens.forEach((screen, i) => {
  if (!screen.id) errors.push(`screen ${i} has no id`);
  if (ids.has(screen.id)) errors.push(`duplicate id ${screen.id}`);
  ids.add(screen.id);
  if (!types.has(screen.type)) errors.push(`${screen.id} has unknown type ${screen.type}`);
  if (!course.stations.some((s) => s.id === screen.station)) {
    errors.push(`${screen.id} has unknown station ${screen.station}`);
  }
  if (!screen.title) errors.push(`${screen.id} has no title`);

  const copy = []
    .concat(screen.lead || [], screen.body || [], screen.notes || [], screen.after || [])
    .concat(screen.ok || [], screen.bad || []);
  copy.forEach((line) => checkSentences(screen.id, line, 25));

  if (screen.type === "choice") {
    const right = (screen.choices || []).filter((c) => c.correct);
    if (right.length !== 1) errors.push(`${screen.id} needs one correct choice`);
  }
  if (screen.type === "cards") {
    (screen.items || []).forEach((item, n) => {
      if (typeof item.answer !== "boolean") errors.push(`${screen.id} card ${n} needs answer`);
    });
  }
  if (screen.type === "desk") {
    if (!screen.questions?.length) errors.push(`${screen.id} desk has no questions`);
    (screen.questions || []).forEach((q) => {
      const right = (q.choices || []).filter((c) => c.correct);
      if (right.length !== 1) errors.push(`${screen.id} ${q.id} needs one correct choice`);
    });
  }
  if (screen.type === "sort") {
    (screen.items || []).forEach((item) => {
      if (!screen.bins.some((b) => b.id === item.bin)) {
        errors.push(`${screen.id} item ${item.id} has unknown bin`);
      }
    });
  }
});

const files = [
  "index.html",
  "catalog.js",
  "shared/gate.js",
  "pairwise-v4/index.html",
  "pairwise-v4/css/course.css",
  "pairwise-v4/js/app.js",
  "pairwise-v4/js/content.js",
];
files.forEach((file) => {
  if (!fs.existsSync(path.join(root, file))) errors.push(`missing ${file}`);
});

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`ok ${course.screens.length} screens`);
if (warnings.length) {
  console.log(warnings.join("\n"));
}
