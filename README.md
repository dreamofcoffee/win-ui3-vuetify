# WinUI 3 for Vuetify

This directory is the application's single entry point for Vuetify appearance enhancements. It keeps Vuetify's components, state management, accessibility, and interaction capabilities, while unifying the rendered result with WinUI 3 design tokens, sizing, corner radius, outlines, shadows, and motion rules.

## Setup

The application only needs to register the enhancement library:

```ts
import { installWinuiVuetify } from '@/lib/winui3-vuetify'

installWinuiVuetify(app)
```

This function installs the preconfigured Vuetify, imports all base styles, and globally registers `WinuiDateField`.

## Temporarily checking the original Vuetify look

Toggle the single master switch in `config.ts`:

```ts
export const winuiEnabled = false
```

`false` disables the WinUI 3 theme, component defaults, and enhanced styles at the same time; set it back to `true` to fully restore them.

## Directory responsibilities

- `defaults.ts`: default density, rounded corners, sizing, ripple, and overlay strategy for Vuetify controls.
- `themes.ts`: WinUI light and dark theme colors.
- `styles/_core.scss`: design tokens and base visuals, states, and motion for individual controls.
- `styles/_patterns.scss`: reusable composite patterns such as navigation, command bar, split buttons, and data toolbars.
- `styles/_date-picker.scss`: WinUI day, month, and year views for the date picker.
- `strategies/selectLocation.ts`: ComboBox flyout opens around the selected item and matches the input width.
- `components/WinuiDateField.vue`: unified date field built on Vuetify's overlay and date picker.

## Page development constraints

Pages may keep business layout, responsive grids, and business state colors, but must not override Vuetify's internal structure:

- Do not use `:deep(.v-*)` or select `.v-*` directly in business Vue files.
- Do not redeclare `rounded`, `elevation`, `density`, `ripple`, and default `size` that are already handled by the defaults.
- Keep `color` and `variant` when they express business semantics, e.g. `color="primary" variant="flat"` for primary actions and `variant="outlined"` for secondary actions.
- When new cross-page appearance rules are needed, add base rules or `winui-*` semantic classes in this library instead of patching Vuetify DOM in business pages.

## Existing semantic classes

- `winui-field--large`, `winui-control--large`: 40px large input and buttons.
- `winui-navigation-pane`, `winui-navigation-list`, `winui-navigation-footer`: NavigationView structure.
- `winui-command-bar`, `winui-user-button`: top command bar.
- `winui-component-card`: title and content spacing for control showcase cards.
- `winui-showcase*`, `winui-form-grid`, `winui-dialog-form`: responsive layout, state readouts, and form arrangement for settings/control acceptance pages.
- `winui-split-button`: split button edges and separator outline.
- `winui-data-commandbar`, `winui-data-search`: data table command bar.
- `winui-month-selector`, `winui-calendar-cell`: schedule month selector and calendar cells.
- `winui-task-select`, `winui-control-row`, `winui-number-field`: compact editing combo inside tables.
- `winui-responsive-color-picker`: color picker that adapts to narrow screens.
- `winui-login-card`: login content surface.

These classes are the library's public styling interface; pages should not depend on their internal `.v-*` implementation.
