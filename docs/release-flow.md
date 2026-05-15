# Release flow (Changesets + GitHub Packages)

This library is **open source** ([MIT](../LICENSE)); releases are published as **`@tmi-apps/ui`** on **GitHub Packages**. Keep the repository and package **public** so documented consumer installs remain consistent with maintainer expectations.

## Overview

1. **Changeset** — For each release-worthy change, add a file under `.changeset/` (`pnpm changeset`). This records semver intent (patch / minor / major), not a hand-picked `x.y.z`.
2. **PR to `main`** — Review and merge.
3. **Version packages** — On push to `main`, the [Version packages workflow](../.github/workflows/version-packages.yml) runs. If there are pending changesets, it runs `pnpm run version-packages` (`changeset version` + `pnpm install`), then commits to `main` with message `chore: version packages [skip ci]`.
4. **Tag** — After that commit, the same workflow **creates and pushes** a git tag `vX.Y.Z` that matches `package.json` `"version"` (only when a version commit was actually created; if the tag already exists on the remote, the step is skipped).
5. **Publish** — The [Publish workflow](../.github/workflows/publish.yml) runs on `v*` tag pushes, builds, and runs `pnpm publish` to `npm.pkg.github.com` using `GITHUB_TOKEN`.

> **Important:** Until the **tag** exists and **Publish** has succeeded, that version is **not** on GitHub Packages. After merging, open **Actions** and confirm **Version packages** then **Publish** completed, then check **Packages** for `@tmi-apps/ui`.

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
3. Confirm the version under the repository **Packages** tab.

## Requirements

- **Repository settings** — Actions must be allowed to read/write contents and, for publish, `packages: write`. The default `GITHUB_TOKEN` is sufficient for publishing within the same org.
- **Branch protection** — Protect **`main`** with required pull requests and status checks. If `main` is protected, allow [github-actions[bot]](https://github.com/orgs/TMI-apps/people) to push the version commit from **Version packages**, or use a follow-up PR model (team choice).
- **Manual workflow runs** — Restrict **workflow_dispatch** on the Publish workflow to trusted maintainers (repo/org settings).

## First-time publish

After a merge that includes a changeset, wait for **Version packages** to apply the new version on `main`, then confirm the **automatic tag** and **Publish** workflow runs; verify the package under the repo’s **Packages**.
