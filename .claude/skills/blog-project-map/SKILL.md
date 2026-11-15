---
name: blog-project-map
description: Verified facts about the blogs-application repository, a learning project with an Express 5 + Prisma 7 + PostgreSQL API (api/), a React admin panel for writers (admin/) and a React reader site (userPage/). Load for any task in this repo before giving advice. Contains setup from a fresh clone, how to run the three dev servers, env vars, the 13 API routes and who may call them, the JWT cookie login, the data model, the owner's project rules, the baseline of which checks pass today, the 17 known issues D-01 to D-17, a suggested order for fixing them, and three scripts (route lister, static checks, API smoke test). Use when the user mentions posts, drafts, publish, comments, login, signup, admin panel, reader site, TinyMCE, Prisma, migration, "Server error", "Forbidden", "Not authenticated", TS6133, or any file under api/, admin/ or userPage/. For how to teach use mentor-mode; for the debugging procedure use mentor-debugging.
---

# Blog project map

Facts about this repository, checked by running the project on 2026-11-15 at commit `15b1e86`.
If the code disagrees with this file, the code wins: fix this file.

This is a learning project. The owner writes the code and you mentor: follow `mentor-mode`.
This file tells you what is true here so that your hints are correct.

## When to use this skill

- Any question about how this project is set up, run, structured or secured.
- Before explaining a bug here: check `reference/known-issues.md` first, it may be listed.
- Before saying something "works": compare with the baseline below.

## When NOT to use it

- How to behave as a mentor: `mentor-mode`.
- The step-by-step debugging procedure: `mentor-debugging`.
- A different repository: `mentor-project-discovery` builds a map like this one.

## What the project is

An admin panel and API for a dev/tech blog, plus a public reader site. A few known writers
draft and publish posts with code samples. It is about six weeks old (first commit 2026-10-03,
19 commits on `main`). There are no tests, no CI, no deployment and no real content yet.
`PRODUCT.md` in the repo root is the only document of record; read it.

## Layout

| Folder | What it is | Main tech |
|---|---|---|
| `api/` | HTTP API | Express 5, Prisma 7 with the `@prisma/adapter-pg` driver adapter, PostgreSQL, bcrypt, jsonwebtoken, run with `tsx` |
| `admin/` | Writers' panel (single-page app) | React 19, Vite 8, TanStack Query 5, React Router 7, react-hook-form + zod, TinyMCE, Tailwind 4, shadcn components on Base UI |
| `userPage/` | Public reader site (single-page app) | React 19, Vite 8, TanStack Query 5, React Router 7, DOMPurify, Tailwind 4 |
| `PRODUCT.md` | Product description, principles, open decisions | |
| root `package.json` | A stray: dependencies installed in the wrong folder. No code uses it. | |

The three folders are separate npm packages. There is no workspace. Run `npm` inside each one.

Inside `api/src`: `index.ts` (app and middleware), `routes/` (two routers), `controller/`
(handlers), `middleware/authMiddleware.ts` (`requireAuth`), `lib/prisma.ts` (database client),
`lib/HttpError.ts`. Inside `admin/src` and `userPage/src`: `features/<name>/{api.ts,hooks,pages,
components}` is the target structure; `admin/src/pages/` still holds older files that have not
been moved. `components/ui/*` and `userPage/src/components/watermelon/*` are generated
component-library files: treat them as vendored.

## Set up from a fresh clone

Needs Node 22 and a PostgreSQL server. Checked with Node v22.23.4, npm 10.9.9, PostgreSQL 16.

1. Install each package (three separate commands, run from the repo root):
   ```bash
   (cd api && npm ci) && (cd admin && npm ci) && (cd userPage && npm ci)
   ```
2. Generate the Prisma client. It is gitignored, and the API cannot start without it:
   ```bash
   cd api && npx prisma generate
   ```
   Expected: `Loaded Prisma config from prisma7.config.ts.` and
   `Generated Prisma Client (7.10.0) to ./src/generated/prisma`.
3. The owner creates `api/.env` (gitignored; there is no `.env.example`):
   ```
   DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/DBNAME
   JWT_SIGN=<a long random string>
   ```
   A random string: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
