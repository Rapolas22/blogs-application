---
name: Homerow
description: A dev blog drawn as a keyboard the reader already knows by touch.
colors:
  paper-ground: "#efe9dc"
  paper-ink: "#2b2a28"
  paper-key: "#f8f4ea"
  paper-key-edge: "#d6ccb8"
  paper-muted: "#e4dccb"
  paper-muted-ink: "#625c52"
  paper-border: "#d6ccb8"
  paper-input: "#cfc4ae"
  paper-plate: "#2b2a28"
  paper-plate-ink: "#efe9dc"
  paper-accent: "#c8432b"
  paper-accent-ink: "#a8361f"
  paper-on-accent: "#ffffff"
  matcha-ground: "#e2eadd"
  matcha-ink: "#1e2a21"
  matcha-key: "#f1f5ee"
  matcha-key-edge: "#c2d0bc"
  matcha-plate: "#24332a"
  matcha-accent: "#3f6e4d"
  matcha-accent-ink: "#3a6647"
  retro-ground: "#e6dfcc"
  retro-ink: "#34302a"
  retro-key: "#f4efe3"
  retro-key-edge: "#cbc1a8"
  retro-plate: "#3d3830"
  retro-accent: "#e8892f"
  retro-accent-ink: "#9a4c0b"
  retro-on-accent: "#1d1a16"
  midnight-ground: "#1c2440"
  midnight-ink: "#e6e9f2"
  midnight-key: "#2a3560"
  midnight-key-edge: "#151b33"
  midnight-plate: "#080b16"
  midnight-accent: "#7cc7ff"
  midnight-accent-ink: "#7cc7ff"
  midnight-on-accent: "#0b1020"
  error: "#b3261e"
  error-midnight: "#ff8a80"
typography:
  display:
    fontFamily: "Bricolage Grotesque Variable, sans-serif"
    fontSize: "clamp(3rem, 8.5vw, 6.75rem)"
    fontWeight: 800
    lineHeight: 0.92
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Bricolage Grotesque Variable, sans-serif"
    fontSize: "3.75rem"
    fontWeight: 800
    lineHeight: 1.02
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Bricolage Grotesque Variable, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  key-title:
    fontFamily: "Bricolage Grotesque Variable, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.025em"
  accent-italic:
    fontFamily: "Literata Variable, Georgia, serif"
    fontWeight: 500
    letterSpacing: "-0.02em"
  reading:
    fontFamily: "Literata Variable, Georgia, serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.75
  lede:
    fontFamily: "Geist Variable, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.625
  body:
    fontFamily: "Geist Variable, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Geist Variable, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.43
  code:
    fontFamily: "ui-monospace, Cascadia Code, Menlo, monospace"
    fontSize: "0.875rem"
    lineHeight: 1.65
rounded:
  colourway-key: "8px"
  control: "0.75rem"
  key: "1.35rem"
  plate: "1.65rem"
  full: "9999px"
spacing:
  gutter-mobile: "20px"
  gutter-tablet: "32px"
  gutter-desktop: "48px"
  plate-inset: "12px"
  plate-inset-wide: "16px"
  key-gap: "12px"
  key-gap-wide: "16px"
  key-padding: "24px"
  page-max: "72rem"
  reading-column: "48rem"
components:
  button-primary:
    backgroundColor: "{colors.paper-accent}"
    textColor: "{colors.paper-on-accent}"
    rounded: "{rounded.control}"
    padding: "0 10px"
    height: "36px"
  button-key:
    backgroundColor: "{colors.paper-key}"
    textColor: "{colors.paper-ink}"
    rounded: "{rounded.control}"
    padding: "0 10px"
    height: "32px"
  colourway-key:
    rounded: "{rounded.colourway-key}"
    size: "28px"
  plate:
    backgroundColor: "{colors.paper-plate}"
    textColor: "{colors.paper-plate-ink}"
    rounded: "{rounded.plate}"
    padding: "{spacing.plate-inset}"
  post-key:
    backgroundColor: "{colors.paper-key}"
    textColor: "{colors.paper-ink}"
    typography: "{typography.key-title}"
    rounded: "{rounded.key}"
    padding: "{spacing.key-padding}"
  post-key-accent:
    backgroundColor: "{colors.paper-accent}"
    textColor: "{colors.paper-on-accent}"
    typography: "{typography.key-title}"
    rounded: "{rounded.key}"
    padding: "{spacing.key-padding}"
  input:
    textColor: "{colors.paper-ink}"
    rounded: "{rounded.control}"
    padding: "4px 10px"
    height: "40px"
