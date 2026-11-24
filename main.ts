// news-image-20261124 — a one-image summary of world news on Tuesday,
// 24 November 2026. Node 22, standard library only.
//
// The poster (entry.png, 1024x1024) sits beside this file and was drawn
// for this entry. This program checks it is really a PNG, then writes the
// same bytes to /output/entry.png (or MAKEFUN_OUTPUT_DIR when set, for
// local runs). It never touches anything else in the output directory.
//
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, "entry.png");
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const target = join(outDir, "entry.png");

const bytes = readFileSync(source);
if (!bytes.subarray(0, PNG_MAGIC.length).equals(PNG_MAGIC)) {
  throw new Error("entry.png is not a PNG file");
}
if (bytes.length > 1024 * 1024) {
  throw new Error(`entry.png is ${bytes.length} bytes, over the 1 MiB gate`);
}

mkdirSync(outDir, { recursive: true });
writeFileSync(target, bytes);

// Read back what was written so a truncated write fails loudly instead
// of silently shipping a partial image.
const written = readFileSync(target);
if (!written.equals(bytes)) {
  throw new Error("entry.png was not written out whole");
}
console.log(`wrote ${written.length} bytes to ${target}`);
