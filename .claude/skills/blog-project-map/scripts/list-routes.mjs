#!/usr/bin/env node
// list-routes.mjs - print every API route with its guard, straight from the source.
//
// Reads api/src/routes/*.ts and prints: METHOD, PATH, GUARD, HANDLER, FILE.
// Use it to re-verify any route table written in a skill or a doc: the source wins.
//
// GUARD meanings (see api/src/middleware/authMiddleware.ts):
//   public                     - no requireAuth(): anyone, no login needed
//   login (any role)           - requireAuth() with an empty list: any valid JWT cookie
//   role: ADMIN / ADMIN,USER   - requireAuth([...]): the JWT's role must be in the list
//
// Usage: node .claude/skills/blog-project-map/scripts/list-routes.mjs
// Read-only. No dependencies. Does not start the API.
//
// Limit: it is a text scan, not a TypeScript parser. It understands the one pattern
// this repo uses:  someRouter.METHOD("/path", [requireAuth(...),] handler);
// If routes are ever registered another way, this script will miss them - compare
// its row count with `grep -c "Router\.\(get\|post\|put\|patch\|delete\)"` to be sure.

import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "..", "..", "..", "..");
const routesDir = path.join(repoRoot, "api", "src", "routes");

const rows = [];
for (const file of readdirSync(routesDir).filter((f) => f.endsWith(".ts")).sort()) {
  const src = readFileSync(path.join(routesDir, file), "utf8");
  const re = /\b\w+\.(get|post|put|patch|delete)\(\s*["'`]([^"'`]+)["'`]\s*,([\s\S]*?)\);/g;
  for (const m of src.matchAll(re)) {
    const [, method, routePath, rest] = m;
    const guardMatch = rest.match(/requireAuth\(\s*(\[[^\]]*\])?\s*\)/);
    let guard = "public";
    if (guardMatch) {
      const roles = (guardMatch[1] ?? "[]").replace(/[\[\]"'\s]/g, "");
      guard = roles ? `role: ${roles}` : "login (any role)";
    }
    const handler = rest
      .replace(/requireAuth\([^)]*\)\s*,?/, "")
      .replace(/[\s,]+/g, " ")
      .trim();
    rows.push({ method: method.toUpperCase(), routePath, guard, handler, file });
  }
}

const w = (key) => Math.max(key.length, ...rows.map((r) => r[key].length));
const cols = ["method", "routePath", "guard", "handler", "file"];
const widths = Object.fromEntries(cols.map((c) => [c, w(c)]));
const line = (r) => cols.map((c) => r[c].padEnd(widths[c])).join("  ");
console.log(line({ method: "METHOD", routePath: "PATH", guard: "GUARD", handler: "HANDLER", file: "FILE" }));
console.log(cols.map((c) => "-".repeat(widths[c])).join("  "));
for (const r of rows) console.log(line(r));
console.log(`\n${rows.length} routes. The API has no path prefix; the browser apps call these as /api/<path> through the Vite dev proxy.`);
