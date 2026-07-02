## 1. Setup & dependencies

- [x] 1.1 Read `node_modules/next/dist/docs/` (app/layout, fonts, metadata) to confirm the Next 16 `next/font` + layout conventions before editing anything.
- [x] 1.2 In `package.json`, remove `cva@^0.0.0` (placeholder package) and add `class-variance-authority`; run `pnpm install` and confirm `pnpm-lock.yaml` updates.
- [x] 1.3 Add `src/lib/cn.ts` re-exporting `clsx` as `cn` (single seam; `// ponytail:` note that `tailwind-merge` can be added here later).

## 2. Design tokens & global theme (`design-tokens`)

- [x] 2.1 Port `tmp/atrios-management/tokens/colors.css` into `@theme` in `src/app/globals.css` as `--color-*` (surfaces, text ramp, borders, brand, status hues, repo accents, fills, semantic); store status/brand/repo hues as bare hex so opacity modifiers work.
- [x] 2.2 Port radii → `--radius-*` (incl. `--radius-panel` 14px, `--radius-pill` 20px) and shadows → `--shadow-*` (`shadow-panel`, `shadow-modal`, `shadow-brand`).
- [x] 2.3 Port typography/spacing tokens: `--font-sans`/`--font-mono`, weights, and any spacing/control values worth exposing as utilities.
- [x] 2.4 Add the `autopulse` and `caret` keyframes and easing/duration tokens to `globals.css`.
- [x] 2.5 Replace the boilerplate `:root`/body theme with the Átrios canvas radial-gradient background and base body typography (Inter, body text color); remove the default light theme.
- [ ] 2.6 In `src/app/layout.tsx`, swap Geist for `next/font/google` `Inter` (expose `--font-sans`, include the 450 weight), wire the mono stack, update `metadata`, and set base `<body>` classes.
- [x] 2.7 Verify: `pnpm dev` boots, the app renders on the dark canvas with Inter, and a scratch element using `bg-status-done/10 border-status-done/25 text-status-done` shows the tinted wash (validates opacity modifiers).

## 3. Leaf primitives (`ui-components`)

- [x] 3.1 `src/components/ui/button.tsx` — `cva` over `variant` (primary/secondary/ghost/dashed) × `size` (sm/md/lg), `icon` slot, `disabled`; forwards native button props + `className`.
- [x] 3.2 `icon-button.tsx` — square, `tinted` option, numeric `size` via inline width/height (allowed dynamic escape hatch), rest utility-classed.
- [x] 3.3 `avatar.tsx` — initials on the violet-blue gradient, numeric `size` (inline w/h/font-size), initials scaled ~0.42×.
- [x] 3.4 `status-pill.tsx` — `cva` over `hue` (todo/progress/review/test/done/archived); leading dot; `tinted` (wash+line via `/NN` modifiers) and `glow` options.
- [x] 3.5 `repo-chip.tsx` — colored leading dot keyed by `name` (web/api/mobile) with `color` override.
- [x] 3.6 `badge.tsx` — `cva` over `tone` (primary/neutral/success); `mono`, `pulse` (autopulse), `icon` options.
- [x] 3.7 `input.tsx` — `cva` over `size` (sm/md/lg); `mono` mode; real `focus:` border + a `focused` prop override; forwards native input props.
- [x] 3.8 `segmented-control.tsx` — controlled `options`/`value`/`onChange`, active-segment highlight via `clsx` (`"use client"`).
- [x] 3.9 `sidebar-item.tsx` — `label`, optional status `color` dot, `active` state (fill + brighter/heavier text) via `clsx`.

## 4. Composed primitives (`ui-components`)

- [x] 4.1 `task-card.tsx` — mono id, optional `novo`/`auto`(pulse)/PR badges, title, optional `RepoChip`; hover lift via CSS `hover:` (no `useState`); composes `Badge` + `RepoChip`.
- [x] 4.2 `stepper.tsx` — `steps` + `current`; done (filled+connected) / current (enlarged+glow+date) / future (hollow) node states via enumerated classes.
- [x] 4.3 `src/components/ui/index.ts` — barrel export all 11 primitives.

## 5. Design system page (`design-system-page`)

- [x] 5.1 Create `src/app/design-system/page.tsx` (`"use client"`) with a section layout on the Átrios canvas.
- [x] 5.2 Foundations section: color swatches (surfaces, text ramp, status spectrum, repo accents, brand), type scale, spacing scale, effects (radii/shadows) — reading token utilities.
- [x] 5.3 Components gallery grouped by category: all Button variants×sizes; StatusPill hues; Badge tones (incl. pulse); Input states (incl. mono/focus); populated Stepper; sample TaskCards (novo/auto/PR/repo); live SegmentedControl; SidebarItems; Avatar/IconButton/RepoChip — all with pt-BR sample content (Pórtico, POR-27, etc.).

## 6. Verify

- [x] 6.1 Spot-check `/design-system` against `tmp/atrios-management/Átrios Design System.dc.html` and the `components/**/*.card.html` specimens; adjust to match (the `.dc.html` mockup wins ties).
- [x] 6.2 Run `pnpm lint` (`biome check`) and `pnpm build`; fix type/lint errors.
