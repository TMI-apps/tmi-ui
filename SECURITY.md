# Security

## Reporting a vulnerability

Please **do not** open a public GitHub issue for security reports.

**Preferred:** use [GitHub private vulnerability reporting](https://docs.github.com/en/code-security/security-advisories/guidance-on-reporting-and-writing-information-about-vulnerabilities/privately-reporting-a-security-vulnerability) for this repository (**Security → Report a vulnerability**), if enabled for **TMI-apps/tmi-ui**.

If that option is unavailable, contact the **TMI-apps** repository maintainers through a non-public channel agreed within your organization, or reach out via GitHub to organization owners.

We aim to acknowledge reports in a reasonable timeframe and coordinate disclosure after a fix is available.

## Good hygiene

- Never commit tokens, passwords, API keys, or internal URLs into issues, discussions, or pull requests.
- Rotate any credential that may have been exposed.

## Scope

Reports should concern this repository (`@tmi-apps/ui` / **tmi-ui**). Consumer applications that depend on this package have their own security posture and disclosure process.

## Maintainers — history hygiene

Before (or immediately after) making this repository **public** for the first time, run secret detection over **full git history** (for example GitHub **secret scanning** / **push protection** on the organization, or [`gitleaks`](https://github.com/gitleaks/gitleaks) locally). Revoke and rotate any credential that may ever have appeared in history or CI logs.