4. The owner applies the migrations to their database (see "Project rules": you do not run this
   against their database):
   ```bash
   cd api && npx prisma migrate deploy
   ```
   Expected: three migrations listed and `All migrations have been successfully applied.`
5. The owner creates `admin/.env` with `VITE_TINYMCE_API_KEY=<their Tiny Cloud key>`.
   UNVERIFIED: what the editor shows when the key is missing or wrong (Tiny's CDN was not
   reachable from the machine used for verification).
6. Make the first admin. No route can do it. Sign up through the admin's `/signup` page, then
   the owner changes the role by hand, in Prisma Studio (`cd api && npx prisma studio`) or SQL:
   ```sql
   UPDATE "User" SET role = 'ADMIN' WHERE email = 'you@example.com';
   ```
   Then log in again. The role is stored inside the login token, so an old login keeps the old
   role.

## Run it

| What | Command | Run from | Listens on |
|---|---|---|---|
| API | `npm run dev` (`tsx watch src/index.ts`) | `api/` | 3000, hardcoded in `api/src/index.ts` |
| Admin | `npm run dev` | `admin/` | 5173 if started first |
| Reader site | `npm run dev` | `userPage/` | 5174 if started second |

The Vite ports are not configured. The first dev server gets 5173; the second prints
`Port 5173 is in use, trying another one...` and takes 5174.

The API prints `Server is running on port 3000` even when `api/.env` is missing or wrong. It
fails later, per request (see D-12).

## Configuration

| Setting | Read in | Required | If missing |
|---|---|---|---|
| `DATABASE_URL` | `api/src/lib/prisma.ts`, `api/prisma7.config.ts` | yes | Every route that uses the database returns 500 and the API log stays empty. |
| `JWT_SIGN` | `api/src/controller/authController.ts`, `api/src/middleware/authMiddleware.ts` | yes | `POST /login` returns 500 "Server error" with an empty log; protected routes return 401. |
| `NODE_ENV` | `api/src/lib/prisma.ts` | no | The database client is cached on `global` unless it is `production`. |
| `PORT` | declared in `api/environment.d.ts`, read nowhere | no | Nothing. The port is hardcoded. |
| `VITE_TINYMCE_API_KEY` | `admin/src/pages/createPost.tsx`, `admin/src/pages/helpers/dialogHelpers.tsx` | for the editor | See step 5 above. |

Other fixed values: JWT and cookie lifetime 3 days and bcrypt cost 10
(`api/src/controller/authController.ts`); cookie options `httpOnly: true, sameSite: "lax"`, no
`secure`. A variable set in the shell wins over `api/.env` (dotenv does not override).
`.env` loading happens through one `import "dotenv/config"` in `authController.ts`; it works
because `index.ts` imports the auth routes first.

Tooling differs per package: `admin` lints with oxlint and typechecks only through
`npm run build`; `userPage` has eslint, prettier and a `typecheck` script and sets
`"strict": true`; `admin` does not set `strict`; `api` has no `tsconfig.json`, no lint and no
typecheck.

## How a request travels

1. Browser code calls a path that starts with `/api`, for example `fetch("/api/getPosts")`.
2. The Vite dev server (both `vite.config.ts` files) proxies `/api/*` to
   `http://localhost:3000` and removes the `/api` prefix. The API itself has no `/api` prefix:
   with `curl` on port 3000 you call `/getPosts`.
3. Express runs `express.json()`, `cors()`, `express.urlencoded`, `cookie-parser`, then the
   auth router, then the posts router. There is no error-handling middleware and no 404 handler.
4. If the route has `requireAuth(...)`, it reads the `jwt` cookie, verifies it and checks the
   role. On success it stores the user id in `res.locals.userId`. It does not store the role.
5. The controller calls Prisma and sends JSON.

Because the browser talks to the Vite server, the page and the API share one origin in
development. The `cors()` call is not what makes requests work.

## Routes

Regenerate this table from source at any time:

```bash
node .claude/skills/blog-project-map/scripts/list-routes.mjs
```

