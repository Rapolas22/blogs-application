---
version: 1
slug: "userpage-src-app-tsx"
primary_target: "userPage/src/App.tsx"
related_targets: ["userPage/src/features"]
---

# Reader site (userPage/)

Scope: the public reader site of the IT blog: home (hero + post list), post page with comments, sign in, sign up. Mode: Read.
Audience: developers and CS students reading long-form posts with code. Job: find a post, read it comfortably, comment.
Constraints: UI only. No changes to hooks, API calls, mutations or routes. The code must stay simple enough for the owner (a student) to read and change.
Name and mark: "Homerow", a keycap with a homing bar, chosen by the owner on 2026-11-25 to replace the boilerplate "Blookie".

## Direction contract

THESIS: The blog is a keyboard the reader already knows by touch. Themes are keycap colourways, switched by pressing a key. This replaces the stock dark-photo hero and the generic card grid.
OWN-WORLD: Four colourways (Paper, Matcha, Retro, Midnight). Each has a ground, an ink, light keys with a darker bottom edge, a dark "plate", and one accent used on the primary key and the featured post. Display type is Bricolage Grotesque. There's one Literata italic accent word in headings, Geist for UI, and Literata for reading.
STORY: The reader sees what the blog is, presses a colourway key and watches the page re-colour from that key, then opens a post from the plate and reads it in a calm column.
FIRST VIEWPORT: The navbar has the logo and name on the left, and on the right the four colourway keycaps, Log in, and a keycap Sign up. Below it, a huge left-aligned headline with an italic accent phrase, a short paragraph and a keycap CTA on the right. The top of the dark plate with post keys begins at the fold.
FORM: Keycap colourways. Second on my ordered list (#1 grounded pick chosen by the user). seed: d034b84e09e39607 (re-roll 1, user chose IMPECCABLE'S PICK).
Signature interaction: pressing a colourway key starts a View Transition that reveals the new theme as a circle growing from that key. With reduced motion it switches instantly.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
