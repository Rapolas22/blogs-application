---
name: mentor-debugging
description: Step-by-step procedure for coaching a learner through a bug so that they find and fix it themselves. Use when the user says something "doesn't work", "does nothing", "is broken", "shows nothing", "keeps loading", pastes an error message or stack trace, reports an HTTP 400, 401, 403, 404 or 500, a blank page, a failed build, a type error, or asks "why is this happening". Contains the seven-step method (reproduce, find the failing layer, read the real error, one hypothesis, predict before running, smallest check, fix and verify), a layer table for web apps, HTTP status meanings, a table of experiments that tell two causes apart, and common traps (swallowed errors, a bug that passes by coincidence, stale login tokens, requests sent twice in dev). Works in any project; examples are from full-stack JavaScript. For the general teaching rules use mentor-mode. For facts about one specific codebase use that project's project-map skill.
---

# Mentor debugging

A procedure for getting a learner from "it doesn't work" to a fix they understand. You run the
procedure with them. They read the errors, they form the guess, they make the change.

This skill applies the rules of `mentor-mode` (one hint at a time, they write the fix). Read
that skill first if you have not.

## When to use this skill

- The learner reports a bug, an error message, or something that silently does nothing.
- A check you ran together failed and nobody knows why yet.

## When NOT to use it

- They want to build something new: use `mentor-mode`.
- You do not know how the project is laid out or how to run it: use
  `mentor-project-discovery` first.
- The project has a project map skill with a list of known issues: check that list first. The
  bug may already be explained there.

## The method

Go through the steps in order. Do not skip to step 6.

| Step | What you ask or do | Why |
|---|---|---|
| 1. Ask first | "What did you expect? What happened instead? What have you already checked?" | They may be one step from the answer. You also learn how they think. |
| 2. Reproduce | Get the exact steps that trigger it, every time. Write them down. | A bug you cannot trigger on demand cannot be confirmed fixed. |
| 3. Find the layer | Use the layer table below. Find the last place where things were still correct. | Most time is lost fixing the wrong layer. |
| 4. Read the real error | The full message, not the first line. Status code, error code, file and line. | The error usually names the cause. |
| 5. One hypothesis, with a prediction | They say: "I think the cause is A. If I am right, when I do X I will see Y." | A guess that predicts nothing cannot be tested. |
| 6. Smallest check | Run the one thing that shows Y or not-Y. | One check, one answer. Change nothing else. |
| 7. Fix, verify, explain | They fix it at the layer that was wrong. Re-run the steps from 2. Then they explain the cause in one sentence. | If they cannot explain it, it may be fixed by accident. |

If the prediction in step 5 was wrong, that is progress: one cause is ruled out. Go back to
step 3 with what you learned. Do not let them change several things at once "to see if it
helps".

## Step 3 in detail: find the layer

For a web app with a browser frontend, a server and a database, a request passes through these
layers. Check them in this order and stop at the first one that is wrong.

| Layer | Where to look | It is wrong here if |
|---|---|---|
| 1. The UI event | Browser DevTools, Console tab; a `console.log` in the click or submit handler | The handler never runs, or form validation stops it before any request. |
| 2. The request | DevTools, Network tab: is there a row for the request? URL, method, body | No row appears, or the URL, method or body is not what you meant to send. |
| 3. The dev proxy or routing | Network tab status 404 or 502; the dev server's terminal | The request never reaches the server (wrong path, server not running, wrong port). |
| 4. Server middleware | Status 401 or 403; the server terminal | It is rejected before your handler runs (not logged in, wrong role). |
| 5. The handler | Status 400 or 500; the server terminal; a log line at the top of the handler | The handler runs and throws, or returns the wrong thing. |
| 6. The database call | The error object from the ORM or driver; the query's inputs | The query is wrong, or the data is not what you assumed. |
| 7. The response back in the UI | Network tab shows 200 with correct data, but the screen is wrong | The UI ignores the response, reads the wrong field, or does not refresh. |

For other kinds of program use the same idea with different layers: input, parsing, logic,
output. Find the last point where the data was still correct.

### What the status code tells you

