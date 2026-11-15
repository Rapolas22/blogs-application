#!/usr/bin/env node
// smoke-api.mjs - end-to-end check of every API route against a SCRATCH database.
//
// What it does:
//   1. Refuses to run unless SMOKE_DATABASE_URL points at a database whose name
//      contains "smoke", "test" or "scratch" (protects the owner's real database).
//   2. Refuses to run if something already listens on port 3000 (the API port is
//      hardcoded in api/src/index.ts, so a second copy cannot start, and we must
//      never send test traffic to a server that may be using the real database).
//   3. Applies the committed migrations to the scratch database, then EMPTIES it.
//   4. Starts the API with the scratch database and a throwaway JWT secret.
//   5. Calls every route and compares the HTTP status with the expected one.
//   6. Stops the API.
//
// Two kinds of checks:
//   contract - behavior that is correct today and must stay that way. A mismatch is a FAIL.
//   defect   - a known bug (ids D-xx, see reference/known-issues.md in this skill).
//              "PRESENT" = the bug is still there (not a failure of this script).
//              "GONE"    = the bug looks fixed: update the register and move the
//                          check to the contract list.
//              "CHANGED" = neither the buggy nor the wanted behavior: investigate.
//
// Usage (from anywhere inside the repo):
//   SMOKE_DATABASE_URL='postgresql://USER:PASS@localhost:5432/blog_smoke' \
//     node .claude/skills/blog-project-map/scripts/smoke-api.mjs
//
// Exit codes: 0 = all contract checks OK, 1 = a contract check failed or a
// defect check CHANGED, 2 = refused to run / setup problem.
//
// Uses only packages already installed in api/node_modules (pg, prisma, tsx).

import { spawn, spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { existsSync } from "node:fs";
import net from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "..", "..", "..", "..");
const apiDir = path.join(repoRoot, "api");
const BASE = "http://localhost:3000";
const PORT = 3000;

function refuse(msg) {
  console.error(`REFUSED: ${msg}`);
  process.exit(2);
}