| Method | Path | Who may call it | Handler |
|---|---|---|---|
| POST | `/signup` | anyone | `signup_post` |
| POST | `/login` | anyone | `login_post` |
| GET | `/me` | ADMIN | `protectRoutesHandler_get` |
| GET | `/getPosts` | ADMIN | `homePagePosts_get` |
| GET | `/getPosts/:id` | ADMIN | `getPostById_get` |
| POST | `/postCreation` | ADMIN | `postCreation_post` |
| PATCH | `/patchPosts/:id` | ADMIN | `updateProduct_patch` |
| DELETE | `/post/remove/:id` | ADMIN | `postRemove_delete` |
| GET | `/user/posts` | anyone | `userPagePostsFetch_get` |
| GET | `/user/posts/:id` | anyone | `userPageGetSinglePost_get` |
| GET | `/user/posts/:id/comments` | anyone | `getPostComments_get` |
| POST | `/user/posts/:id/comments` | any logged-in user | `createAComment_post` |
| DELETE | `/user/posts/:id/comments/:commentId` | ADMIN or USER, and only the comment's author | `deletePostCommentById_delete` |

Response shapes worth knowing: `POST /signup` returns `201 {"user": <id>}`; `POST /login`
returns `200 {"user": <id>}` and sets the cookie; `GET /me` returns the user id as a bare
number; `GET /getPosts` returns `id, title, description, thumbnailUrl, published, createdAt`
only (no `content`); the two public post routes return published posts only.

## Who may do what

- Two roles: `ADMIN` and `USER`. Signup always creates a `USER`. Only `ADMIN` can use the
  admin panel. There is no `WRITER` role yet (an open decision).
- Login puts a JWT in a cookie named `jwt` (`HttpOnly`, `SameSite=Lax`, 3 days). The token
  holds `{ id, role }`. The server reads the role from the token, not from the database, so a
  role change applies only after the next login.
- `requireAuth()` with no list means any logged-in user. `requireAuth(["ADMIN"])` means that
  role only. No cookie or a bad token gives 401 `Not authenticated`; a wrong role gives 403
  `Forbidden`.
- The admin's React guard (`admin/src/protectedRoutes.tsx`) calls `/api/me` and shows the
  pages only on a 200. It mirrors the server; the server is what protects the data.
- There is no logout route.
- Cookies belong to a host, not a port. A login on `localhost:5173` is also sent from
  `localhost:5174`.

## Data model

`api/prisma/schema.prisma`, three migrations in `api/prisma/migrations/`.

| Model | Fields | Notes |
|---|---|---|
| `User` | `id`, `email` (unique), `password` (bcrypt hash), `role` (default `USER`), `name?` | `name` is never set by signup. |
| `Post` | `id`, `title?`, `content?` (HTML from TinyMCE), `published` (default `false`), `createdAt`, `authorId`, `description?`, `seoName?`, `thumbnailUrl?` | Deleting a user who has posts is refused by the database. |
| `Comment` | `id`, `text`, `createdAt`, `userId`, `postId` | Deleted together with its post or its user. |

After a schema change: `npx prisma migrate dev --name <what_changed>` creates and applies a
migration and regenerates the client (per its `--help` text; the owner runs it), and
`--create-only` writes the SQL without applying it so it can be read first.

## Project rules

| Rule | Source | Why |
|---|---|---|
| The owner writes the code; assistants mentor. | Owner, 2026-11-15, and the owner's `CLAUDE.md` (untracked since commit `9940772`) | It is a learning project. |
| Data fetching is TanStack Query with plain `fetch`. Do not suggest axios or a return to `useState`/`useEffect` fetching. | Owner, 2026-11-15 | A switch to axios + useState was noted in commit `f1b9dad` and half-started in `15b1e86`; the owner dropped it. The leftover is the unused `admin/src/features/post/hooks/usePosts.ts`. |
| The reader site's design (`userPage/`) is the owner's. Do not restyle it unless asked. Logic fixes are fine. | `PRODUCT.md` and owner, 2026-11-15 | The owner wants to design and build it personally. |
| No new npm package without asking first. | Owner, 2026-11-15 | The repo already has unused packages: `method-override` and `nodemon` in `api`, and the stray root `package.json`. |
| Never run a migration or change data in the owner's database. Give the command; the owner runs it. | Owner, 2026-11-15 | It is their data. A scratch database for the smoke test is the only exception. |
| The server decides permissions; the UI only mirrors them. | `PRODUCT.md` principle 3 | Hiding a button protects nothing. |
| The API must never expose unpublished posts publicly. | `PRODUCT.md` | See D-04 for where this is broken today. |
| Status is never ambiguous: a writer always knows draft or published. | `PRODUCT.md` principle 2 | |
| The interface is in English. | `PRODUCT.md` | Lithuanian strings are leftovers (D-10). |
| Never invent example content and present it as real. | `PRODUCT.md` | There are no real posts, readers or metrics yet. |
| Understandable over clever. | `PRODUCT.md` principle 5 | The owner must be able to read and change everything. |

