---
name: atrios-design
description: Use this skill to generate well-branded interfaces and assets for Átrios Management — a dark, dense, Linear-inspired internal product-tracking tool — either for production or throwaway prototypes/mocks. Contains essential design guidelines, color + type tokens, fonts, and UI kit components for prototyping.
user-invocable: true
---

Read `readme.md` in this skill for the full design language (content fundamentals, visual foundations, iconography), then explore the other files.

- Tokens live in `tokens/*.css`; link `styles.css` to pull them all in. Everything is a CSS custom property under the `--atr-*` namespace.
- Reusable React primitives are in `components/<group>/` (each has a `.jsx`, a `.d.ts` props contract, and a `.prompt.md` usage note).
- `ui_kits/atrios-management/` shows the primitives composed into the real product page.
- Foundation specimens are in `guidelines/`.

If creating visual artifacts (slides, mocks, throwaway prototypes), copy assets out and produce static HTML the user can view. If working on production code, read the rules here and reference the components to become an expert in designing with this brand.

If invoked without other guidance, ask what the user wants to build, ask a few questions, and act as an expert designer who outputs HTML artifacts _or_ production code depending on the need.

Core rules to never break: near-black cool canvas; hairline (low-alpha white) borders, never solid gray; color is reserved for **status** (indigo `#5E6AD2` is for primary actions/selection/automation, not a status); Inter + monospace-for-ids; status dots everywhere; restrained motion; no emoji.
