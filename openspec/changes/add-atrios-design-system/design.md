## Context

Claude Design delivered a complete design system under `tmp/atrios-management/` — CSS token files, HTML specimen guidelines, and 11 React primitives written as inline-style `.jsx` demos reading `--atr-*` CSS variables. The app is create-next-app boilerplate: default white `globals.css`, Geist fonts, "hello world" page. We are porting the system into the real app as typed, Tailwind-styled components plus a showcase page.

Constraints:
- **Tailwind v4** is already wired (`@import "tailwindcss"` in `globals.css`, `@tailwindcss/postcss`). Tokens should become theme utilities, not stay as raw CSS vars.
- **Modified Next.js 16** — AGENTS.md mandates reading `node_modules/next/dist/docs/` before touching app/layout/font conventions.
- **Biome** is the linter/formatter (`biome check`), not ESLint/Prettier.
- `tmp/atrios-management/Átrios Management.dc.html` is the fidelity source of truth "when in doubt".
- Copy is **pt-BR**; the mono stack is system fonts (no bundled mono webfont).

## Goals / Non-Goals

**Goals:**
- Átrios tokens as first-class Tailwind utilities (`bg-surface-card`, `text-hi`, `rounded-panel`, `shadow-panel`, `text-status-done`).
- 11 typed `.tsx` primitives styled with Tailwind + `clsx` + `cva`, faithful to the source visuals.
- A `/design-system` page documenting tokens and every component variant.
- Fix the broken `cva` dependency.

**Non-Goals:**
- Building the actual product screens (login, board, modals) — only the primitives + showcase.
- Self-hosting Inter or bundling a mono webfont (system mono stays).
- Shipping anything from `tmp/` — it stays a read-only reference.
- `tailwind-merge` / class-conflict resolution (deferred; see Risks).

## Decisions

