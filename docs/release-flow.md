# Release flow (Changesets + npm)

This library is **open source** ([MIT](../LICENSE)); releases are published as **`@tmi-packages/ui`** on the **public npm registry** ([npmjs](https://www.npmjs.com/package/@tmi-packages/ui)).

## Maintainer prerequisites (one-time)

Before the first successful automated publish from this repository:

1. **npm scope `@tmi-packages`** — An npm org or user that can **publish** packages under that scope ([npm teams & 2FA](https://docs.npmjs.com/organizations/managing-organization-members) / org policy). Without publish rights, `pnpm publish` fails.
2. **GitHub Actions** — After a changeset merge, **Version packages** bumps `package.json`, tags `vX.Y.Z`, then **calls the Publish workflow** in the same run (reusable `workflow_call`). That does **not** need a PAT. A standalone **`v*` tag push** still starts Publish (manual tag from a maintainer machine). **Actions → Publish → Run workflow** remains the retry path.

3. **CI authentication to npm** — Choose one (or combine with provenance):
   - **A)** Create an [automation or granular token](https://docs.npmjs.com/about-access-tokens) on npm with permission to publish this package. Add it as a GitHub repository (or org) secret **`NPM_TOKEN`** — the [Publish workflow](../.github/workflows/publish.yml) passes it as `NODE_AUTH_TOKEN`.
   - **B)** **[Trusted Publishing](https://docs.npmjs.com/trusted-publishers)** (OIDC) — Link this GitHub repo to the package on npm so publishes can use short-lived tokens. The workflow already requests `id-token: write`; finish the npm-side setup in the npm web UI. If you rely **only** on Trusted Publishing, you may not need a stored `NPM_TOKEN` (per npm’s current behavior — verify on npm docs if that changes).

Maintainers must complete **npm Trusted Publishing (OIDC)** (and optionally `NPM_TOKEN` if you do not use OIDC). Those settings cannot be done by repo automation alone.

## Overview

1. **Changeset** — For each release-worthy change, add a file under `.changeset/` (`pnpm changeset`). This records semver intent (patch / minor / major), not a hand-picked `x.y.z`. Classify using [CONTRIBUTING.md — Public API and semver](../CONTRIBUTING.md#public-api-and-semver) (additive updates to existing components are **minor** unless the public contract or defaults change).
2. **PR to `main`** — Review and merge.
3. **Version packages** — On push to `main`, the [Version packages workflow](../.github/workflows/version-packages.yml) runs. If there are pending changesets, it runs `pnpm run version-packages` (`changeset version` + `pnpm install`), then commits to `main` with message `chore: version packages [skip ci]`.
4. **Tag** — After that commit, the same workflow **creates and pushes** a git tag `vX.Y.Z` that matches `package.json` `"version"` (only when a version commit was actually created; if the tag already exists on the remote, the step is skipped).
5. **Publish** — The same **Version packages** run then **calls** [Publish](../.github/workflows/publish.yml) with that version commit. Publish builds and runs `npm publish` to **registry.npmjs.org** via **Trusted Publishing / OIDC** (do not set `NODE_AUTH_TOKEN` on that job).

> **Important:** Until **Publish** has succeeded, that version is **not** on npm. After merging a changeset, open **Actions** and confirm **Version packages** includes a **Publish** job, then verify the package on npm (below).

## After Publish: verify on npm

1. Open [https://www.npmjs.com/package/@tmi-packages/ui](https://www.npmjs.com/package/@tmi-packages/ui) and confirm the new **version** is listed and **public**.
2. Optionally run `pnpm add @tmi-packages/ui@<version>` in a clean temp project to sanity-check resolution.

## Manual tag (fallback only)

Use this only if automation failed (for example workflow error) or you must repoint a release:

```bash
git pull origin main
git tag vX.Y.Z   # must match package.json "version", with a leading v
git push origin vX.Y.Z
```

If the tag already exists remotely, delete or bump the version appropriately before retrying — avoid duplicate publishes of the same semver.

## Verify automation

After a changeset merges to `main`:

1. **Version packages** — Should run, commit the bump, push tag `vX.Y.Z`, then a **Publish** job in the same run.
2. **Publish** — Should finish without errors (OIDC to npm).
3. Confirm the version on **npmjs** (link above).

## Requirements

- **GitHub Actions** — The Publish workflow needs **`contents: read`** and **`id-token: write`** (provenance / OIDC). It does **not** use `packages: write` (that was for GitHub Packages).
- **OIDC / Trusted Publishing** — npm must trust this repo’s `publish.yml` (already used for 1.x). No `TAG_PUSH_TOKEN` is required for auto-publish after a changeset merge.
- **Secret `NPM_TOKEN`** — Required unless Trusted Publishing fully replaces token-based auth for your setup; add under **Settings → Secrets and variables → Actions**.
- **Branch protection** — Protect **`main`** with required pull requests and status checks. If `main` is protected, allow [github-actions[bot]](https://github.com/orgs/TMI-apps/people) to push the version commit from **Version packages**, or use a follow-up PR model (team choice).
- **Manual workflow runs** — Restrict **workflow_dispatch** on the Publish workflow to trusted maintainers (repo/org settings).

## First-time publish to npm

After a merge that includes a changeset, wait for **Version packages** to bump, tag, and **Publish**. Verify the package page on npm and that the version is **public** (`publishConfig.access` is `"public"` in [`package.json`](../package.json)).

## Optional: legacy GitHub Packages

Older versions may still appear under the repo’s **Packages** tab. Deprecate or document them as needed; new releases go **only** to npm.
