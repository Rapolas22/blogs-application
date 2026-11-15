# Known issues in blogs-application

Every entry was reproduced on 2026-11-15 at commit `15b1e86`. All are open.

How to read an entry: "A correct fix must" lists what should be observable afterwards. It is
not the fix. In mentor mode the owner writes the fix; use these entries to give accurate hints.

"Smoke" means `scripts/smoke-api.mjs` in this skill; "browser" means it was seen in a headless
browser run against the dev servers.

Contents: D-01 build, D-02 edit, D-03 publish, D-04 draft leak, D-05 validation, D-06 login
messages, D-07 sign-in feedback, D-08 edit dialog, D-09 create form, D-10 language, D-11
session hardening, D-12 API tooling and logging, D-13 dead code, D-14 types, D-15 comments,
D-16 loading delay, D-17 card link. Project history is at the end.

---

### D-01: The admin panel does not build

- **What you see:** `cd admin && npm run build` stops with four `error TS6133` lines.
- **Cause:** `admin/tsconfig.app.json` sets `noUnusedLocals`. `dialogHelpers.tsx` imports
  `Dialog`, `DialogContent` and `DialogTrigger` without using them, and stores the PATCH
  response in a variable `res` that is never read.
- **Where:** `admin/src/pages/helpers/dialogHelpers.tsx`, the import block at the top and the
  `updatePost` function.
- **How to see it:** `cd admin && npm run build`. `npm run dev` still works, because the dev
  server does not typecheck.
- **A correct fix must:** make `npm run build` pass. The unused `res` is a sign of D-08, so
  the two are best looked at together.
- **Teaches:** reading compiler output; the difference between the dev server and a build.

### D-02: Editing a post returns 500 unless the post id equals the author's id

- **What you see:** "Save changes" in the edit dialog appears to do nothing. In the Network tab
  `PATCH /api/patchPosts/<id>` returns 500 `{"message":"Server error"}`.
- **Cause:** the update's filter is
  `{ id: Number(req.params.id), authorId: Number(req.params.id) }`. The second key was meant to
  be the logged-in user's id, which the auth middleware stores in `res.locals.userId`. No row
  matches, Prisma throws error code P2025 (record not found), and the catch block turns it into
  a generic 500 without logging.
- **Where:** `updateProduct_patch` in `api/src/controller/postController.ts`.
- **How to see it:** smoke check `D-02`. By hand: as an admin, create two posts and edit the
  second one.
- **Why it is easy to miss:** the first post made by the first user has post id 1 and author
  id 1, so it works.
- **A correct fix must:** let an author edit their own post whatever its id is; answer 404 (or
  403) and not 500 when the post does not exist or is not theirs. Whether an admin may edit
  other people's posts is part of the open decision on roles.
- **Teaches:** ownership checks; never trusting ids from the URL to say who the caller is.

### D-03: Nothing can be published

- **What you see:** a post is created in the admin, but the reader site stays empty.
- **Cause:** new posts start with `published: false`, and no route ever changes it. The create
  and update handlers do not read `published` from the request.
- **Where:** `api/src/controller/postController.ts`, `api/src/routes/postsRoutes.ts`.
- **How to see it:** smoke check `D-03`. The only way to publish today is by hand in the
  database: `UPDATE "Post" SET published = true WHERE id = <id>;` (the owner runs it).
- **A correct fix must:** follow the owner's answers to the open decisions in `PRODUCT.md`
  (who may publish, and whether approval is needed); enforce that on the server; make the state
  visible in the admin at all times (principle 2); and never let a draft reach a public route.
- **Teaches:** designing a feature across schema, API and UI; permissions as a table of who
  may do what.

### D-04: Drafts leak through comments

- **What you see:** `GET /user/posts/<draft id>/comments` returns 200 and the comments, with no
  login. A logged-in user can also add a comment to a draft.
- **Cause:** the two public post routes filter on `published: true`, but the comment handlers
  look only at `postId`.
- **Where:** `getPostComments_get` and `createAComment_post` in
  `api/src/controller/postController.ts`.
- **How to see it:** smoke checks `D-04` (two of them).
- **Why it matters:** `PRODUCT.md` says the API must never expose unpublished posts publicly.
  Comment text and the existence of a draft id are both exposed.
- **A correct fix must:** make both comment routes behave for a draft exactly as for a post
  that does not exist.
- **Teaches:** applying one access rule everywhere, not only on the obvious route.

### D-05: No input validation on the server

- **What you see:** four separate cases.
  | Request | Today | Wanted |
  |---|---|---|
  | `POST /signup` with `{}` | 500 `{"message":"data and salt arguments required"}` | 400 with a clear message |
  | `GET /getPosts/abc` | 500 "Server error" | 400 or 404 |
  | `POST /user/posts/999999/comments` | 500 "Server error" | 404 |
  | `POST /postCreation` with `{}` | 201, a post with every field `null` | 400 |
- **Cause:** handlers pass `req.body` and `req.params` straight to bcrypt and Prisma.
  `Number("abc")` is `NaN`. The signup handler also returns `err.message` for unknown errors,
  which leaks internal text (with a missing database it leaks file paths).