## Open decisions (the owner decides, not you)

From `PRODUCT.md`. When a task touches one, stop, lay out the options and what each costs, and
let the owner choose.

1. Writer permissions: a `WRITER` role or similar. Not designed.
2. Publishing workflow: do writers publish their own posts, or does an admin approve first?
3. How the reader site relates to drafts.

Also undecided: whether admins may delete other people's comments (today they cannot).

## Baseline: what passes today

Run all static checks:

```bash
node .claude/skills/blog-project-map/scripts/check-all.mjs
```

Result on 2026-11-15:

| Package | Check | Result |
|---|---|---|
| `api` | `npx prisma validate` | PASS |
| `api` | typecheck | no check exists (no `tsconfig.json`) |
| `admin` | `npm run lint` | PASS, 9 warnings |
| `admin` | `npm run build` | **FAIL**: 4 x TS6133 in `src/pages/helpers/dialogHelpers.tsx` (D-01) |
| `userPage` | `npm run lint` | PASS |
| `userPage` | `npm run typecheck` | PASS |
| `userPage` | `npm run build` | PASS (one chunk-size warning) |

API smoke test result on 2026-11-15: `contract checks: 34/34 OK` and
`known defects: 9 present, 0 gone, 0 changed (of 9)`.

A change is a regression if it makes either result worse. A fix shows up as a FAIL turning
into PASS, or a defect check turning from `PRESENT` to `GONE`.

## Known issues

Full entries are in `reference/known-issues.md`. All were open on 2026-11-15.

| Id | Issue | Blocks |
|---|---|---|
| D-01 | `admin` does not build (unused imports and variable) | building the admin |
| D-02 | Editing a post returns 500 unless post id equals author id | editing |
| D-03 | No route can publish a post | the whole reader site |
| D-04 | Comments of draft posts are public; drafts can be commented on | privacy of drafts |
| D-05 | No input validation on the server (several 500s, one leaked internal message) | robustness |
| D-06 | Login reveals whether an email is registered | security |
| D-07 | Sign-in shows no error; a `USER` login bounces back silently | usability |
| D-08 | Edit dialog ignores the response, stays open, list not refreshed | usability, hides D-02 |
| D-09 | Create form silently rejects punctuation and non-English letters | writing posts |
| D-10 | Lithuanian strings in an English interface | consistency |
| D-11 | Cookie without `Secure`, open CORS, no logout, stale role in token | deployment |
| D-12 | API has no typecheck or lint, and most errors are not logged | debugging |
| D-13 | Dead and leftover code, stray root `package.json` | clarity |
| D-14 | Types shared across packages by relative import, duplicated, and partly wrong | type safety |
| D-15 | Comments are half-built (no author name, no form, no moderation) | comments |
| D-16 | Missing post on the reader site shows "Loading..." for seconds | usability |
| D-17 | Reader card uses a plain relative link instead of the router's `Link` | navigation |

## Suggested order of work

Smallest first, each one building on the last. The owner chooses; this is a suggestion.

