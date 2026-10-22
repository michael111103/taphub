// Cek link rusak di website.
// Cara pakai: jalankan `npm run build && npm run start`, lalu di terminal lain: `npm run check-links`
// Bisa juga cek website live: `node scripts/check-links.mjs https://taphub.id`
const base = (process.argv[2] || "http://localhost:3000").replace(/\/$/, "");
const origin = new URL(base).origin;

const queue = ["/"];
const seenPages = new Set();
const checked = new Map(); // url -> status
const broken = [];

async function status(url) {
  if (checked.has(url)) return checked.get(url);
  let code;
  try {
    const res = await fetch(url, { redirect: "follow" });
    code = res.status;
  } catch (e) {
    code = `ERROR ${e.message}`;
  }
  checked.set(url, code);
  return code;
}

while (queue.length) {
  const path = queue.shift();
  if (seenPages.has(path)) continue;
  seenPages.add(path);
  const res = await fetch(origin + path);
  if (!res.ok) {
    broken.push({ from: "(start)", url: origin + path, code: res.status });
    continue;
  }
  const html = await res.text();
  const refs = [...html.matchAll(/(?:href|src)="([^"#][^"]*)"/g)].map((m) => m[1].replace(/&amp;/g, "&"));
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  for (const hashRef of [...html.matchAll(/href="\/?#([^"]+)"/g)].map((m) => m[1])) {
    if (!ids.has(hashRef) && path === "/") broken.push({ from: path, url: `#${hashRef}`, code: "anchor tidak ditemukan" });
  }
  for (const ref of refs) {
    if (/^(mailto:|tel:|data:|javascript:)/.test(ref)) continue;
    const url = new URL(ref, origin + path);
    if (url.origin !== origin) continue; // link luar (WhatsApp, Instagram) tidak dicek otomatis
    const clean = url.origin + url.pathname + url.search;
    const code = await status(clean);
    if (typeof code !== "number" || code >= 400) broken.push({ from: path, url: clean, code });
    else if (!/\.(png|jpe?g|svg|webp|avif|ico|css|js|xml|txt)$/.test(url.pathname) && !url.pathname.startsWith("/_next")) queue.push(url.pathname);
  }
}

console.log(`Halaman dicek: ${seenPages.size}, URL dicek: ${checked.size}`);
if (broken.length) {
  console.log("Link rusak:");
  for (const b of broken) console.log(`  [${b.code}] ${b.url}  (di ${b.from})`);
  process.exit(1);
}
console.log("Tidak ada link rusak.");
