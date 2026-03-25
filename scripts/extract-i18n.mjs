/**
 * One-off: extract translation objects from lib/i18n.tsx into locales/*.json
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const srcPath = path.join(root, "client", "src", "lib", "i18n.tsx");
const outDir = path.join(root, "client", "src", "locales");

const lines = fs.readFileSync(srcPath, "utf8").split(/\r?\n/);

/** 1-based line numbers inclusive for inner key lines (between `{` and `},`) */
const blocks = [
  { lang: "en", start: 14, end: 897 },
  { lang: "es", start: 900, end: 1783 },
  { lang: "fr", start: 1786, end: 2669 },
  { lang: "he", start: 2674, end: 3555 },
];

function toJsonObject(lineStart, lineEnd) {
  const slice = lines.slice(lineStart - 1, lineEnd);
  let raw = "{\n" + slice.join("\n") + "\n}";
  raw = raw.replace(/,(\s*\n\})/g, "$1");
  const obj = JSON.parse(raw);
  return obj;
}

fs.mkdirSync(outDir, { recursive: true });
for (const { lang, start, end } of blocks) {
  const obj = toJsonObject(start, end);
  const out = path.join(outDir, `${lang}.json`);
  fs.writeFileSync(out, JSON.stringify(obj, null, 2) + "\n", "utf8");
  console.log("wrote", out, Object.keys(obj).length, "keys");
}