- **Where:** `api/src/controller/authController.ts` and `postController.ts`.
- **How to see it:** smoke checks `D-05` (four of them).
- **A correct fix must:** reject bad input with a 4xx before touching bcrypt or the database,
  and never send an internal error message to the client. The admin already validates with zod
  in the browser, but browser validation protects nobody: anyone can call the API directly.
  Note: zod is installed in `admin/` only. Using it in `api/` is a new dependency there, so ask
  the owner first.
- **Teaches:** server-side validation (the owner's stated learning focus).

### D-06: Login reveals whether an email is registered

- **What you see:** unknown email gives 401 "Wrong email"; known email with a wrong password
  gives 401 "Wrong password".
- **Cause:** two different messages in `login_post`.
- **Where:** `api/src/controller/authController.ts`.
- **How to see it:** smoke check `D-06`.
- **Why it matters:** an attacker can test a list of emails and learn which have accounts.
  This is called user enumeration.
- **A correct fix must:** give the same status and the same message in both cases. Note that
  signup also reveals it (409 "This email has already been used"); that one is harder to avoid
  and is a trade-off to discuss.
- **Teaches:** how much an error message tells an attacker.

### D-07: Sign-in gives no feedback

- **What you see:** (a) wrong password: the page does not change, no message. (b) correct
  password for a `USER` account: the page flashes and returns to `/signin`, no message.
- **Cause:** (a) the form's `catch` block contains only the expression `errors;` and the
  component never shows a form-level error. (b) login succeeds, the app navigates to `/`, the
  guard calls `/api/me`, the server answers 403 because the role is not `ADMIN`, and the guard
  redirects to `/signin`.
- **Where:** `admin/src/features/auth/components/login-05.tsx`, `admin/src/protectedRoutes.tsx`.
  The sign-up form next to it (`SignUp-05.tsx`) already does this correctly with
  `setError("root", ...)` and is a good model to compare with.
- **How to see it:** browser. Network tab: `POST /api/login` 401 for (a); 200 then
  `GET /api/me` 403 for (b).
- **A correct fix must:** show a message for a failed login, and tell a logged-in non-admin
  that the account has no access.
- **Teaches:** surfacing server errors in react-hook-form; 401 versus 403.

### D-08: The edit dialog ignores the result of saving

- **What you see:** after "Save changes" the dialog stays open and the list behind it still
  shows the old title until the page is reloaded. If the save failed (D-02) nothing tells you.
- **Cause:** `updatePost` sends the PATCH and does nothing with the response: no status check,
  no closing of the dialog, no refresh of the `["posts"]` query.
- **Where:** `admin/src/pages/helpers/dialogHelpers.tsx`.
- **How to see it:** browser. The delete flow in `admin/src/features/post/pages/HomePage.tsx`
  shows the working pattern: a mutation with `invalidateQueries({ queryKey: ["posts"] })`.
- **A correct fix must:** show success or failure, and make the list show the new data without
  a reload.
- **Teaches:** TanStack Query mutations and cache invalidation.

### D-09: The create form silently refuses common titles

- **What you see:** "Save post" does nothing for a title such as `Hello, world!` or any title
  with non-English letters. No request is sent and no message appears.
- **Cause:** `title`, `description` and `seoName` are registered with
  `pattern: /^[A-Za-z0-9 ]+$/`. The component never reads `formState.errors`, so validation
  failures and the server error set with `setError("root", ...)` are both invisible.
- **Where:** `admin/src/pages/createPost.tsx`.
- **How to see it:** browser: fill the form with a comma in the title, submit, watch the
  Network tab stay empty.
- **A correct fix must:** show the user why the form did not submit, and allow the titles a
  real blog needs. What characters to allow in `seoName` (a URL part) is a separate question
  from what to allow in a title.
- **Teaches:** displaying validation errors; choosing validation rules on purpose.

### D-10: Lithuanian text in an English interface

- **Where:** user-facing strings in `admin/src/features/auth/api.ts`; code comments in
  `api/src/controller/authController.ts` and `admin/src/features/post/hooks/usePosts.ts`.
- **How to see it:** `grep -rnP '[ąčęėįšųūž]' api/src admin/src`
- **A correct fix must:** leave no Lithuanian user-facing strings (`PRODUCT.md` asks for
  English). Comments are the owner's choice.

### D-11: Session hardening gaps (matter before deployment, not in local dev)

- The `jwt` cookie has no `Secure` flag, so it would be sent over plain HTTP.
- `app.use(cors())` allows every origin.
- There is no logout route; the cookie lives 3 days.
- The role is stored in the token, so removing someone's admin role does not take effect until
  their token expires or they log in again.
- **Where:** `api/src/controller/authController.ts`, `api/src/index.ts`,
  `api/src/middleware/authMiddleware.ts`.
- **A correct fix must:** be decided together with how the project will be deployed. None of
  this is urgent while it runs only on localhost.

### D-12: The API cannot be checked, and it hides its errors

- **What you see:** `cd api && npx tsc --noEmit` fails with TS5081 (no `tsconfig.json`). There
  is no lint. When a request fails with 500, the API terminal usually shows nothing.
- **Cause:** `tsx` runs TypeScript without typechecking. Most `catch` blocks return
  `{"message":"Server error"}` and do not log the error. The only logging is in
  `authMiddleware.ts` for a bad token.
- **A correct fix must:** make server errors visible in the server's terminal, and give the
  API a typecheck command. Until then, remember that an empty API log proves nothing.
- **Teaches:** why logging comes before debugging.

### D-13: Dead and leftover code

| Item | Why it is dead |
|---|---|
| `admin/src/features/post/hooks/usePosts.ts` | Imported nowhere. Leftover of the dropped useState plan. |
| `admin/src/features/auth/constants/constants.ts` | Used only inside a commented-out block in `features/auth/pages/signin.tsx`. |
| The commented-out block in `admin/src/features/auth/pages/signin.tsx` | Old form markup. |
| `userPage/src/components/header.tsx` | Empty file. |
| `userPage/src/components/AlertDialogDemo.tsx` | A demo dialog ("delete your account") shown as "Show Dialog" on the post page. |
| `method-override`, `nodemon` in `api/package.json` | Imported and used nowhere. |
| `PORT` in `api/environment.d.ts` | Declared, never read. |
| Root `package.json` and `package-lock.json` | Packages installed in the wrong folder. |

Removing a package is a dependency change: ask the owner first.

### D-14: Shared types are fragile and partly wrong

- `userPage` imports types from `admin` by relative path (`../../../../admin/types`), so the
  two packages are not independent.
- `Post` is declared twice (`admin/types.ts` and `userPage/src/lib/utils.ts`).
- `User` in `admin/types.ts` includes `password`, which the API never sends.
- `sendLoginRequest` and `sendSignupRequest` claim to return `User`, but the API returns
  `{ user: <id> }`. The cast with `as` hides the mismatch.
- **Teaches:** a type is a claim, not a check; `as` switches the check off.

### D-15: Comments are half-built

- Signup never sets `User.name`, so every comment's author is `null` and the comment card
  header is empty.
- The reader site has no login and no comment form. Comments can be created only with `curl`.
- An admin gets 403 when deleting someone else's comment. Whether admins should moderate is
  not decided.
- The `:id` in `DELETE /user/posts/:id/comments/:commentId` is ignored by the handler.

### D-16: A missing post shows "Loading..." for several seconds

- **Cause:** the API answers 404 at once, but TanStack Query retries a failed query three
  times with growing delays before it reports an error.
- **Where:** `userPage/src/features/viewABlog/hooks/usePost.ts`.
- **A correct fix must:** show "not found" promptly for a 404, while still retrying real
  network failures if that is wanted.

### D-17: The reader's post card uses a plain link

- **Cause:** `<a href={`user/posts/${post.id}`}>` is a relative URL and reloads the whole page.
  The router's `<Link>` would navigate without a reload.
- **Where:** `userPage/src/pages/createAPostCard.tsx`.
- **Note:** this is a logic change in `userPage/`, which is allowed; changing how the card
  looks is not (see the project rules).

---

## Project history in brief

| Date | Commit | What happened |
|---|---|---|
| 2026-10-03 .. 10-15 | `005d94b` .. `eab237b` | Start; posts on the admin home page; a localStorage cache for posts (later removed). |
| 2026-10-20 .. 10-22 | `2d93e82` .. `9d776c8` | Mentor instructions (`CLAUDE.md`) and several skills added through PR #1. |
| 2026-10-23 | `6ca2857`, `9940772` | Auth, roles and protected routes; `CLAUDE.md` and `.claude` removed from tracking and gitignored. |
| 2026-10-25 | `c7c337a` | `PRODUCT.md` added. |
| 2026-10-29 | `57a3529` | shadcn components; first Prisma migration; edit button. |
| 2026-11-01 .. 11-05 | `7e4d4f0` .. `8e649cf` | `userPage/` created; posts and single-post view on the reader site. |
| 2026-11-10 | `f1b9dad` | Admin restructured into `features/`; TanStack Query introduced. Commit note proposed moving to axios + useState. |
| 2026-11-12 | `15b1e86` | Comments (schema, routes, reader view); role list in `requireAuth`; the useState plan half-started and left. |

Settled, do not re-open without the owner:

- TanStack Query + `fetch` stays (owner, 2026-11-15).
- Claude config stays untracked on `main`; this skill library was committed on purpose with
  `git add -f` on its own branch.
- Files were moved, not lost: `admin/src/compose/header.tsx` to `components/header.tsx`;
  `api/lib/prisma.ts` to `api/src/lib/prisma.ts`; the old `admin/src/pages/` home, card,
  sign-in and sign-up pages to `admin/src/features/`.

## Updating this file

When an issue is fixed: add `**Status:** fixed in <commit>` under its heading, keep the entry
(it is now history), update the tables in `SKILL.md`, and move its smoke check from `defect`
to `contract` in `scripts/smoke-api.mjs`. New issues get the next free id. Never reuse an id.
