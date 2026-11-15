// Uploads Sidekick ebooks to the PRIVATE Vercel Blob store:
//   sidekick/full/<id>.pdf     (owners only, via short-lived signed links)
//   sidekick/preview/<id>.pdf  (first 5 pages, any signed-in user)
//
// Prereqs: run `node scripts/ebooks/build-assets.mjs` first, and set
// BLOB_READ_WRITE_TOKEN for a store created with *private* access.
// Run: BLOB_READ_WRITE_TOKEN=... node scripts/ebooks/upload-to-blob.mjs
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { put } from "@vercel/blob";

if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.error("BLOB_READ_WRITE_TOKEN is not set. Copy it from Vercel → Storage → your private Blob store.");
  process.exit(1);
}

const ROOT = path.resolve(import.meta.dirname, "../..");

for (const variant of ["full", "preview"]) {
  const dir = path.join(ROOT, "private-ebooks", variant);
  const files = (await readdir(dir)).filter((f) => f.endsWith(".pdf"));
  for (const file of files) {
    const body = await readFile(path.join(dir, file));
    const pathname = `sidekick/${variant}/${file}`;
    await put(pathname, body, {
      access: "private",
      contentType: "application/pdf",
      addRandomSuffix: false,
      allowOverwrite: true,
      multipart: body.length > 5 * 1024 * 1024,
    });
    console.log(`uploaded ${pathname} (${(body.length / 1024 / 1024).toFixed(1)} MB)`);
  }
}
console.log("Done. All Sidekick PDFs are in private Blob storage.");
