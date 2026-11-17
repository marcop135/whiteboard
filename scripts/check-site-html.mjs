#!/usr/bin/env node
/**
 * check:html: checks the built HTML in dist/ (run npm run build first).
 * - <title> 30-65 characters, <meta name="description"> 70-160 characters.
 * - Every root-relative href/src resolves to a file in dist/.
 * Usage: node scripts/check-site-html.mjs
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");

// Extensionless routes Apache rewrites (public/.htaccess).
const rewrites = { "/privacy": "privacy.html", "/privacy/": "privacy.html" };

const TITLE = [30, 65];
const DESCRIPTION = [70, 160];

const failures = [];

if (!existsSync(dist)) {
  console.error("dist/ missing: run npm run build first");
  process.exit(1);
}

// One pass, so a decoded "&" is never decoded again ("&amp;lt;" stays "&lt;").
const ENTITIES = { "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#39;": "'" };
const decode = (s) =>
  s
    .replace(/&(?:amp|lt|gt|quot|#39);/g, (m) => ENTITIES[m])
    .replace(/\s+/g, " ")
    .trim();

const length = (s) => [...s].length;

function htmlFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return name === "assets" ? [] : htmlFiles(path);
    return name.endsWith(".html") ? [path] : [];
  });
}

function resolves(url) {
  const path = url.split(/[?#]/)[0];
  if (rewrites[path]) return existsSync(join(dist, rewrites[path]));
  const target = join(dist, decodeURIComponent(path));
  if (!existsSync(target)) return false;
  return statSync(target).isDirectory() ? existsSync(join(target, "index.html")) : true;
}

function checkBounds(file, field, value, [min, max]) {
  if (value === undefined) {
    failures.push(`${file}: missing ${field}`);
    return;
  }
  const n = length(value);
  if (n < min || n > max) failures.push(`${file}: ${field} is ${n} characters (want ${min}-${max}): ${value}`);
}

const files = htmlFiles(dist);
for (const path of files) {
  const file = path.slice(dist.length + 1).replace(/\\/g, "/");
  const html = readFileSync(path, "utf8");

  const title = html.match(/<title>([^<]*)<\/title>/i)?.[1];
  checkBounds(file, "title", title && decode(title), TITLE);

  const description =
    html.match(/<meta\s+name="description"\s+content="([^"]*)"/i)?.[1] ??
    html.match(/<meta\s+content="([^"]*)"\s+name="description"/i)?.[1];
  checkBounds(file, "description", description && decode(description), DESCRIPTION);

  for (const [, url] of html.matchAll(/\s(?:href|src)="(\/(?!\/)[^"]*)"/g)) {
    if (!resolves(url)) failures.push(`${file}: broken internal link ${url}`);
  }
}

if (failures.length) {
  console.error(failures.map((f) => `- ${f}`).join("\n"));
  process.exit(1);
}
console.log(`check:html OK (${files.length} pages in dist/)`);
