---
name: mentor-project-discovery
description: Procedure for learning an unfamiliar codebase before mentoring in it, and for writing the result down as a reusable project map skill. Use at the start of work in any repository that has no project map skill yet, when the user says "new project", "get to know this repo", "how does this project work", "set up skills for this project", "onboard", or when you are about to give advice about code you have not run. Contains the discovery checklist (manifests, how it runs, routes, config, history, TODOs), the rule to verify by running instead of reading, the safety rules (throwaway database only, never print secrets), how to record a baseline of what passes and fails today, how to build a known-issues list with stable ids, the few questions to ask the owner, and a template for a <project>-project-map skill. Not for teaching behavior (use mentor-mode) and not for fixing one bug (use mentor-debugging).
---

# Mentor project discovery

Before you can mentor someone in their codebase, you need to know what is true about it.
This skill is the procedure for finding that out and writing it down once, so that later
sessions (and cheaper models) start from facts instead of guesses.

The output is one skill named `<project>-project-map` in the project's `.claude/skills/`
folder. A worked example of that output is the `blog-project-map` skill.

## When to use this skill

- First session in a repository that has no `*-project-map` skill.
- The project map exists but is out of date (its re-verification commands fail).
- The learner starts a new project and wants the same mentoring setup there.

## When NOT to use it

- A current project map exists: load it and get to work.
- You only need the teaching rules: `mentor-mode`.
- You are chasing one bug: `mentor-debugging`.

## Rules for discovery

| Rule | Reason |
|---|---|
| Run it, don't only read it. | Code that looks right may not build. A claim you ran is a fact; a claim you read is a guess. |
| Write down the exact command and the exact output. | The next session can re-run it and compare. |
| Read-only on their code. | Discovery changes nothing in the repo except the new skill folder. |
| Throwaway database only. | Never point anything at the database in their `.env`. Use a separate database whose name contains `test`, `smoke` or `scratch`, and ask before creating it. |
| Never print secrets. | Do not `cat` an `.env` file. Read variable NAMES from the code that uses them. |
| No new dependencies. | Use what is installed. If a tool is missing, say so and ask. |
| Label what you could not check. | Write `UNVERIFIED:` and the reason. Do not fill gaps with what is usually true. |

Installing the project's own dependencies (`npm ci` and the like) is fine: it changes only
ignored folders. Tell the learner you are doing it.

## The checklist

Work top to bottom. Each step lists what to record.

### 1. What is it

- Read `README`, any `PRODUCT`/`CONTRIBUTING`/`docs` files, and `CLAUDE.md` if present.
- List the top-level folders and what each is. Note whether it is one package or several.
- Record: one paragraph on what the project is for and who uses it.

```bash
git ls-files | head -200
git log --oneline | head -40
```

### 2. How it is built and run

- Read every manifest (`package.json`, `pyproject.toml`, `Cargo.toml`, ...) and its scripts.
- Install and run each script that builds, lints, typechecks or tests.
- Record: a table of command, where to run it, and PASS or FAIL with the error text.
  This table is the **baseline**. A later change is a regression only if it makes this table
  worse.

### 3. Configuration

- Find every environment variable the code reads:
  ```bash
  grep -rn "process\.env\|import\.meta\.env" --include=*.ts --include=*.tsx --include=*.js . \
    | grep -v node_modules
  ```
- Find hardcoded settings: ports, URLs, timeouts, secrets-in-code.
- Record: a table of each setting, where it is read, whether it is required, and what happens
  when it is missing (test this if you can do it safely).

### 4. The shape of the system

- For a server: list every route with its method, path and access rule. Generate this from the
  source where possible so it can be re-generated later.
- For a frontend: list the pages and which server routes each one calls.
- For a database: read the schema and the migrations. Note the delete rules between tables.
- Record: the route table, the data model in a few lines, and how a request travels from the
  browser to the database and back.

### 5. Does it work

- Start it against a throwaway database and call every route: the success case, the
  not-logged-in case, the wrong-role case, bad input, and a record that does not exist.
- Open each page and do the main actions. Watch the Network tab.
- Record: for each check, expected result and observed result. Where they differ you have
  found a defect.

If you write a script for this, put it in the project map's `scripts/` folder and make it
refuse to run against a database that is not clearly a throwaway one.

### 6. Known issues

- Give every defect a short stable id (`D-01`, `D-02`, ...). Never reuse an id.
- For each: what the user sees, the cause, the file, the command that shows it, and what a
  correct fix must satisfy. Do NOT write the fix. In mentor mode the learner writes it.
- Also list dead code, leftovers and anything that looks half-finished.

```bash
grep -rnE "TODO|FIXME|HACK" --include=*.ts --include=*.tsx --include=*.js . | grep -v node_modules
```

### 7. History

- Read the commit log. Look for ideas that were started and dropped, files that moved, things
  that were reverted, and notes the owner left in commit messages.
- Record: a short timeline and a list of "already decided, do not re-open" items with the
  commit that shows each.

```bash
git log --stat --format='--- %h %ad %s' --date=short | head -200
git log --all --diff-filter=D --name-only --format='deleted in %h %s' | head -60
```

### 8. Ask the owner

Ask at most five questions, and only what the repo cannot tell you:

1. What are you trying to learn right now?
2. Which rules do you have that are not written down? (libraries you chose, parts you want to
   build alone, things an assistant must never do)
3. What is the hardest open problem?
4. What has cost you the most time so far?
5. Is anything in my findings wrong or already known?

Record the answers with the date. Mark each rule with where it came from: written in a file,
or told to you by the owner on a date. Never present your own suggestion as the owner's rule.

## Write the project map

Create `.claude/skills/<project>-project-map/SKILL.md` from
`templates/project-map-template.md` in this skill. Keep the main file short enough to scan and
put the long known-issues list in `reference/known-issues.md`.

Quality bar for the map:

- Every command in it was run. Every path in it exists.
- Volatile facts carry a date and a commit hash.
- It ends with one-line commands that re-check each fact that can go stale.
- Unproven things are labeled open or unverified.
- It contains no secrets, no personal names or emails, and no paths outside the repo.

Then show the learner the map and walk through it together. It is also a good first lesson:
reading an honest list of what is broken in your own project.

## If `.claude` is gitignored

Some projects ignore the `.claude` folder. Then a new skill file does not show up in
`git status`. Ask the owner how they want it kept: left untracked on their machine, or
committed on purpose with `git add -f <path>`. Do not edit `.gitignore` without asking.

## Files in this skill

- `templates/project-map-template.md`: the skeleton for a `<project>-project-map` skill.

## Provenance and maintenance

- Written 2026-11-15, from the discovery of a three-package Express + Prisma + React project
  done on that date. The checklist is the generalized version of what was done there.
- The `grep` examples assume a JavaScript or TypeScript project. For another language, change
  the file patterns and the way environment variables are read.
- To use it in every project:
  ```bash
  mkdir -p ~/.claude/skills && cp -r .claude/skills/mentor-project-discovery ~/.claude/skills/
  ```
