#!/usr/bin/env node
// check-all.mjs - run every static gate the three packages have, and print one table.
//
// Gates (these are all the automated checks that exist in this repo; there are no tests and no CI):
//   api       prisma validate            (schema is well-formed)
//   api       tsc --noEmit               (ONLY if api/tsconfig.json exists - today it does not)
//   admin     npm run lint               (oxlint)
//   admin     npm run build              (tsc -b && vite build - this is admin's only typecheck)
//   userPage  npm run lint               (eslint)
//   userPage  npm run typecheck          (tsc --noEmit)
//   userPage  npm run build              (tsc -b && vite build)
//
// Usage:   node .claude/skills/blog-project-map/scripts/check-all.mjs
// Options: --verbose   also print the full output of gates that PASS
// Exit:    0 = every gate that ran passed, 1 = at least one FAIL, 2 = dependencies missing.
//
// Side effects: `vite build` writes admin/dist and userPage/dist (both gitignored).

import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "..", "..", "..", "..");
const verbose = process.argv.includes("--verbose");

for (const pkg of ["api", "admin", "userPage"]) {
  if (!existsSync(path.join(repoRoot, pkg, "node_modules"))) {
    console.error(`REFUSED: ${pkg}/node_modules is missing. Run:  cd ${pkg} && npm ci`);
    process.exit(2);
  }
}

const gates = [
  { pkg: "api", name: "prisma validate", cmd: "npx prisma validate" },
  existsSync(path.join(repoRoot, "api", "tsconfig.json"))
    ? { pkg: "api", name: "typecheck", cmd: "npx tsc --noEmit" }
    : { pkg: "api", name: "typecheck", skip: "no api/tsconfig.json, so the API cannot be typechecked (D-12)" },
  { pkg: "admin", name: "lint", cmd: "npm run lint" },
  { pkg: "admin", name: "build", cmd: "npm run build" },
  { pkg: "userPage", name: "lint", cmd: "npm run lint" },
  { pkg: "userPage", name: "typecheck", cmd: "npm run typecheck" },
  { pkg: "userPage", name: "build", cmd: "npm run build" },
];

const results = [];
for (const gate of gates) {
  if (gate.skip) {
    results.push({ ...gate, verdict: "NO GATE", note: gate.skip });
    continue;
  }
  process.stderr.write(`running ${gate.pkg}: ${gate.cmd} ...\n`);
  const run = spawnSync(gate.cmd, {
    cwd: path.join(repoRoot, gate.pkg),
    shell: true, // needed so `npm`/`npx` resolve on Windows too
    encoding: "utf8",
  });
  const output = `${run.stdout ?? ""}${run.stderr ?? ""}`;
  const warnings = (output.match(/\bwarning\b/gi) ?? []).length;
  results.push({
    ...gate,
    verdict: run.status === 0 ? "PASS" : "FAIL",
    note: run.status === 0 ? (warnings ? `${warnings} warning line(s)` : "") : `exit ${run.status}`,
    output,
  });
}

console.log("");
console.log("package   gate             verdict  note");
console.log("--------  ---------------  -------  ----");
for (const r of results) {
  console.log(`${r.pkg.padEnd(8)}  ${r.name.padEnd(15)}  ${r.verdict.padEnd(7)}  ${r.note ?? ""}`);
}
for (const r of results) {
  if (r.verdict === "FAIL" || (verbose && r.output)) {
    console.log(`\n===== ${r.pkg}: ${r.cmd} (${r.verdict}) =====`);
    console.log(r.output.trim());
  }
}
console.log("");
console.log("Baseline recorded on 2026-11-15 at commit 15b1e86: every gate PASS except");
console.log("admin build = FAIL (4 x TS6133 in admin/src/pages/helpers/dialogHelpers.tsx, defect D-01)");
console.log("and api typecheck = NO GATE. Anything worse than that is a regression.");

process.exit(results.some((r) => r.verdict === "FAIL") ? 1 : 0);
