---
"@tmi-apps/ui": patch
---

Publish to the **public npm registry** (registry.npmjs.org) instead of GitHub Packages. Consumers can install `@tmi-apps/ui` without GitHub Packages authentication. Maintainer setup: npm publish access for `@tmi-apps`, GitHub secret `NPM_TOKEN` and/or Trusted Publishing (OIDC); consuming apps should remove legacy `.npmrc` / `GH_PACKAGES_READ_TOKEN` if only needed for this package—see docs.
