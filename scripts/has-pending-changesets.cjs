/**
 * Exit 0 if at least one releasable Changeset markdown file exists under `.changeset/`.
 * Ignores `config.json` (not .md), and `README.md` in `.changeset/` (documentation only).
 * @see https://github.com/changesets/changesets
 */
const fs = require("node:fs");
const path = require("node:path");

/** @param {string} fileName */
function isReleasableMd(fileName) {
  if (!fileName.toLowerCase().endsWith(".md")) {
    return false;
  }
  if (fileName.toLowerCase() === "readme.md") {
    return false;
  }
  return true;
}

/**
 * @param {string} content
 * @returns {boolean}
 */
function hasValidFrontMatterWithPackages(content) {
  const m = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) {
    return false;
  }
  return /"[^"]+"\s*:\s*(patch|minor|major)/.test(m[1]);
}

/**
 * @param {string} [rootDir]
 * @returns {boolean}
 */
function hasPendingChangesets(rootDir) {
  const base = rootDir != null && rootDir !== "" ? rootDir : process.cwd();
  const changesetDir = path.join(base, ".changeset");
  if (!fs.existsSync(changesetDir) || !fs.statSync(changesetDir).isDirectory()) {
    return false;
  }
  for (const name of fs.readdirSync(changesetDir)) {
    const full = path.join(changesetDir, name);
    if (!isReleasableMd(name) || !fs.statSync(full).isFile()) {
      continue;
    }
    const content = fs.readFileSync(full, "utf8");
    if (hasValidFrontMatterWithPackages(content)) {
      return true;
    }
  }
  return false;
}

function main() {
  const has = hasPendingChangesets();
  process.exit(has ? 0 : 1);
}

if (require.main === module) {
  main();
}

module.exports = {
  hasPendingChangesets,
  hasValidFrontMatterWithPackages,
  isReleasableMd,
};