### 1. Tokens live in Tailwind v4 `@theme`, keyed by short semantic names
Port `tokens/*.css` into `@theme` in `globals.css`, renaming `--atr-surface-card` → `--color-surface-card`, `--atr-status-done` → `--color-status-done`, `--atr-radius-2xl` → `--radius-panel`, `--atr-shadow-panel` → `--shadow-panel`, etc. Tailwind v4 auto-generates `bg-*/text-*/border-*/rounded-*/shadow-*` utilities from these.
- **Why not** keep `--atr-*` vars and use `bg-[var(--atr-surface-card)]`? Verbose, no autocomplete, and it ignores the explicit "use Tailwind classes" requirement.
- Status/brand/repo hues are stored as **bare hex** in `@theme --color-*` so Tailwind's opacity modifier works: `bg-status-done/10 border-status-done/25` replaces the source's `color-mix(... 10%, transparent)`. White-alpha borders stay as full `rgba()` tokens (no `/NN` applied to them).
- The canvas gradient and base body styles are applied directly on `body` in `globals.css` (a gradient isn't a color utility). Keyframes `autopulse`/`caret` and easing/duration tokens go in the same file.

### 2. Fonts via `next/font` (Inter), mono via system stack
Replace Geist in `layout.tsx` with `next/font/google` `Inter` exposed as `--font-sans`, wired into `@theme --font-sans`. Avoids the source's CDN `@import` (Next handles optimization/no-FOUT). Inter's variable range covers the `450` "book" weight used for nav rest state. Mono stack (`ui-monospace, 'SF Mono'…`) is a `--font-mono` theme value; no webfont.
- **Gate:** confirm the `next/font` + metadata API against `node_modules/next/dist/docs/` first (framework is modified).

### 3. `cva` for enumerated variants, `clsx` for boolean state
- **cva** (variant matrices): `Button` (variant×size), `StatusPill` (hue), `Badge` (tone), `Input` (size). `VariantProps<typeof x>` gives typed props for free.
- **clsx / plain classes** (boolean or trivial): `SegmentedControl` (active), `SidebarItem` (active), `IconButton` (tinted), `RepoChip`, `Avatar`.
- A tiny `src/lib/cn.ts` re-exports `clsx` as `cn` (single import site; upgrade to add `tailwind-merge` later without touching call sites).

### 4. Fix the dependency: `class-variance-authority`
`package.json` pins `cva@^0.0.0`, which resolves to an **empty placeholder package** ("Awesome node module", author zce) — it exports nothing. Swap it for `class-variance-authority` (stable, ships `cva` + `cx` + `VariantProps`). Update `pnpm-lock.yaml` via `pnpm install`.

### 5. Prefer CSS state over JS state
The source uses `useState` purely for hover styling (`TaskCard`) and `focused` styling (`Input`). Port these to CSS `hover:`/`focus:`/`focus-within:` utilities so those components stay server-renderable and simpler. Interactive **demos** on the page (a live `SegmentedControl`, a controlled `Input`) are the only things needing client state — mark just the showcase page `"use client"`. Keep `Input`'s `focused` prop as a specimen override in addition to the real `focus:` style.

### 6. Dynamic size is the one allowed inline-style escape hatch
`Avatar` and `IconButton` take a numeric `size`. Arbitrary pixel sizes can't be enumerated as utilities, so `width`/`height`/`fontSize` for those two are applied via inline `style` (everything else is utilities). This keeps the source's numeric API. All other components are 100% utility-classed.

### 7. Icons stay inline SVG, no icon library
Components expose `icon`/`children` slots; the showcase inlines the few stroke SVGs it needs (~1.5 stroke, `currentColor`), matching the source. No new dependency.

### File layout
```
src/
  lib/cn.ts
  components/ui/
    button.tsx  icon-button.tsx  avatar.tsx
    status-pill.tsx  repo-chip.tsx  badge.tsx
    task-card.tsx  stepper.tsx  input.tsx
    segmented-control.tsx  sidebar-item.tsx
    index.ts                      # barrel
  app/
    globals.css                   # @theme tokens + canvas + keyframes
    layout.tsx                    # Inter, base body classes
    design-system/page.tsx        # showcase ("use client")
```
Files kebab-case, exports PascalCase.

## Risks / Trade-offs

- **Tailwind v4 opacity modifiers require bare-color tokens** → store status/brand/repo hues as hex (not pre-baked rgba) so `/10`, `/25` resolve via `color-mix`. Verify a wash renders before porting all components.
- **Modified Next.js 16 font/layout API may differ from training data** → read `node_modules/next/dist/docs/` before editing `layout.tsx`; don't assume the classic `next/font` signature.
- **No `tailwind-merge`** → if a consumer passes a `className` that conflicts with a base utility, both may emit and cascade order decides. Mitigation: `cn()` is the single seam; add `tailwind-merge` there if real conflicts appear. `// ponytail:` note at the seam.
- **Visual drift from source** → spot-check the rendered `/design-system` page against `tmp/atrios-management/Átrios Design System.dc.html` and the component `.card.html` files; the `.dc.html` mockup wins ties.
- **`450` book weight** → ensure the Inter `next/font` config (or a `font-[450]` utility) actually exposes it; falls back to 400/500 if not.

## Migration Plan

1. Swap dependency (`cva` → `class-variance-authority`), `pnpm install`.
2. Port tokens + canvas + fonts (`globals.css`, `layout.tsx`) — verify the app boots on the dark canvas.
3. Add `cn` + components bottom-up (leaf primitives before `TaskCard`/`Stepper` which compose them).
4. Build `/design-system`, spot-check against `tmp/` references, run `biome check`.

**Rollback:** revert `globals.css`, `layout.tsx`, `package.json`/lockfile, and delete `src/components/ui` + `src/app/design-system`. No data or API surface is touched.

## Open Questions

- Should home (`/`) redirect to or link `/design-system`? Assumed **no** for now — dedicated route only; home boilerplate left untouched. Easy to add later.
