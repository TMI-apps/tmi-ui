# Release flow (Changesets + npm)

This library is **open source** ([MIT](../LICENSE)); releases are published as **`@tmi-packages/ui`** on the **public npm registry** ([npmjs](https://www.npmjs.com/package/@tmi-packages/ui)).

## Maintainer prerequisites (one-time)

Before the first successful automated publish from this repository:

1. **npm scope `@tmi-packages`** — An npm org or user that can **publish** packages under that scope ([npm teams & 2FA](https://docs.npmjs.com/organizations/managing-organization-members) / org policy). Without publish rights, `pnpm publish` fails.
2. **GitHub — tag push that triggers Publish** — The [Version packages workflow](../.github/workflows/version-packages.yml) creates the `v*` tag. Pushes made with only the default `GITHUB_TOKEN` **do not** trigger other workflows, so **Publish** would not run. Add repository secret **`TAG_PUSH_TOKEN`**: a [classic PAT](https://github.com/settings/tokens) with **`repo`** scope (or a fine-grained PAT with **Contents: Read and write** on this repo), belonging to a user/bot that may push tags. The workflow unsets checkout’s `GITHUB_TOKEN` git extraheader, then pushes the tag with this PAT so **Publish** starts automatically. Until this is set, run **Publish** manually after each release tag (**Actions → Publish → Run workflow**).

3. **CI authentication to npm** — Choose one (or combine with provenance):
   - **A)** Create an [automation or granular token](https://docs.npmjs.com/about-access-tokens) on npm with permission to publish this package. Add it as a GitHub repository (or org) secret **`NPM_TOKEN`** — the [Publish workflow](../.github/workflows/publish.yml) passes it as `NODE_AUTH_TOKEN`.
   - **B)** **[Trusted Publishing](https://docs.npmjs.com/trusted-publishers)** (OIDC) — Link this GitHub repo to the package on npm so publishes can use short-lived tokens. The workflow already requests `id-token: write`; finish the npm-side setup in the npm web UI. If you rely **only** on Trusted Publishing, you may not need a stored `NPM_TOKEN` (per npm’s current behavior — verify on npm docs if that changes).

Maintainers must complete **TAG_PUSH_TOKEN**, **npm token / OIDC**, and related steps in **GitHub** and **npm** settings; they cannot be done by repo automation alone.

## Overview

1. **Changeset** — For each release-worthy change, add a file under `.changeset/` (`pnpm changeset`). This records semver intent (patch / minor / major), not a hand-picked `x.y.z`. Classify using [CONTRIBUTING.md — Public API and semver](../CONTRIBUTING.md#public-api-and-semver) (additive updates to existing components are **minor** unless the public contract or defaults change).
2. **PR to `main`** — Review and merge.
3. **Version packages** — On push to `main`, the [Version packages workflow](../.github/workflows/version-packages.yml) runs. If there are pending changesets, it runs `pnpm run version-packages` (`changeset version` + `pnpm install`), then commits to `main` with message `chore: version packages [skip ci]`.
4. **Tag** — After that commit, the same workflow **creates and pushes** a git tag `vX.Y.Z` that matches `package.json` `"version"` (only when a version commit was actually created; if the tag already exists on the remote, the step is skipped).
5. **Publish** — The [Publish workflow](../.github/workflows/publish.yml) runs on `v*` tag pushes, builds, and runs `pnpm publish` to **registry.npmjs.org** using **`NPM_TOKEN`** (and/or Trusted Publishing / OIDC as configured).

> **Important:** Until the **tag** exists and **Publish** has succeeded, that version is **not** on npm. After merging, open **Actions** and confirm **Version packages** then **Publish** completed, then verify the package on npm (below).

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

1. **Version packages** — Should run, commit the bump, then push tag `vX.Y.Z`.
2. **Publish** — Should run on that tag push and finish without errors.
3. Confirm the version on **npmjs** (link above).

## Requirements

- **GitHub Actions** — The Publish workflow needs **`contents: read`** and **`id-token: write`** (provenance / OIDC). It does **not** use `packages: write` (that was for GitHub Packages).
- **Secret `TAG_PUSH_TOKEN`** — PAT (`repo` or fine-grained contents write) so the **tag push** from [Version packages](../.github/workflows/version-packages.yml) triggers **Publish**. The tag step must drop checkout’s persisted `GITHUB_TOKEN` extraheader; a PAT in the remote URL alone is not enough. Without the secret, run **Publish** manually after each tag.
- **Secret `NPM_TOKEN`** — Required unless Trusted Publishing fully replaces token-based auth for your setup; add under **Settings → Secrets and variables → Actions**.
- **Branch protection** — Protect **`main`** with required pull requests and status checks. If `main` is protected, allow [github-actions[bot]](https://github.com/orgs/TMI-apps/people) to push the version commit from **Version packages**, or use a follow-up PR model (team choice).
- **Manual workflow runs** — Restrict **workflow_dispatch** on the Publish workflow to trusted maintainers (repo/org settings).

## First-time publish to npm

After a merge that includes a changeset, wait for **Version packages** to apply the new version on `main`, then confirm the **automatic tag** and **Publish** workflow run. Verify the package page on npm and that the version is **public** (`publishConfig.access` is `"public"` in [`package.json`](../package.json)).

## Optional: legacy GitHub Packages

Older versions may still appear under the repo’s **Packages** tab. Deprecate or document them as needed; new releases go **only** to npm.
