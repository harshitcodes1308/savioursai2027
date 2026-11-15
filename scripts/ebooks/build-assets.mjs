// Builds the derived Sidekick ebook assets from private-ebooks/full/*.pdf:
//   private-ebooks/preview/<id>.pdf  — first 5 pages (free preview, kept private)
//   public/ebook-covers/<id>.webp    — page-1 thumbnail for the library and spin wheel
//
// Run: node scripts/ebooks/build-assets.mjs
import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { PDFDocument } from "pdf-lib";
import { createCanvas } from "@napi-rs/canvas";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

const ROOT = path.resolve(import.meta.dirname, "../..");
const FULL_DIR = path.join(ROOT, "private-ebooks/full");
const PREVIEW_DIR = path.join(ROOT, "private-ebooks/preview");
const COVER_DIR = path.join(ROOT, "public/ebook-covers");
const PREVIEW_PAGES = 5;
const COVER_WIDTH = 360;

await mkdir(PREVIEW_DIR, { recursive: true });
await mkdir(COVER_DIR, { recursive: true });

const files = (await readdir(FULL_DIR)).filter((f) => f.endsWith(".pdf"));
for (const file of files) {
  const id = file.replace(/\.pdf$/, "");
  const bytes = await readFile(path.join(FULL_DIR, file));

  // Preview: first N pages.
  const src = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const out = await PDFDocument.create();
  const count = Math.min(PREVIEW_PAGES, src.getPageCount());
  const pages = await out.copyPages(src, Array.from({ length: count }, (_, i) => i));
  pages.forEach((p) => out.addPage(p));
  const previewBytes = await out.save();
  await writeFile(path.join(PREVIEW_DIR, file), previewBytes);

  // Cover: render page 1.
  const doc = await getDocument({ data: new Uint8Array(bytes), disableFontFace: true, verbosity: 0 }).promise;
  const page = await doc.getPage(1);
  const base = page.getViewport({ scale: 1 });
  const viewport = page.getViewport({ scale: (COVER_WIDTH * 2) / base.width });
  const canvas = createCanvas(Math.round(viewport.width), Math.round(viewport.height));
  const ctx = canvas.getContext("2d");
  await page.render({ canvasContext: ctx, viewport, canvas }).promise;

  // Some PDFs have a page larger than the cover artwork; trim the plain border
  // (same colour as the bottom-right corner) so every cover fills its frame.
  const { width: w, height: h } = canvas;
  const px = ctx.getImageData(0, 0, w, h).data;
  const at = (x, y) => (y * w + x) * 4;
  const bg = px.slice(at(w - 1, h - 1), at(w - 1, h - 1) + 3);
  const differs = (i) => Math.abs(px[i] - bg[0]) + Math.abs(px[i + 1] - bg[1]) + Math.abs(px[i + 2] - bg[2]) > 40;
  let maxX = 0, maxY = 0;
  for (let y = 0; y < h; y += 2) for (let x = 0; x < w; x += 2) {
    if (differs(at(x, y))) { if (x > maxX) maxX = x; if (y > maxY) maxY = y; }
  }
  const cropW = maxX + 2 < w * 0.95 ? maxX + 2 : w;
  const cropH = maxY + 2 < h * 0.95 ? maxY + 2 : h;
  const outW = COVER_WIDTH;
  const outH = Math.round((cropH / cropW) * outW);
  const coverCanvas = createCanvas(outW, outH);
  coverCanvas.getContext("2d").drawImage(canvas, 0, 0, cropW, cropH, 0, 0, outW, outH);
  await writeFile(path.join(COVER_DIR, `${id}.webp`), await coverCanvas.encode("webp", 82));
  await doc.destroy();

  console.log(`${id}: preview ${count} pages (${(previewBytes.length / 1024).toFixed(0)} KB), cover written`);
}
