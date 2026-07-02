## ADDED Requirements

### Requirement: Design system route
The system SHALL provide a `/design-system` page (`src/app/design-system/page.tsx`) that serves as the app-native equivalent of the Claude Design `guidelines/` + `components/` reference, rendered on the Átrios canvas.

#### Scenario: Route renders
- **WHEN** a user navigates to `/design-system`
- **THEN** the page renders successfully on the Átrios dark canvas with Inter typography

### Requirement: Foundation specimens
The page SHALL document the token foundations: color swatches (surfaces, text ramp, status hues, repo accents, brand), the type scale, the spacing scale, and the effect samples (radii, shadows), reading their values from the ported Tailwind utilities.

#### Scenario: Color specimen shows status spectrum
- **WHEN** viewing the colors section
- **THEN** the six workflow status hues and the three repo accents are shown as labeled swatches using the token utilities

### Requirement: Component gallery
The page SHALL render every primitive from the `ui-components` capability in its meaningful variants (e.g. all Button variants × sizes, all StatusPill hues, all Badge tones, Input states, a populated Stepper, sample TaskCards, a SegmentedControl, SidebarItems), grouped by the source categories (core, status, data, forms, navigation).

#### Scenario: All button variants shown
- **WHEN** viewing the components section
- **THEN** primary, secondary, ghost, and dashed buttons are each shown in sm/md/lg

#### Scenario: Every primitive is represented
- **WHEN** viewing the components section
- **THEN** each of the 11 primitives appears at least once with pt-BR sample content matching the Átrios domain