---

# Design System: Homerow

Scope: this file covers the public reader site (`userPage/`) only. The admin panel (`admin/`) is a separate, plain shadcn tool and is not part of this world.

## Overview

**Creative North Star: "The Home Row"**

Homerow is a dev blog drawn as a keyboard the reader already knows by touch. Buttons, posts, comments and the sign-in form are all keycaps: flat, slightly rounded tops with a darker bottom edge that gets thinner when you press them. Groups of keys sit on a dark "plate", the base of a keyboard. The homing bar (the small bump on the F and J keys) is the one ornament, and it marks the most important key in a group.

The look comes in four colourways, named like keycap sets: Paper (the default), Matcha, Retro and Midnight. Every colourway fills the same roles: a ground, an ink, light keys with a darker edge, a dark plate, and one accent. Readers switch colourways with four small keycaps in the header, and the new colours spread out in a circle from the key they pressed.

Pages are calm and spacious. The home page has a huge left-aligned headline, then the plate of post keys. A post is one reading column in a serif face. There is no photo hero and no generic card grid with drop shadows.

**Key Characteristics:**
- Everything you can press is a keycap with an inset bottom edge, not a floating shadow.
- Dark plates group keys; light keys sit on them.
- One accent per colourway, spent on the primary button, the featured post and accent text.
- A heavy grotesque display face with one Literata italic word in headings.
- Colourways are swapped live, with a circle reveal from the pressed key.

## Colors

Four warm-to-cool keycap colourways that share one set of roles. Each value lives as a CSS variable in `userPage/src/index.css`; Paper sits on `:root`, the rest on `[data-theme="..."]`. Components only ever use the role variables (`--primary`, `--plate`, `--key-edge` and so on), never a raw hex.

### Primary
- **Brick Red** (paper-accent): Paper's accent. Fills the primary button, the featured post key and the logo keycap. Also the focus ring colour.
- **Matcha Green** (matcha-accent), **Workshop Orange** (retro-accent), **Sky Legend Blue** (midnight-accent): the same role in the other three colourways.
- **Accent ink** (paper-accent-ink and siblings, `--primary-ink`): the accent darkened until it is readable as text on the ground. Used for the italic heading word, text links, list markers in posts and the text caret. In Midnight the accent is already light enough, so both are the same blue.

### Neutral
- **Ground** (paper-ground, `--background`): the page itself, a warm unbleached paper. Midnight's ground is a deep navy.
- **Ink** (paper-ink, `--foreground`): headings and body text.
- **Key top** (paper-key, `--card`): the surface of every light key (post cards, comments, the outline button, the sign-in form).
- **Key edge** (paper-key-edge, `--key-edge`): the darker bottom edge drawn under light keys. In Paper, Matcha and Retro it matches the border colour; in Midnight it is darker than the key.
- **Plate** (paper-plate, `--plate`) with **plate ink** (`--plate-foreground`): the dark keyboard base under the post list, the comments and the sign-in form. Code blocks in posts also sit on the plate colour.
- **Muted** (paper-muted, `--muted`) and **muted ink** (paper-muted-ink, `--muted-foreground`): hover fills, blockquotes, inline code backgrounds, dates and secondary text.
- **Border / Input** (paper-border, paper-input): hairlines (the footer rule, the header divider) and form field strokes.
- **Error** (error, error-midnight): validation and failure messages only.

### Named Rules
**The Two Accents Rule.** `--primary` is for fills (buttons, the featured key, the logo). `--primary-ink` is for text and thin marks (links, the italic heading word, list markers, caret). Accent-coloured text always uses `--primary-ink`, because Retro's orange fill is not readable as text on its ground.

**The Same Roles Rule.** A new colourway must define every role variable (ground, ink, key, key-edge, muted, border, input, plate, plate-foreground, primary, primary-foreground, primary-ink, ring). A component that needs a colour none of the roles cover is a sign the design is drifting.

**The One Accent Rule.** Each group of keys has at most one accent key. On the post plate it is the newest post; in a form it is the submit button.

## Typography

**Display Font:** Bricolage Grotesque Variable (with sans-serif)
**Reading Font:** Literata Variable (with Georgia, serif)
**UI Font:** Geist Variable (with sans-serif)
**Code Font:** the system monospace stack (ui-monospace, Cascadia Code, Menlo)

