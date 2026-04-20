/**
 * Runs `pnpm pack` into a temp directory and asserts the tarball contains
 * expected paths (works with npm/pnpm "package/" tarball layout).
 */
import { execSync } from "node:child_process";
import { mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const pkgRoot = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const pkg = JSON.parse(readFileSync(join(pkgRoot, "package.json"), "utf8"));

const tmp = mkdtempSync(join(tmpdir(), "tmi-ui-pack-"));
try {
  // shell: true so `pnpm` resolves on Windows (pnpm.cmd / PATH)
  execSync(`pnpm pack --pack-destination "${tmp.replace(/\\/g, "/")}"`, {
    cwd: pkgRoot,
    stdio: "inherit",
    shell: true,
  });

  const tgzName = readdirSync(tmp).find((f) => f.endsWith(".tgz"));
  if (!tgzName) {
    throw new Error("pnpm pack did not produce a .tgz in the temp directory");
  }

  const listing = execSync(`tar -tf "${join(tmp, tgzName).replace(/\\/g, "/")}"`, {
    encoding: "utf8",
    shell: true,
  });
  const lines = listing
    .trim()
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => line.replace(/\\/g, "/"));

  function hasPath(suffix) {
    return lines.some((line) => line === suffix || line.endsWith(`/${suffix}`));
  }

  const required = [
    "package/package.json",
    "package/dist/index.js",
    "package/dist/index.d.ts",
    "package/dist/theme.js",
    "package/README.md",
    "package/LICENSE",
    "package/CHANGELOG.md",
  ];

  const missing = required.filter((p) => !hasPath(p));
  if (missing.length) {
    throw new Error(`Tarball missing expected paths:\n${missing.join("\n")}\n\nGot:\n${lines.slice(0, 40).join("\n")}${lines.length > 40 ? "\n…" : ""}`);
  }

  if (!lines.some((l) => l.includes("/dist/ThumbnailPill/"))) {
    throw new Error("Tarball missing dist/ThumbnailPill/*");
  }
  if (!lines.some((l) => l.includes("/dist/VideoEmbedModal/"))) {
    throw new Error("Tarball missing dist/VideoEmbedModal/*");
  }

  const v = pkg.version;
  if (!tgzName.includes(v)) {
    throw new Error(`Expected tarball name to contain version ${v}, got ${tgzName}`);
  }

  console.log(`verify-pack: OK (${tgzName}, ${lines.length} entries)`);
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
