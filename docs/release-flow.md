# Release flow (Changesets + GitHub Packages)

## Overview

1. **Changeset** — For each release-worthy change, add a file under `.changeset/` (`pnpm changeset`). This records semver intent (patch / minor / major), not a hand-picked `x.y.z`.
2. **PR to `main`** — Review and merge.
3. **Version packages** — On push to `main`, the [Version packages workflow](../.github/workflows/version-packages.yml) runs. If there are pending changesets, it runs `pnpm run version-packages` (`changeset version` + `pnpm install`), then commits to `main` with message `chore: version packages [skip ci]`.
4. **Tag** — On the commit that contains the new version in `package.json`, create and push a git tag:

   ```bash
   git pull origin main
   git tag v0.3.0   # must match package.json version
   git push origin v0.3.0
   ```

5. **Publish** — The [Publish workflow](../.github/workflows/publish.yml) runs on `v*` tag pushes, builds, and runs `pnpm publish` to `npm.pkg.github.com` using `GITHUB_TOKEN`.

## Requirements

- **Repository settings** — Actions must be allowed to read/write contents and, for publish, `packages: write`. The default `GITHUB_TOKEN` is sufficient for publishing within the same org.
- **Branch protection** — If `main` is protected, allow [github-actions[bot]](https://github.com/orgs/TMI-apps/people) to push the version commit, or use a follow-up PR model (team choice).

## First-time (`0.3.0`)

After the first merge that includes a changeset and the version bot has applied `0.3.0`, tag that commit and push the tag; confirm the **Publish** workflow completes and the package appears under the repo’s **Packages**.