**Character:** A chunky, tightly tracked grotesque does the shouting; a bookish serif does the reading and supplies one italic word of warmth in each big heading. Geist stays quiet for buttons, labels and short UI text.

### Hierarchy
- **Display** (800, clamp(3rem, 8.5vw, 6.75rem), line-height 0.92, tracking -0.04em): the home page headline only. Left-aligned and balanced.
- **Headline** (800, 2.25rem on mobile to 3.75rem, line-height 1.02, tracking -0.03em): a post's title. The sign-in and sign-up headings use the same face at 3rem with display tracking.
- **Title** (700, 1.875rem to 2.25rem, tight tracking): section headings like "Latest posts" and "Comments".
- **Key title** (700, 1.5rem, line-height 1.25): the title on a post key.
- **Reading** (Literata 400, 1.125rem, line-height 1.75, max 68ch): post bodies. Headings inside a post switch back to the display face at 700 (1.75rem / 1.375rem / 1.125rem).
- **Lede** (Geist 400, 1.125rem, relaxed line-height): the short paragraph under the home headline.
- **Body** (Geist 400, 1rem): comments and general UI text.
- **Label** (Geist 500, 0.875rem): buttons, form labels, dates, "Read post".

### Named Rules
**The One Italic Word Rule.** A big heading may set one word or short phrase in Literata italic (500, tracking -0.02em) in `--primary-ink`, like "home row" or "back". One per heading, never a whole sentence.

**The Serif Means Reading Rule.** Literata upright is only for post content. UI text, cards and forms use Geist.

## Layout

The page uses one shared container: max width 72rem, side gutters of 20px on phones, 32px from `sm`, and 48px from `lg` (added outside the 72rem with `box-content`, so the logo, headline and posts line up on one left edge). Headers are 80px tall with the logo on the left and the colourway keys pushed to the right.

The home hero is a two-column grid from `lg`: the headline takes the flexible column and a 20rem column on the right holds the lede and the call to action, aligned to the bottom. On smaller screens they stack. The post plate begins right after.

Post keys sit in a grid on the plate: 1 column on phones, 2 from `sm`, 3 from `lg`, with 12px gaps (16px from `sm`). The featured key spans 2 columns from `sm`. The plate's own inset matches the gap (12px, 16px from `sm`), so the plate border looks as wide as the spaces between keys.

A post page narrows to a 48rem column, and the post body itself caps at 68ch. Sign-in and sign-up are a single centred 28rem column.

Spacing is generous between sections (56–96px above the hero headline, 64px before comments and the footer) and tight inside a plate.

## Elevation & Depth

Depth is physical, not atmospheric. Keys get their height from an **inset bottom edge**: a solid band of darker colour along the inside bottom of the key. Pressing a key thins that band and nudges the key down, like a real key travelling. There are no soft drop shadows on cards. Grouping depth comes from tone: light keys on a dark plate.

### Shadow Vocabulary
- **Button edge** (`box-shadow: inset 0 -3px 0 rgb(0 0 0 / 0.22)` on accent buttons, `inset 0 -3px 0 var(--key-edge)` on light buttons): resting state of a keycap button. Pressed: the same with `-1px`, plus a 1px move down.
- **Post key edge** (`box-shadow: inset 0 -6px 0 var(--key-edge)`, accent key `inset 0 -6px 0 rgb(0 0 0 / 0.2)`): post keys and the sign-in form key. Pressed: `-2px` and a 4px move down. Hover lifts the key 2px.
- **Comment key edge** (`box-shadow: inset 0 -5px 0 var(--key-edge)`): comment cards on the plate.
- **Colourway key** (`box-shadow: inset 0 -3px 0 rgb(0 0 0 / 0.25), 0 1px 2px rgb(0 0 0 / 0.2)`): the small theme keys, the one place with a tiny outer shadow so they read against any ground. The active key stays pressed down with a ring around it.

### Named Rules
**The Inset Edge Rule.** Height is drawn inside the key as a bottom band, never as a blurred outer shadow. A pressed state always makes the band thinner and moves the key down.

**The Plate Rule.** A group of related keys (the post list, the comment list, a form) sits on a plate. A single key never floats on the ground by itself, except buttons.

## Shapes

Everything is a softly rounded rectangle, the shape of a keycap seen from above. Radii grow with size: 8px for the small colourway keys, 0.75rem for buttons and inputs, about 1.35rem for post and comment keys, about 1.65rem for the plate. The plate is always rounder than the keys on it. The homing bar is a fully rounded pill (3–4px tall, about 48px wide on post keys), centred near the bottom of the key.

