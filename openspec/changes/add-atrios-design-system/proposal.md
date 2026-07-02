## Why

Claude Design produced a full Átrios design system under `tmp/atrios-management/` — tokens, guidelines, and 11 component primitives — but they exist as standalone CSS + inline-style `.jsx` demos, disconnected from the app. The app itself is still create-next-app boilerplate ("hello world", default white theme). We need the design language living inside the real project as reusable, typed React components and a page that documents them.

## What Changes

- Port the Átrios visual tokens (`tmp/atrios-management/tokens/*.css`) into the app's Tailwind v4 `@theme` so colors, radii, shadows, fonts, and motion become first-class utility classes (`bg-surface-card`, `text-hi`, `border-subtle`, `rounded-panel`, `shadow-panel`, …).
- Replace the boilerplate `globals.css` theme and Geist fonts with the Átrios canvas gradient, Inter, and the mono stack.
- Recreate all 11 primitives as typed `.tsx` components using **Tailwind classes**, with **cva** for variant-driven ones (Button, StatusPill, Badge, Input) and **clsx** for conditional state (TaskCard, SidebarItem, SegmentedControl). The source `.jsx` uses inline styles + CSS vars; the port swaps those for utility classes.
- Add a `/design-system` showcase page that renders the foundation specimens (color, type, spacing, effects) and every component in all its variants — the app-native equivalent of `guidelines/` + `components/`.
- **BREAKING** (dependency fix): `package.json` pins `cva@^0.0.0`, which resolves to an empty placeholder package (author "zce"), not a variant library. Replace it with `class-variance-authority`.

## Capabilities

### New Capabilities
- `design-tokens`: Átrios color/typography/spacing/effect/motion tokens exposed as Tailwind v4 theme utilities and the global app canvas + typography baseline.
- `ui-components`: The typed React primitive library (Button, IconButton, Avatar, StatusPill, RepoChip, Badge, TaskCard, Stepper, Input, SegmentedControl, SidebarItem) built on the tokens with Tailwind + clsx + cva.
- `design-system-page`: A `/design-system` route documenting the tokens and demonstrating every component variant.

### Modified Capabilities
<!-- None — no existing specs in openspec/specs/. -->

## Impact

- **New code**: `src/components/ui/*` (11 components + barrel), `src/app/design-system/page.tsx`, optional `src/lib/cn.ts` clsx helper.
- **Modified**: `src/app/globals.css` (token `@theme` + canvas), `src/app/layout.tsx` (Inter/mono fonts, base body classes), `package.json` (swap `cva` → `class-variance-authority`).
- **Dependencies**: remove placeholder `cva@^0.0.0`; add `class-variance-authority`. `clsx@^2.1.1` and `tailwindcss@^4` already present.
- **Reference only** (not shipped): `tmp/atrios-management/` remains the source of truth for visual fidelity.
- **Constraint**: this is a modified Next.js 16 — consult `node_modules/next/dist/docs/` before touching app/layout/font conventions.