| Step | Issue | What it teaches |
|---|---|---|
| 1 | D-01 | Reading compiler errors; why unused code fails this build. |
| 2 | D-02 | Ownership checks; where the logged-in user's id comes from. |
| 3 | D-08 | Checking a response; TanStack Query mutations and `invalidateQueries`. |
| 4 | D-07, D-10 | Showing server errors in a form (`setError("root")`); cleaning up strings. |
| 5 | D-09 | Displaying form validation errors; choosing sensible validation rules. |
| 6 | D-12 | Logging errors; adding a `tsconfig.json` so the API can be typechecked. |
| 7 | D-05, D-06 | Validating input on the server; safe error messages. |
| 8 | D-04 | Applying one rule ("published only") everywhere it matters. |
| 9 | D-03 and the open decisions | Designing roles and a publishing flow end to end: schema, migration, routes, UI. The hardest one. Decisions first, then code. |
| 10 | First tests | `node:test` runs through `tsx` with nothing new installed (`cd api && npx tsx --test <file>` was checked). |
| Before any deployment | D-11 | Cookie flags, CORS, logout. |

For step 9, write the wanted behavior as checks in `scripts/smoke-api.mjs` before writing the
feature, watch them fail, then make them pass.

## Scripts in this skill

All three are plain Node, use only what is already installed, and run from anywhere in the repo.

| Script | What it does | Changes anything? |
|---|---|---|
| `scripts/list-routes.mjs` | Prints every route with its guard, read from `api/src/routes/*.ts`. | No. |
| `scripts/check-all.mjs` | Runs every lint, typecheck and build. Add `--verbose` for full output. Exit 0 all pass, 1 a failure, 2 `node_modules` missing. | Writes `admin/dist` and `userPage/dist` (gitignored). |
| `scripts/smoke-api.mjs` | Starts the API on a scratch database and calls every route. | **Empties the scratch database.** |

Running the smoke test:

```bash
SMOKE_DATABASE_URL='postgresql://USER:PASSWORD@localhost:5432/blog_smoke' \
  node .claude/skills/blog-project-map/scripts/smoke-api.mjs
```

- The owner creates the scratch database once (`CREATE DATABASE blog_smoke;`).
- The script refuses to run unless the database name contains `smoke`, `test` or `scratch`,
  and refuses if anything is listening on port 3000. Stop the dev API first.
- It applies the migrations, deletes all rows, starts its own API, runs the checks, stops it.

Reading its output:

| Line starts with | Meaning |
|---|---|
| `OK [contract]` | Correct behavior, still correct. |
| `FAIL [contract]` | Something that worked is broken. A regression. |
| `PRESENT [defect]` | A known issue is still there. Expected until it is fixed. |
| `GONE [defect]` | A known issue looks fixed. Update `reference/known-issues.md` and move the check to the contract list in the script. |
| `CHANGED [defect]` | Neither the old bug nor the wanted behavior. Investigate. |

Exit code 0 means no `FAIL` and no `CHANGED`. The D-03 check tests publishing through
`PATCH /patchPosts/:id`; if publishing gets its own route, add a new check for it.

## Provenance and maintenance

Checked on 2026-11-15 at commit `15b1e86` by installing all three packages, running every
build and lint script, calling every route against a scratch PostgreSQL 16 database, and
driving both sites in a headless browser. Not checked: the TinyMCE editor itself (CDN
unreachable), and `prisma migrate dev` (only its help text was read).

Re-check before trusting a section:

| Fact | Command (from the repo root) |
|---|---|
| Routes and guards | `node .claude/skills/blog-project-map/scripts/list-routes.mjs` |
| Baseline of checks | `node .claude/skills/blog-project-map/scripts/check-all.mjs` |
| API behavior and defects | the smoke test command above |
| Env vars read by code | `grep -rn "process\.env\|import\.meta\.env" api/src api/prisma7.config.ts admin/src userPage/src \| grep -v generated` |
| API port | `grep -n "listen" api/src/index.ts` |
| Proxy rule | `grep -n -A6 "proxy" admin/vite.config.ts userPage/vite.config.ts` |
| Schema | `cat api/prisma/schema.prisma` and `ls api/prisma/migrations` |
| Cookie and token settings | `grep -n "maxAge\|sameSite\|httpOnly\|expiresIn" api/src/controller/authController.ts` |
| Installed versions | `node -e "console.log(require('./api/node_modules/prisma/package.json').version)"` |
| New commits since this map | `git log --oneline 15b1e86..HEAD` |

When a known issue is fixed: mark it in `reference/known-issues.md` with the commit, remove
its row from the tables above, and update the baseline numbers. This folder sits under a
gitignored path (`.claude`), so a new file here needs `git add -f` to be committed.