The logo is the same idea in miniature: a keycap (rx 8 on a 32 grid) with a lighter, set-back top and a homing bar, filled with the current accent so it changes with the colourway.

## Components

### Buttons
Tactile and short: they look like keys and press like keys.
- **Shape:** gently rounded (0.75rem), 32px tall by default, 36px for `lg`, 40–44px for form submits and the hero call to action.
- **Primary:** accent fill with `--primary-foreground` text and a dark inset bottom edge. Hover brightens slightly (105%).
- **Key (outline variant):** key-top fill, 1px border, `--key-edge` inset bottom edge. Hover fills with muted. Used for "All posts" and the mobile menu button. The comment form is a key on the comments plate, always visible, with a primary "Post comment" key (no popup).
- **Ghost:** no fill until hover (muted). Used for "Log in" in the header and the delete-comment icon.
- **Focus:** border turns to the ring colour with a 3px ring at 50% opacity.

### Colourway Switcher (signature)
Four 28px keycaps (32px from `sm`) with 6px gaps, each painted in its colourway's key colour with a homing bar in a contrasting colour. The active key stays pressed down with a 2px ink ring offset from the ground. Pressing a key sets `data-theme` on `<html>` (plus the `dark` class for Midnight), saves it under `homerow-theme` in localStorage, and runs a View Transition: the new colourway grows as a circle from the centre of the pressed key over 650ms (`cubic-bezier(0.22, 1, 0.36, 1)`). With reduced motion, or without View Transition support, the switch is instant. A small script in `index.html` applies the saved colourway before the page paints, and on a first visit picks Midnight for a dark system setting, Paper otherwise.

### Post Keys (signature)
- **Corner Style:** about 1.35rem.
- **Background:** key-top with ink text; the newest post is the accent key (accent fill, `--primary-foreground` text, spans two columns from `sm`, with a homing bar near the bottom).
- **Shadow Strategy:** post key edge (see Elevation).
- **Content:** date (label), title (key title, links over the whole key), up to three lines of description, and "Read post" with an arrow that slides 4px right on hover. Minimum height 240px; 24px padding.

### Plate
- **Background:** `--plate` with `--plate-foreground` text, 12–16px inset, about 1.65rem corners.
- **Holds:** the post grid, the comment list (with its heading and "Add a comment" key inside the plate), and the sign-in / sign-up form key. Empty and loading messages sit on the plate in plate ink at 80%.

### Comment Keys
Light keys on the comments plate: about 1.35rem corners, a 5px key edge, the author's name as title, the date below it, and a ghost delete icon that turns error-red on hover.

### Inputs / Fields
- **Style:** transparent fill, 1px `--input` stroke, 0.75rem corners, 40px tall in forms. Text is 1rem on phones and 0.875rem from `md`.
- **Focus:** stroke turns to the ring colour plus a 3px ring at 50%.
- **Error:** destructive stroke and a short message below in error red.

### Navigation
An 80px bar: logo and name on the left (the mark at 32px, "Homerow" in the display face at 1.5rem, bold), colourway keys on the right. From `lg` a thin vertical divider, a ghost "Log in" and a primary "Sign up" follow. Below `lg` these move into a right-side sheet opened by an outline-key menu button. The colourway keys stay visible at every size on the home page.

### Post Body
Literata reading text in a 68ch column. Links and list markers in `--primary-ink`, underlined with a 3px offset. Blockquotes are muted, italic panels with the control radius. Inline code sits on muted; code blocks sit on the plate colour with plate ink, 1.25rem padding and horizontal scroll.

## Do's and Don'ts

### Do:
- **Do** draw height as an inset bottom edge (`inset 0 -3px` for buttons, `-5px` to `-6px` for larger keys) and make it thinner on press.
- **Do** put groups of keys on a plate whose inset equals the gap between keys.
- **Do** use `--primary-ink` for any accent-coloured text and `--primary` only for fills.
- **Do** keep one accent key per group: the primary action or the newest post.
- **Do** check new work in all four colourways, including Midnight.
- **Do** keep the colourway switch instant under `prefers-reduced-motion: reduce`.

### Don't:
- **Don't** use a dark photo hero or a stock image behind the headline.
- **Don't** lay posts out as a generic grid of floating cards with soft drop shadows; they are keys on a plate.
- **Don't** hard-code hex values in components; use the role variables so every colourway works.
- **Don't** set more than one Literata italic word or phrase in a heading.
- **Don't** add a second accent colour to a colourway.
