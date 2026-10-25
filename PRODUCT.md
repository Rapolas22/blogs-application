# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Owner (admin):** the project owner, who runs the blog, manages the other writers and publishes posts.
- **Writers:** a small, known group (a handful of people, not an open public sign-up) who write and manage posts through the admin panel.

All of them are writing a dev/tech blog, mostly long-form posts that include code samples. They work in a desktop browser.

## Product Purpose

An admin panel and API for a dev/tech blog. The owner and a few writers use it to draft, edit and publish posts. Success means a writer can go from an idea to a published post reliably and can always see what is a draft and what is live.

This is also a learning project. The owner is a CS student learning full-stack development and writes the code themselves. They need to be able to understand and maintain every part of it.

## Operating Context

- The admin panel (`admin/`) is a React SPA behind a login. It talks to an Express API (`api/`) through `/api/*`.
- Posts are written in a TinyMCE rich-text editor. Code samples (`codesample`) are a core part of the content.
- A post has a title, a short description, a thumbnail image URL, an SEO name, rich-text content, an author, a created date, and a draft/published state.
- A **public reader-facing blog site is planned**. The owner will design and build it personally, so it is out of scope for assisted design work unless the owner asks. It will read posts from this API.

## Capabilities and Constraints

- **Auth:** email and password (bcrypt). The session is a JWT in an httpOnly cookie, valid for 3 days. Every API route checks it on the server. The React route guard only mirrors what the server decides.
- **Roles today:** `USER` and `ADMIN`. Only `ADMIN` can get into the admin panel. Anyone can sign up publicly, but new accounts get `USER` and can't get in.
- **Language:** the interface is in **English**. Existing Lithuanian strings (sign-in and sign-up error messages) are leftovers and should be translated.
- **Open decisions:**
  - Writer permissions. A `WRITER` role (or similar) is needed so writers can use the panel, and it hasn't been designed yet.
  - The publishing workflow. It isn't decided whether writers publish their own posts or an admin has to approve them first.
  - The reader site's relationship to drafts. The API must never expose unpublished posts publicly.

## Brand Commitments

None yet. There is no product name: "Blog Page" in the admin header is a placeholder.

## Evidence on Hand

No real posts, authors, readers or metrics exist yet. Future work must not make up example content and present it as real (testimonials, reader counts, author bios).

## Product Principles

1. **Writing is the core job.** Post creation and editing, code samples included, comes before everything else in the panel.
2. **Status is never ambiguous.** A writer should always know whether a post is a draft or published, and what an action will change before they take it.
3. **The server decides permissions.** The UI reflects what the API allows. It never stands in for the API's checks.
4. **Small-team scale.** Design for a handful of known people doing real work, not for anonymous public scale.
5. **Understandable over clever.** Prefer patterns and code the owner can read, explain and change themselves.
