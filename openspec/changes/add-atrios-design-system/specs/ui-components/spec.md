## ADDED Requirements

### Requirement: Component library conventions
Every primitive SHALL be a typed React component under `src/components/ui/`, styled with Tailwind utility classes over the design tokens (no inline `style` objects except for genuinely dynamic values), compose class names with `clsx`, and express enumerated variants with `cva` exposing typed variant props. Each SHALL forward native element props and be exported from a barrel (`src/components/ui/index.ts`).

#### Scenario: Variant prop is typed
- **WHEN** a consumer passes an invalid variant value to a component
- **THEN** TypeScript reports a type error at compile time

#### Scenario: Native props forwarded
- **WHEN** a consumer passes `className` or a standard DOM attribute (e.g. `aria-label`, `onClick`)
- **THEN** the component merges/forwards it onto the underlying element

### Requirement: Button
The system SHALL provide a `Button` with `variant` (`primary` | `secondary` | `ghost` | `dashed`), `size` (`sm` | `md` | `lg`), an optional leading `icon`, and a `disabled` state, matching the Átrios control heights (28/30/34px) and radius.

#### Scenario: Primary vs secondary
- **WHEN** rendered with `variant="primary"` vs `variant="secondary"`
- **THEN** primary is the indigo fill with white text and secondary is transparent with a hairline field border and muted text

#### Scenario: Disabled
- **WHEN** rendered with `disabled`
- **THEN** it is non-interactive and reduced to ~45% opacity

### Requirement: IconButton
The system SHALL provide a square `IconButton` for quiet icon affordances (close, copy, add, row actions) with an optional `tinted` background and a configurable size.

#### Scenario: Tinted background
- **WHEN** rendered with `tinted`
- **THEN** it shows the subtle white-wash fill; otherwise the background is transparent

### Requirement: Avatar
The system SHALL provide an `Avatar` rendering user initials on the violet-blue diagonal gradient, with a configurable size and initials scaled proportionally.

#### Scenario: Renders initials
- **WHEN** given `initials="MA"`
- **THEN** it renders a circular gradient tile containing "MA" in white semibold

### Requirement: StatusPill
The system SHALL provide a `StatusPill` with a leading status dot and `hue` covering the workflow spectrum (`todo` | `progress` | `review` | `test` | `done` | `archived`), plus `tinted` and `glow` options.

#### Scenario: Hue drives color
- **WHEN** rendered with `hue="done"`
- **THEN** the dot, text, and (when tinted) background/border all derive from the green status token

#### Scenario: Glow
- **WHEN** rendered with `glow`
- **THEN** the leading dot gains a colored glow to signal a live/current status

### Requirement: RepoChip
The system SHALL provide a `RepoChip` rendering a repository tag with a colored leading dot keyed by `name` (`web` blue, `api` amber, `mobile` violet) with an override `color`.

#### Scenario: Repo hue by name
- **WHEN** rendered with `name="web"`
- **THEN** the leading dot uses the web-repo blue accent

### Requirement: Badge
The system SHALL provide a `Badge` with `tone` (`primary` | `neutral` | `success`), and `mono`, `pulse`, and `icon` options, for small inline labels like "novo", "auto", and id chips.

#### Scenario: Pulse automation badge
- **WHEN** rendered with `tone="primary"` and `pulse`
- **THEN** it shows the indigo wash and runs the breathing autopulse ring

### Requirement: TaskCard
The system SHALL provide a `TaskCard` showing a mono id, optional `novo`/`auto`/PR badges, a title, and an optional repo chip, composing `Badge` and `RepoChip`, and lifting its surface + border on hover.

#### Scenario: Hover lift
- **WHEN** the pointer enters the card
- **THEN** the background steps to the card-hover surface and the border alpha rises

#### Scenario: Badges reflect flags
- **WHEN** rendered with `isNew`, `auto`, and `prNum`
- **THEN** it shows the "novo" badge, the pulsing "auto" badge, and a mono PR badge

### Requirement: Stepper
The system SHALL provide a horizontal `Stepper` over `steps` and a `current` index, rendering completed steps filled + connected, the current step enlarged with a glow (and its date), and future steps hollow.

#### Scenario: Node states by index
- **WHEN** `current=2`
- **THEN** steps 0–1 render filled and connected, step 2 renders enlarged with a glow, and later steps render hollow with muted labels

### Requirement: Input
The system SHALL provide an `Input` dark inset field with `size` (`sm` | `md` | `lg`), a `mono` mode for codes/branches, and a `focused`/focus state that draws the primary border.

#### Scenario: Focus border
- **WHEN** the field is focused
- **THEN** its border shifts to the primary indigo at reduced alpha

#### Scenario: Mono mode
- **WHEN** rendered with `mono`
- **THEN** the value renders in the mono stack with code letter-spacing

### Requirement: SegmentedControl
The system SHALL provide a controlled `SegmentedControl` over `options` (`{ value, label, icon? }`) with `value`/`onChange`, highlighting the active segment.

#### Scenario: Active segment
- **WHEN** an option's `value` equals the control's `value`
- **THEN** that segment gets the raised fill and brighter text while the others stay quiet

#### Scenario: Selection change
- **WHEN** a non-active segment is clicked
- **THEN** `onChange` is called with that segment's `value`

### Requirement: SidebarItem
The system SHALL provide a `SidebarItem` nav row with a `label`, an optional leading status `color` dot, and an `active` state giving it the selected fill and brighter/heavier text.

#### Scenario: Active state
- **WHEN** rendered with `active`
- **THEN** it shows the selected fill, the brighter text color, and the semibold weight (vs the book weight at rest)