| Code | Meaning | Usually the layer |
|---|---|---|
| No request at all | The browser never sent it | UI event or client-side validation |
| 400 | The server rejected the input | Handler validation |
| 401 | The server does not know who you are | Auth middleware: no login, expired or invalid token |
| 403 | The server knows who you are and says no | Auth middleware: wrong role, or not the owner |
| 404 | No such route, or no such record | Routing, proxy path, or a lookup that found nothing |
| 409 | Conflict with existing data | Handler: for example a duplicate email |
| 500 | The server code threw an error | Handler or database call |
| 502 / connection refused | Nothing is listening where the request went | The server is not running, or the port is wrong |

## Experiments that tell two causes apart

| You cannot tell whether | Do this | Result |
|---|---|---|
| The request was never sent, or it was sent and failed | Watch the Network tab while you click | No row: the frontend stopped it. A row: look at its status. |
| The frontend or the server is wrong | Send the same request with `curl` | Same failure: server. Works with curl: frontend. |
| The proxy or the server is wrong | `curl` the server's own port directly, then the dev server's proxied path | Direct works, proxied fails: the proxy config or path. |
| Not logged in, or not allowed | Read the status | 401: not logged in. 403: logged in but not allowed. |
| The code or the data is wrong | Try a second record with different values | Fails for all: code. Fails for some: data, or a bug that depends on the values. |
| The server threw, or returned a deliberate error | Read the server terminal; if empty, see "Swallowed errors" below | A stack trace: it threw. A clean message only: it was a deliberate response. |
| The fix worked, or the bug hides | Run the original steps from step 2 again, then one more case that is not the original | Both pass: fixed. |
| Your change did anything at all | Add a `console.log` you cannot miss and reload | Not printed: you are editing the wrong file, or the build is stale. |

## Traps

Each of these has cost real time. Tell the learner the story when it applies.

**Swallowed errors.** A `catch` block that returns a generic message ("Server error") and logs
nothing. The server terminal stays empty, so it looks as if nothing went wrong on the server.
An empty log proves nothing until you have checked that errors are logged at all. The smallest
check: the learner adds `console.error(err)` as the first line of that `catch`, repeats the
request, reads the real error, and decides afterwards whether to keep the log line.

**It works by coincidence.** A bug that depends on the values passes the first manual test
because the first record happens to have convenient values (record 1 owned by user 1, an empty
list, a short string). Always test a second case that differs from the first.

**Stale login.** If the app stores the user's role or permissions inside the login token, a
change in the database does not apply until the user logs in again. "I made myself admin and
it still says forbidden" is usually this.

**Requests sent twice.** In development, React StrictMode runs effects twice on purpose. Two
identical requests in the Network tab on page load are normal in dev and do not happen in a
production build.

**Automatic retries hide errors.** Data-fetching libraries such as TanStack Query retry a
failed request several times before reporting an error. A page that shows "Loading..." for
several seconds and then an error may be a fast 404 being retried.

**Environment not loaded.** A missing or misspelled environment variable often does not stop
the server from starting. It fails later, on the first request that needs it. If everything
that touches the database or the login fails at once, check the environment first.

**Editing the wrong copy.** Two folders with similar files, a generated file, or a stale build.
Use the "did my change do anything" experiment above.

**Fixing the symptom's layer.** Hiding a button in the UI does not fix a server that allows the
action. Fix where the wrong decision is made.

## Rules while debugging

- Reading and measuring is always fine: logs, the Network tab, `curl` with GET, `git diff`.
- Anything that changes their data is theirs to run. Give the command and say what it changes.
- A temporary log line is a change to their code. They add it, and you remind them to decide at
  the end whether it stays.
- One change at a time. If a change did not help, undo it before trying the next.
- When the bug is fixed, ask the learner to state the cause in one sentence, and ask one
  follow-up: "How could we have found this faster?"

## After the fix

If the project has a project map skill with a known-issues list, the entry for this bug should
be updated or removed. Tell the learner and let them decide who edits it.

## Provenance and maintenance

- Written 2026-11-15. The traps and experiments come from running and testing a real
  Express + Prisma + React project on that date; they are described here without any
  project-specific facts so the skill stays valid elsewhere.
- Nothing in this skill depends on a codebase. Update it when a new kind of trap costs time:
  add it to "Traps" with a one-paragraph story and the check that exposes it.
- To use it in every project:
  ```bash
  mkdir -p ~/.claude/skills && cp -r .claude/skills/mentor-debugging ~/.claude/skills/
  ```
