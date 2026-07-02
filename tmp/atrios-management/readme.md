# Átrios Design System

The design language of **Átrios Management** — an internal tool for tracking Átrios's software products. It is a dark, dense, keyboard-first workspace in the lineage of Linear: near-black surfaces, hairline borders, tight typography, and **color used as the language of status**.

> Scope note: "Átrios" and the product names here (Pórtico, Cortina, Ábaco, Verso, Peristilo, Colunata, Frontão) are the example subject matter this system was extracted from. Treat them as sample content, not facts about any real company.

## Sources
- `Átrios Management.dc.html` (project root) — the living product mockup this system was distilled from: login, product list, create-product modal, card detail panel, quick-create flow, and the product page with a lifecycle stepper + Kanban/list board. **When in doubt, that file wins.**

---

## Content fundamentals

**Language: Brazilian Portuguese.** All product copy is pt-BR. UI verbs are imperative and terse: "Novo produto", "Criar", "Cancelar", "Adicionar repositório", "Novo card".

**Tone.** Neutral, functional, engineer-facing. No marketing voice, no exclamation, no emoji. Labels are nouns ("Descrição", "Repositórios", "Etapa", "Branch sugerida", "Pull Request"); helper text is a quiet single sentence in a faint gray ("Sugerido a partir do nome · usado nos ids", "Vinculado automaticamente. Você também pode colar um link manualmente.").

**Casing.** Sentence case for buttons and body. UPPERCASE only for tiny section eyebrows ("DESCRIÇÃO", "REPOSITÓRIOS", "ETAPA") at 11px / 600 / 0.05em tracking. Product names are proper-cased (Pórtico); product codes are 3-letter uppercase mono (POR, COR, ABA).

**Numbers & meta.** Counts sit next to titles in a faint gray ("Produtos 7", "To Do 3"). Relative time is lowercase pt-BR ("há 2h", "há 20min", "ontem", "há 3 dias"). Ids are `CODE-N` in mono (POR-27). Middots (` · `) separate inline meta.

**Density over explanation.** The UI trusts the reader — few tooltips, no onboarding chrome, information packed tight. Don't pad with helper copy.

---

## Visual foundations

**Canvas.** A near-black radial gradient, cool-blue biased: `radial-gradient(120% 90% at 30% -10%, #0d1018, #06070a 55%, #050506)`. Panels/windows sit on top as slightly lighter slabs (`#08090a`) floated with a deep long-throw shadow `0 30px 80px -24px rgba(0,0,0,.75)`.

**Surfaces** step up in tiny increments: sidebar `#0b0c0e` → panel `#08090a` → inset field `#0a0b0d` → card/modal `#111214` → raised `#17181b`. Cards hover to `#141518`.

**Borders are hairlines** — white at very low alpha (0.045 → 0.12), never a solid gray line. Hover raises border alpha to ~0.15–0.20 rather than changing hue.

**Color = status.** Neutral gray (To Do / Descoberta), amber `#e2b13c` (Em Progresso / Desenvolvimento), blue `#5e9eff` (Em Revisão / Definição), violet `#bb9af7` (Testes), green `#4cb782` (Concluído / Em Produção), dim gray `#6b6f76` (Descontinuado). Repos have their own accents (web blue, api amber, mobile violet). The brand indigo `#5e6ad2` is reserved for primary actions, selection, and automation ("auto") — it is NOT a status.

**Typography.** Inter for everything UI (weights 400/450/500/600/700 — note the 450 "book" weight for nav rest state). Monospace (`ui-monospace, SF Mono, Menlo`) for ids, codes, branch names, repo paths. Display sizes carry tight tracking (-0.02em at 25px, -0.01em at 19px). Line-heights are dense: 1.3 headings, 1.35 card titles, 1.6 descriptions.

**Status dots** are the workhorse motif: a 7–11px circle in the status color, sometimes with a colored glow (`0 0 12px <color>`) when live/current. They lead pills, sidebar rows, column headers, repo chips, and stepper nodes.

**Radii.** 4px (mono id chips) → 6–8px (buttons, fields, cards) → 14px (panels/modals) → 20px (status pills) → 50% (dots, avatars). Nothing is fully sharp; nothing is very round except pills and dots.

**Elevation.** Two shadow tiers: panel (`0 30px 80px -24px rgba(0,0,0,.75)`) for windows, modal (`0 24px 60px -12px rgba(0,0,0,.7)`) for dialogs. Brand glow (`0 4px 14px rgba(94,106,210,.45)`) on the logo mark and the "new card" highlight. Behind modals the app dims with a `rgba(4,5,7,.62)` scrim + 1px blur.

**Motion.** Restrained. `cubic-bezier(.4,0,.2,1)`, ~0.18s. Two named loops only: `autopulse` (a breathing indigo ring on automation badges, 2.6s) and `caret` (blinking text caret). No bounces, no slide-ins.

**Hover / press.** Hover = raise border/text alpha or shift to the next-lighter surface (never a hue change). Primary button hover lightens `#5e6ad2 → #6b76e0`. Destructive affordances (remove ×) shift stroke to `#e06c6c` on hover. No scale-on-press.

**Layout.** Fixed 216px sidebar, 53px top bar, 44px breadcrumb strip. Board columns are equal `flex:1`. Spacing is a dense 2px-based rhythm delivered through flex/grid `gap`, not margins. Content maxes ~1360px.

---

## Iconography

**Inline stroke SVGs, ~1.4–1.7 stroke width, `currentColor`.** Icons are hand-inlined 16×16 viewBox line icons (grid, chevron, caret, external-link, plus, close, kanban/list, copy, git-graph) — a Lucide/Feather-family stroke aesthetic. There is no icon font and no emoji anywhere. The only "brand illustration" is the logo mark: a small arch/portico glyph (`M2 10.2V6a4 4 0 0 1 8 0v4.2` + a baseline) on the indigo gradient tile — the Átrios "átrio/pórtico" motif. GitHub's mark appears on the auth button.

> The component cards inline the icons they need. If you adopt a CDN set, match the stroke weight (~1.5) and the rounded line-caps.

---

## Index / manifest

- `styles.css` — global entry (imports fonts + all tokens). **Consumers link this.**
- `tokens/` — `fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `effects.css`.
- `guidelines/` — foundation specimen cards (Colors, Type, Spacing, Effects).
- `components/` — reusable primitives:
  - `core/` — `Button`, `IconButton`, `Avatar`
  - `status/` — `StatusPill`, `RepoChip`, `Badge`
  - `data/` — `TaskCard`, `Stepper`
  - `forms/` — `Input`, `SegmentedControl`
  - `navigation/` — `SidebarItem`
- `ui_kits/atrios-management/` — the product page, composed from the primitives.
- `SKILL.md` — portable skill wrapper.

## Caveats
- **Inter is loaded from the Google Fonts CDN**, not self-hosted binaries. Drop `.woff2` files into `assets/fonts` and swap the import in `tokens/fonts.css` if you need offline use.
- Monospace uses the **system** stack (SF Mono / Menlo / Consolas) — no bundled mono webfont.
