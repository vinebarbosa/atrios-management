# Átrios Management — UI kit

A high-fidelity recreation of the flagship internal tool: a Linear-inspired, dark, dense product tracker. Software products (Pórtico, Cortina, Ábaco…) each have a page with a **collapsible context panel** (description · linked repositories · lifecycle stepper) above a **Kanban / list board** of task cards.

## Screens
- `index.html` — **Product page.** Sidebar + breadcrumb + product header (name, `POR` code, status pill, Contexto toggle) + collapsible context (description, repo links, product-stage `Stepper`) + board of `TaskCard`s with a `SegmentedControl` view switch. Interactive: toggle the context panel, switch Kanban/Lista.

## Composed from
`SidebarItem`, `Avatar`, `Button`, `StatusPill`, `RepoChip`, `Badge`, `TaskCard`, `Stepper`, `SegmentedControl` — all from this design system's `components/`. No component logic is re-implemented here; the screen is pure composition.

## Source
Recreated from `Átrios Management.dc.html` at the project root (section 07 — the product page). That file is the living source of truth for the product's screens (login, product list, create-product modal, card panel, board variants).
