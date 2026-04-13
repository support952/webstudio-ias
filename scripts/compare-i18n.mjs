import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const c = fs.readFileSync(path.join(__dirname, "../client/src/lib/i18n.tsx"), "utf8");

const langs = ["en", "es", "fr", "de"];
const blocks = {};

for (const lang of langs) {
  const start = c.indexOf(`  ${lang}: {`);
  if (start === -1) {
    console.error("Block not found:", lang);
    continue;
  }
  let end = c.length;
  for (const other of langs) {
    if (other === lang) continue;
    const i = c.indexOf(`  ${other}: {`, start + 10);
    if (i !== -1 && i < end) end = i;
  }
  const block = c.slice(start, end);
  const keys = [...block.matchAll(/"([^"]+)":/g)].map((m) => m[1]);
  blocks[lang] = new Set(keys);
}

const enKeys = blocks["en"];
for (const lang of ["es", "fr", "de"]) {
  const missing = [...enKeys].filter((k) => !blocks[lang].has(k)).sort();
  const extra = [...blocks[lang]].filter((k) => !enKeys.has(k)).sort();
  console.log(`\n=== ${lang.toUpperCase()} missing (${missing.length}) ===`);
  console.log(missing.join("\n"));
  if (extra.length) {
    console.log(`\n=== ${lang.toUpperCase()} EXTRA not in en (${extra.length}) ===`);
    console.log(extra.join("\n"));
  }
}
