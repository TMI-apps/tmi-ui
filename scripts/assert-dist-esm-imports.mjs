// Fail if published dist .js files contain extensionless relative imports
// (breaks Node ESM + Vitest without inlining the package).
import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const pkgRoot = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const distDir = join(pkgRoot, "dist");

const fromRe = /\bfrom\s+["'](\.\.?\/[^"']+)["']/g;
const importRe = /\bimport\s+["'](\.\.?\/[^"']+)["']/g;
const importParenRe = /\bimport\s*\(\s*["'](\.\.?\/[^"']+)["']\s*\)/g;

function badSpec(spec) {
  if (!spec.startsWith(".")) return false;
  if (spec.endsWith(".js")) return false;
  return true;
}

async function walkJsFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const out = [];
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) {
      out.push(...(await walkJsFiles(p)));
    } else if (e.isFile() && e.name.endsWith(".js")) {
      out.push(p);
    }
  }
  return out;
}

function collectSpecs(text) {
  const specs = new Set();
  for (const re of [fromRe, importRe, importParenRe]) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(text)) !== null) {
      specs.add(m[1]);
    }
  }
  return specs;
}

const files = await walkJsFiles(distDir);
const errors = [];
for (const f of files) {
  const text = await readFile(f, "utf8");
  for (const spec of collectSpecs(text)) {
    if (badSpec(spec)) {
      errors.push(`${relative(pkgRoot, f)}: "${spec}"`);
    }
  }
}

if (errors.length) {
  console.error("assert-dist-esm-imports: extensionless relative imports in dist:\n" + errors.join("\n"));
  process.exit(1);
}
console.log("assert-dist-esm-imports: OK");
