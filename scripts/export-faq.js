#!/usr/bin/env node
/**
 * Copy the Abdu FAQ + search into vanilla JS for the static course site.
 * Keeps the search implementation byte-faithful after type stripping.
 */
const fs = require("fs");
const path = require("path");

const SRC = process.argv[2] || "/Users/owen/Projects/course-improvements-pr-ste";
const DEST = path.join(__dirname, "..", "pairwise-v4", "faq");

function read(rel) {
  return fs.readFileSync(path.join(SRC, rel), "utf8");
}

function write(name, text) {
  fs.mkdirSync(DEST, { recursive: true });
  const dest = path.join(DEST, name);
  fs.writeFileSync(dest, text);
  console.log("wrote", dest, fs.statSync(dest).size);
}

function stripTypes(src) {
  return src
    .replace(/Set<[^>]+>/g, "Set")
    .replace(/Map<[^>]+>/g, "Map")
    .replace(/:\s*string\[\]\[\]/g, "")
    .replace(/:\s*\{ item: FaqItem; matched: number; score: number \}\[\]/g, "")
    .replace(/:\s*string\[\]/g, "")
    .replace(/:\s*number\[\]\[\]/g, "")
    .replace(/:\s*number\[\]/g, "")
    .replace(/\(value: string\)/g, "(value)")
    .replace(/\(word: string\)/g, "(word)")
    .replace(/function fold\(value: string\): string/g, "function fold(value)")
    .replace(/function (\w+)\(([^)]*)\): [A-Za-z0-9_<>[\]| ]+/g, "function $1($2)");
}

let faqTs = read("app/_data/faq.ts");
faqTs = faqTs.replace(/export type FaqGroup[\s\S]*?export type FaqItem = \{[\s\S]*?\};\n\n/, "");
faqTs = faqTs.replace(/export const /g, "const ");
faqTs = faqTs.replace(': { id: FaqGroup | "all"; label: string }[]', "");
faqTs = faqTs.replace(": FaqItem[]", "");
faqTs += `
for (const item of FAQ) {
  if (item.href && String(item.href).startsWith("/")) {
    delete item.href;
    delete item.hrefLabel;
  }
}
globalThis.FAQ = FAQ;
globalThis.FAQ_GROUPS = FAQ_GROUPS;
`;
write("faq-data.js", faqTs);

let miss = read("app/faq/misspellings.ts");
miss = miss.replace(": Record<string, string>", "");
miss = miss.replace("function add(map: Record<string, string>, from: string, to: string)", "function add(map, from, to)");
miss = miss.replace("function vowelVariants(word: string): string[]", "function vowelVariants(word)");
miss = miss.replace("function expand(word: string): string[]", "function expand(word)");
miss = miss.replace("function buildAliases(): Record<string, string>", "function buildAliases()");
miss = miss.replace("const map: Record<string, string>", "const map");
miss = miss.replace("const pairs: [string, string][]", "const pairs");
miss = miss.replace("const swaps: [RegExp, string][]", "const swaps");
miss = miss.replace("export const ALIASES = buildAliases();", "const ALIASES = buildAliases();");
miss = stripTypes(miss);

let search = read("app/faq/search.ts");
search = search.replace(/import[\s\S]*?from "\.\/misspellings";\n\n/, "");
search = search.replace(/const GROUP_LABEL = Object\.fromEntries\(FAQ_GROUPS\.map\(\(row\) => \[row\.id, row\.label\]\)\)[^;]*;/, "");
search = search.replace("export type FaqSearchResult = {\n  items: FaqItem[];\n  /** True when nothing matched every query word and we fell back to closest matches. */\n  partial: boolean;\n};\n\n", "");
search = search.replace(/export function /g, "function ");
search = search.replace("function tokenize(value: string): string[]", "function tokenize(value)");
search = search.replace("function distance(a: string, b: string): number", "function distance(a, b)");
search = search.replace("function allowedDistance(token: string): number", "function allowedDistance(token)");
search = search.replace("function tokenHits(query: string, hay: string[]): boolean", "function tokenHits(query, hay)");
search = search.replace(
  "function searchFaqDetailed(items: FaqItem[], rawQuery: string): FaqSearchResult",
  "function searchFaqDetailed(items, rawQuery)",
);
search = search.replace("function searchFaq(items: FaqItem[], rawQuery: string): FaqItem[]", "function searchFaq(items, rawQuery)");
search = stripTypes(search);

const searchOut = `${miss}

function faqGroups() {
  return globalThis.FAQ_GROUPS || [];
}
function groupLabel(id) {
  const row = faqGroups().find((item) => item.id === id);
  return row ? row.label : "";
}

${search.replace("GROUP_LABEL[item.group] ?? \"\"", "groupLabel(item.group)")}

globalThis.FAQ_ALIASES = ALIASES;
globalThis.searchFaq = searchFaq;
globalThis.searchFaqDetailed = searchFaqDetailed;
globalThis.tokenize = tokenize;
globalThis.distance = distance;
`;
write("faq-search.js", searchOut);