// ---------- safety gates ----------
const dbUrl = process.env.SMOKE_DATABASE_URL;
if (!dbUrl) {
  refuse(
    "set SMOKE_DATABASE_URL to an empty scratch Postgres database, e.g.\n" +
      "  SMOKE_DATABASE_URL='postgresql://USER:PASS@localhost:5432/blog_smoke'",
  );
}
let dbName;
try {
  dbName = decodeURIComponent(new URL(dbUrl).pathname.replace(/^\//, ""));
} catch {
  refuse("SMOKE_DATABASE_URL is not a valid URL");
}
if (!/(smoke|test|scratch)/i.test(dbName)) {
  refuse(
    `database name "${dbName}" does not contain "smoke", "test" or "scratch".\n` +
      "This script DELETES ALL ROWS. It will not touch a database that is not clearly a scratch one.",
  );
}
for (const needed of [
  "node_modules/pg",
  "node_modules/prisma/build/index.js",
  "node_modules/tsx/dist/cli.mjs",
]) {
  if (!existsSync(path.join(apiDir, needed))) {
    refuse(`api/${needed} is missing. Run:  cd api && npm ci`);
  }
}
if (!existsSync(path.join(apiDir, "src", "generated", "prisma", "client.ts"))) {
  refuse(
    "the generated Prisma client is missing. Run:  cd api && npx prisma generate",
  );
}

function portInUse(port) {
  return new Promise((resolve) => {
    const sock = net.connect({ port, host: "127.0.0.1" });
    sock.once("connect", () => {
      sock.destroy();
      resolve(true);
    });
    sock.once("error", () => resolve(false));
  });
}
if (await portInUse(PORT)) {
  refuse(
    `something is already listening on port ${PORT}. Stop your dev API first ` +
      "(the port is hardcoded, and this script must not test against your real database).",
  );
}

// ---------- prepare the scratch database ----------
const childEnv = {
  ...process.env,
  DATABASE_URL: dbUrl, // shell variables win over api/.env (dotenv does not override)
  JWT_SIGN: "smoke-test-secret-not-for-real-use",
  NODE_ENV: "development",
};

const migrate = spawnSync(
  process.execPath,
  [path.join(apiDir, "node_modules/prisma/build/index.js"), "migrate", "deploy"],
  { cwd: apiDir, env: childEnv, encoding: "utf8" },
);
if (migrate.status !== 0) {
  console.error(migrate.stdout, migrate.stderr);
  refuse("`prisma migrate deploy` failed on the scratch database (output above)");
}

const require = createRequire(path.join(apiDir, "package.json"));
const pg = require("pg");
const db = new pg.Client({ connectionString: dbUrl });
await db.connect();
await db.query('TRUNCATE "Comment", "Post", "User" RESTART IDENTITY CASCADE');

// ---------- start the API ----------
let apiLog = "";
const api = spawn(
  process.execPath,
  [path.join(apiDir, "node_modules/tsx/dist/cli.mjs"), "src/index.ts"],
  { cwd: apiDir, env: childEnv },
);
api.stdout.on("data", (d) => (apiLog += d));
api.stderr.on("data", (d) => (apiLog += d));

async function cleanup() {
  try {
    await db.end();
  } catch {}
  api.kill();
}

let up = false;
for (let i = 0; i < 60 && !up; i++) {
  await new Promise((r) => setTimeout(r, 250));
  up = await portInUse(PORT);
  if (api.exitCode !== null) break;
}
if (!up) {
  console.error(apiLog);
  await cleanup();
  refuse("the API did not start within 15 s (its output is above)");
}

// ---------- tiny HTTP helper with a manual cookie jar ----------
async function call(method, urlPath, { body, cookie } = {}) {
  const headers = {};
  if (body !== undefined) headers["content-type"] = "application/json";
  if (cookie) headers["cookie"] = cookie;
  const res = await fetch(BASE + urlPath, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {}
  const setCookie = res.headers.get("set-cookie") ?? "";
  return { status: res.status, json, text, setCookie };
}
const jwtFrom = (setCookie) => (setCookie.match(/jwt=[^;]+/) ?? [""])[0];

// ---------- result bookkeeping ----------
const rows = [];
function contract(name, ok, detail) {
  rows.push({ kind: "contract", name, verdict: ok ? "OK" : "FAIL", detail });
}
// today = the buggy observation, want = the observation after a correct fix
function defect(id, name, observed, today, want) {
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  const verdict = same(observed, today)
    ? "PRESENT"
    : same(observed, want)
      ? "GONE"
      : "CHANGED";
  rows.push({
    kind: "defect",
    name: `${id} ${name}`,
    verdict,
    detail: `observed ${JSON.stringify(observed)}, buggy=${JSON.stringify(today)}, wanted=${JSON.stringify(want)}`,
  });
}

try {
  const creds = (email) => ({ email, password: "secret1" });
  let r;

  // --- signup / login ---
  r = await call("POST", "/signup", { body: creds("admin@smoke.test") });
  contract("signup new email -> 201", r.status === 201, `got ${r.status}`);
  r = await call("POST", "/signup", { body: creds("admin@smoke.test") });
  contract("signup duplicate email -> 409", r.status === 409, `got ${r.status}`);
  r = await call("POST", "/signup", { body: creds("reader@smoke.test") });
  contract("signup second user -> 201", r.status === 201, `got ${r.status}`);

  r = await call("POST", "/signup", { body: {} });
  defect("D-05", "signup with empty body", r.status, 500, 400);

  const unknown = await call("POST", "/login", { body: creds("nobody@smoke.test") });
  const wrongPw = await call("POST", "/login", {
    body: { email: "reader@smoke.test", password: "wrong-password" },
  });
  contract("login unknown email -> 401", unknown.status === 401, `got ${unknown.status}`);
  contract("login wrong password -> 401", wrongPw.status === 401, `got ${wrongPw.status}`);
  defect(
    "D-06",
    "login error text reveals whether the email exists",
    unknown.json?.message === wrongPw.json?.message ? "same message" : "different messages",
    "different messages",
    "same message",
  );

  r = await call("POST", "/login", { body: creds("reader@smoke.test") });
  const readerCookie = jwtFrom(r.setCookie);
  contract("login as USER -> 200 and sets jwt cookie", r.status === 200 && !!readerCookie, `got ${r.status}`);
  contract("jwt cookie is HttpOnly", /httponly/i.test(r.setCookie), r.setCookie.replace(/jwt=[^;]+/, "jwt=<hidden>"));
  contract("jwt cookie is SameSite=Lax", /samesite=lax/i.test(r.setCookie), "");

  // --- role gates ---
  r = await call("GET", "/me");
  contract("/me without cookie -> 401", r.status === 401, `got ${r.status}`);
  r = await call("GET", "/me", { cookie: "jwt=not.a.real.token" });
  contract("/me with a forged token -> 401", r.status === 401, `got ${r.status}`);
  r = await call("GET", "/me", { cookie: readerCookie });
  contract("/me as USER -> 403", r.status === 403, `got ${r.status}`);
  r = await call("GET", "/getPosts", { cookie: readerCookie });
  contract("/getPosts as USER -> 403", r.status === 403, `got ${r.status}`);
  r = await call("POST", "/postCreation", { cookie: readerCookie, body: { title: "x" } });
  contract("/postCreation as USER -> 403", r.status === 403, `got ${r.status}`);

  // The API has no way to make an admin. The first ADMIN is always made in SQL.
  await db.query(`UPDATE "User" SET role = 'ADMIN' WHERE email = 'admin@smoke.test'`);
  r = await call("POST", "/login", { body: creds("admin@smoke.test") });
  const adminCookie = jwtFrom(r.setCookie);
  contract("login as ADMIN -> 200", r.status === 200 && !!adminCookie, `got ${r.status}`);
  r = await call("GET", "/me", { cookie: adminCookie });
  contract("/me as ADMIN -> 200", r.status === 200, `got ${r.status}`);

  // --- posts (admin) ---
  // Post 1 is written by user 1, so post.id === author.id. That coincidence matters for D-02.
  r = await call("POST", "/postCreation", {
    cookie: adminCookie,
    body: { title: "First", content: "<p>one</p>", thumbnailUrl: "http://example.invalid/a.png", description: "d", seoName: "first" },
  });
  const p1 = r.json?.id;
  contract("create post -> 201, starts as a draft", r.status === 201 && r.json?.published === false, `got ${r.status}`);
  r = await call("POST", "/postCreation", { cookie: adminCookie, body: { title: "Second", content: "<p>two</p>" } });
  const p2 = r.json?.id;
  contract("create second post -> 201", r.status === 201, `got ${r.status}`);

  r = await call("POST", "/postCreation", { cookie: adminCookie, body: {} });
  defect("D-05", "create post with empty body", r.status, 201, 400);
  if (r.json?.id) await db.query('DELETE FROM "Post" WHERE id = $1', [r.json.id]);

  r = await call("GET", "/getPosts", { cookie: adminCookie });
  contract(
    "admin list -> 200, 2 posts, no `content` field",
    r.status === 200 && r.json?.length === 2 && !("content" in r.json[0]),
    `got ${r.status}, ${r.json?.length} items`,
  );
  r = await call("GET", `/getPosts/${p1}`, { cookie: adminCookie });
  contract("admin get one post -> 200 with content", r.status === 200 && r.json?.content === "<p>one</p>", `got ${r.status}`);
  r = await call("GET", "/getPosts/999999", { cookie: adminCookie });
  contract("admin get missing post -> 404", r.status === 404, `got ${r.status}`);
  r = await call("GET", "/getPosts/abc", { cookie: adminCookie });
  defect("D-05", "non-numeric post id", r.status, 500, 400);

  r = await call("PATCH", `/patchPosts/${p1}`, { cookie: adminCookie, body: { title: "First edited" } });
  contract("edit post whose id equals its author's id -> 200", r.status === 200 && r.json?.title === "First edited", `got ${r.status}`);
  r = await call("PATCH", `/patchPosts/${p2}`, { cookie: adminCookie, body: { title: "Second edited" } });
  defect("D-02", "edit own post whose id differs from the author's id", r.status, 500, 200);

  await call("PATCH", `/patchPosts/${p1}`, { cookie: adminCookie, body: { published: true } });
  r = await call("GET", `/getPosts/${p1}`, { cookie: adminCookie });
  defect("D-03", "PATCH {published:true} publishes the post", r.json?.published, false, true);

  // --- public reader routes ---
  r = await call("GET", "/user/posts");
  if ((await db.query('SELECT count(*)::int AS n FROM "Post" WHERE published')).rows[0].n === 0) {
    contract("public list hides drafts -> 200 and empty", r.status === 200 && r.json?.length === 0, `got ${r.status}, ${r.json?.length} items`);
    // No route can publish (D-03), so publish post 1 directly in the scratch database.
    await db.query('UPDATE "Post" SET published = true WHERE id = $1', [p1]);
  }
  r = await call("GET", "/user/posts");
  contract("public list shows only the published post", r.status === 200 && r.json?.length === 1 && r.json[0].id === p1, `got ${r.status}, ${r.json?.length} items`);
  r = await call("GET", `/user/posts/${p1}`);
  contract("public get published post -> 200", r.status === 200, `got ${r.status}`);
  r = await call("GET", `/user/posts/${p2}`);
  contract("public get draft post -> 404", r.status === 404, `got ${r.status}`);

  // --- comments ---
  r = await call("GET", `/user/posts/${p2}/comments`);
  defect("D-04", "public can read comments of a draft post", r.status, 200, 404);
  r = await call("POST", `/user/posts/${p2}/comments`, { cookie: readerCookie, body: { content: "on a draft" } });
  defect("D-04", "logged-in user can comment on a draft post", r.status, 201, 404);

  r = await call("POST", `/user/posts/${p1}/comments`, { body: { content: "anon" } });
  contract("comment without login -> 401", r.status === 401, `got ${r.status}`);
  r = await call("POST", `/user/posts/${p1}/comments`, { cookie: readerCookie, body: { content: "hello" } });
  const c1 = r.json?.id;
  contract("comment as USER on a published post -> 201", r.status === 201, `got ${r.status}`);
  r = await call("GET", `/user/posts/${p1}/comments`);
  const userKeys = Object.keys(r.json?.[0]?.user ?? {}).join(",");
  contract("comment list exposes only user.name (no email, no password)", r.status === 200 && userKeys === "name", `user keys: ${userKeys}`);
  r = await call("DELETE", `/user/posts/${p1}/comments/${c1}`, { cookie: adminCookie });
  contract("delete someone else's comment -> 403 (today even for ADMIN)", r.status === 403, `got ${r.status}`);
  r = await call("DELETE", `/user/posts/${p1}/comments/${c1}`, { cookie: readerCookie });
  contract("delete own comment -> 200", r.status === 200, `got ${r.status}`);
  r = await call("DELETE", `/user/posts/${p1}/comments/${c1}`, { cookie: readerCookie });
  contract("delete missing comment -> 404", r.status === 404, `got ${r.status}`);
  r = await call("POST", "/user/posts/999999/comments", { cookie: readerCookie, body: { content: "x" } });
  defect("D-05", "comment on a post that does not exist", r.status, 500, 404);

  // --- delete post ---
  r = await call("DELETE", `/post/remove/${p2}`, { cookie: readerCookie });
  contract("delete post as USER -> 403", r.status === 403, `got ${r.status}`);
  r = await call("DELETE", `/post/remove/${p2}`, { cookie: adminCookie });
  contract("delete post as ADMIN -> 200", r.status === 200, `got ${r.status}`);
  r = await call("DELETE", `/post/remove/${p2}`, { cookie: adminCookie });
  contract("delete missing post -> 404", r.status === 404, `got ${r.status}`);
} catch (err) {
  console.error("The smoke run crashed:", err);
  console.error("--- API output ---\n" + apiLog);
  await cleanup();
  process.exit(1);
}

await cleanup();

// ---------- report ----------
for (const row of rows) {
  const tag = row.kind === "contract" ? row.verdict.padEnd(7) : row.verdict.padEnd(7);
  const show = row.verdict !== "OK";
  console.log(`${tag} ${row.kind === "defect" ? "[defect]   " : "[contract] "}${row.name}${show && row.detail ? `  (${row.detail})` : ""}`);
}
const c = rows.filter((r) => r.kind === "contract");
const d = rows.filter((r) => r.kind === "defect");
const cOk = c.filter((r) => r.verdict === "OK").length;
const count = (v) => d.filter((r) => r.verdict === v).length;
console.log("");
console.log(`contract checks: ${cOk}/${c.length} OK`);
console.log(`known defects:   ${count("PRESENT")} present, ${count("GONE")} gone, ${count("CHANGED")} changed (of ${d.length})`);
if (count("GONE") > 0) {
  console.log("A defect is GONE: update reference/known-issues.md in the blog-project-map skill and move its check to the contract list.");
}
const failed = cOk !== c.length || count("CHANGED") > 0;
process.exit(failed ? 1 : 0);
