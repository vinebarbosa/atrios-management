## ADDED Requirements

### Requirement: Átrios tokens exposed as Tailwind utilities
The system SHALL port the Átrios token set (surfaces, text ramp, borders, brand, status hues, repo accents, radii, shadows, fonts) from `tmp/atrios-management/tokens/*.css` into the app's Tailwind v4 `@theme` in `src/app/globals.css`, so each token is usable as a utility class rather than an inline CSS variable.

#### Scenario: Surface and text utilities resolve to token values
- **WHEN** a component uses `bg-surface-card`, `text-hi`, or `border-subtle`
- **THEN** the rendered element resolves to `#111214`, `#f2f2f4`, and `rgba(255,255,255,0.045)` respectively (the Átrios token values)

#### Scenario: Radius and shadow utilities resolve to token values
- **WHEN** a component uses `rounded-panel` or `shadow-panel`
- **THEN** it resolves to the `14px` radius and `0 30px 80px -24px rgba(0,0,0,.75)` elevation from the Átrios effects tokens

### Requirement: Status hues support washed tints via opacity modifiers
The status and brand color utilities SHALL support Tailwind opacity modifiers so tinted backgrounds and hairline borders (previously produced with `color-mix`) are expressed as utilities.

#### Scenario: Tinted status chip
- **WHEN** an element uses `text-status-done bg-status-done/10 border-status-done/25`
- **THEN** the text is the solid green hue and the background/border are the low-alpha wash and line used on the product header

### Requirement: Global app canvas and typography baseline
The application SHALL apply the Átrios canvas gradient background, Inter as the UI font, and the monospace stack for codes, replacing the create-next-app default theme and Geist fonts.

#### Scenario: App shell renders on the Átrios canvas
- **WHEN** any page loads
- **THEN** the document background is the cool near-black radial gradient and the base text uses Inter with the Átrios body color

#### Scenario: Mono utility applies the code stack
- **WHEN** an element uses the `font-mono` utility
- **THEN** it renders in the `ui-monospace, 'SF Mono', 'Menlo', 'Consolas'` stack (no bundled mono webfont)

### Requirement: Shared motion tokens and keyframes
The system SHALL define the Átrios easing/duration tokens and the `autopulse` and `caret` keyframes so animated affordances (automation badge, text caret) are driven by tokens.

#### Scenario: Automation pulse animation available
- **WHEN** a component opts into the automation pulse
- **THEN** the breathing indigo ring runs on a ~2.6s loop using the shared `autopulse` keyframes and the Átrios easing token
