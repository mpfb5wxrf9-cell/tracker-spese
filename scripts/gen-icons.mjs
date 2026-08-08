import sharp from "sharp";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const svg = readFileSync(new URL("../public/favicon.svg", import.meta.url));

const targets = [
  { file: "icon-192.png", size: 192 },
  { file: "icon-512.png", size: 512 },
  { file: "apple-touch-icon.png", size: 180 },
];

for (const { file, size } of targets) {
  await sharp(svg, { density: 384 })
    .resize(size, size)
    .png()
    .toFile(fileURLToPath(new URL(`../public/${file}`, import.meta.url)));
  console.log(`wrote ${file}`);
}
