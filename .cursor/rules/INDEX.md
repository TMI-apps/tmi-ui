# Rules index (`@tmi-apps/ui`)

This repo is a **small publishable UI library** (React + MUI peers, GitHub Packages). Rules stay minimal; most governance lives in [CONTRIBUTING.md](../../CONTRIBUTING.md) and [README.md](../../README.md).


| Topic                                      | Location                                                                                                   |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| Git workflow, finish/push, protected files | [workflow/RULE.md](./workflow/RULE.md)                                                                     |
| Structure, peers, releases (human SSOT)    | [CONTRIBUTING.md](../../CONTRIBUTING.md)                                                                   |
| Install / consumers / auth                 | [docs/installation.md](../../docs/installation.md), [docs/consumer-setup.md](../../docs/consumer-setup.md) |
| Agent job plans (optional)                 | [docs/jobs/README.md](../../docs/jobs/README.md)                                                           |


## Skills (agent commands)


| Skill       | Role                                                                      |
| ----------- | ------------------------------------------------------------------------- |
| `plan`      | Research + write `DEVELOPMENT_PLAN.md` under `docs/jobs/temp_job_<name>/` |
| `implement` | Execute plan phases and gates                                             |
| `finish`    | Changeset when needed, staging gate, commit (no push)                     |
| `push`      | Verify tree + push only (after finish)                                    |
| `prime`     | Session context: repo layout, rules, git state                            |


Paths: `.cursor/skills/<name>/SKILL.md`