# Template: <project>-project-map/SKILL.md

Copy everything below the line into `.claude/skills/<project>-project-map/SKILL.md` and fill
it in. Delete sections that do not apply. Every command must be one you ran.

---

```markdown
---
name: <project>-project-map
description: Verified facts about the <project> repository: <one line on what it is>. Load for any task in this repo before giving advice: how to set it up and run it, the route table and who may call what, the data model, the configuration, the project rules the owner set, the baseline of which checks pass today, and the list of known issues (<id range>). Use when the user mentions <project-specific words, error strings, file names>. For how to teach use mentor-mode; for the debugging procedure use mentor-debugging.
---

# <Project> project map

Facts checked on <date> at commit `<hash>`. If the code disagrees with this file, the code
wins: fix this file.

## When to use this skill / When NOT to use it

## What the project is
<one paragraph; who uses it; what stage it is at>

## Layout
| Folder | What it is | Main tech |

## Set up from a fresh clone
<numbered steps, each with the command, where to run it, and the expected output>

## Run it
| What | Command | Where | Listens on |

## Configuration
| Setting | Read in | Required | If missing |

## How a request travels
<browser -> proxy -> server -> middleware -> handler -> database, with file names>

## Routes
<table generated from source; say how to regenerate it>

## Who may do what
<roles, how login works, where the session lives, how long it lasts>

## Data model
<tables, key fields, delete rules>

## Project rules
| Rule | Source (file, or "owner said on <date>") | Why |

## Open decisions (the owner decides)

## Baseline: what passes today
<table of build/lint/type/test commands with PASS or FAIL as of <date>>

## Known issues
<short table: id, one line, severity. Full entries in reference/known-issues.md>

## Suggested order of work
<which issues teach what; smallest first>

## Scripts in this skill
<what each does, how to run it, how to read its output>

## Provenance and maintenance
<date, commit, and one-line commands that re-check each fact that can go stale>
```

## Template: one entry in reference/known-issues.md

```markdown
### D-NN: <one-line statement>

- **Status:** open | fixed in <hash> | won't fix (why)
- **What you see:** <the symptom, as a user would describe it>
- **Cause:** <what the code does and why that is wrong>
- **Where:** `<file>`, `<function or symbol>`
- **How to see it:** <exact command or exact steps, and the output>
- **A correct fix must:** <observable conditions, not code>
- **Teaches:** <the concept the learner gets from fixing it>
```
