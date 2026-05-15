---
"@tmi-packages/ui": major
---

**BREAKING:** Publish under the npm scope **`@tmi-packages`** as **`@tmi-packages/ui`** (was `@tmi-apps/ui`) so the package name matches the npm organization. Consumers must update `package.json` and all `import` paths.

Also includes: public **registry.npmjs.org** publishing (no GitHub Packages for this package), optional **`TAG_PUSH_TOKEN`** so tag pushes trigger **Publish**, and docs/handoff updates. Remove legacy `.npmrc` lines such as `@tmi-apps:registry=https://npm.pkg.github.com` when migrating.
