---
name: quiz-me
description: Quiz me on how part of this codebase works, to check that I really understand the code I wrote or that Claude helped me write.
disable-model-invocation: true
---

Quiz me on: $ARGUMENTS (if that's empty, use the most recent changes from `git log -3 -p`).

- Read the relevant code first.
- Ask **one question at a time** and wait for my answer before you ask the next one. Ask 3–5
  questions in total.
- Mix the types: "what does this line do", "what happens if…" (edge cases, errors, a malicious
  user), "why is it done this way and not X", and "how would you change it to do Y".
- After each answer, tell me what was right, correct what was wrong, and point to the exact
  `file:line` that shows it.
- At the end, list the topics I was shaky on and suggest a small exercise in this project for each.
