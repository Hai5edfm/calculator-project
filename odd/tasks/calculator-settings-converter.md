# Calculator Settings and Converter MVP

## Objective
Add a small settings menu for input/display precision and a separate unit-converter mode for temperature, length, and mass without mixing conversion logic into arithmetic.

## Problem and rationale
The user wants configurable input precision and conversions in addition to the calculator. The app already has pure helpers for input and display formatting, and `Home` is a single-page shell that currently renders only `Calculator`; these are natural extension points for shared preferences and mode selection.

## Scope
- Add an accessible Settings menu/panel with a maximum input fractional-digit setting and a separate display-decimal setting.
- Persist validated settings in browser local storage, falling back safely when data is malformed or storage is unavailable.
- Keep the default input behavior unlimited and display precision at 3 places to preserve current behavior.
- Add a distinct Converter mode for temperature, length, and mass.
- Apply the shared input fractional-digit cap and display precision to converter input/results as well as calculator displays.
- Use common MVP units: temperature °C/°F/K; length mm/cm/m/km/in/ft/mi; mass mg/g/kg/oz/lb.
- Keep converter domain logic pure, tested, and separate from ordinary calculator arithmetic.
- Update the README to describe the new settings and converter features.

## Constraints
- TDD mode: standard checks (user-selected); Vitest is the project's configured test runner.
- Preserve full numeric precision internally; input cap and display precision are independent preferences.
- Existing stored settings must be validated; invalid storage must not prevent app startup.
- No commits, pushes, or publication were explicitly requested; leave changes uncommitted.
- Implementation route: delegated direct, one bounded writer at a time for multi-file changes.
- Baseline: clean commit `c277607`; feature branch `feat/calculator-settings-converter`.

## Tasks

### PREF-1 — Add settings menu and persistence
- [x] Add a shared app-shell menu/panel for the two precision settings.
- [x] Add pure load/validate/save helpers with safe defaults and local-storage failure handling.
- [x] Add tests for defaults, valid persisted values, malformed data, and unavailable storage.

Acceptance: settings are accessible and understandable; defaults preserve existing behavior (unlimited input decimals, 3 display decimals); invalid or unavailable storage falls back without crashing.
Checks: `pnpm test`, `pnpm build`.
Evidence: settings use `{ maxInputFractionalDigits: null, displayDecimalPlaces: 3 }`; storage and UI tests pass. Writer reported test/build pass; independent verifier/parent spot-check passed `pnpm test` (3 files, 28 tests). No DOM/browser interaction check is configured.

### PREF-2 — Apply precision settings to calculator
- [x] Pass shared `{ maxInputFractionalDigits, displayDecimalPlaces }` preferences from `src/pages/home/index.jsx` into the calculator input and display helpers.
- [x] Enforce the fractional-digit cap consistently for both operands while preserving the unlimited default.
- [x] Apply configurable display decimals without changing full-precision calculation state.
- [x] Add tests for input limits, display precision, and unchanged chained arithmetic precision.

Acceptance: changing each setting has an independent effect; existing behavior remains the default; arithmetic retains full precision.
Checks: `pnpm test`, `pnpm build`.
Evidence: `pnpm test` passed (3 files, 33 tests); parent/verifier spot-check also passed. The user authorized `dist/**` solely for build output; `pnpm build` passed with Vite completing in 551 ms. Input constraints preserve existing entries when a lower cap is selected; display formatting remains separate from full-precision calculation state.

### CONV-3 — Add separate converter mode
- [x] Add mode navigation between Calculator and Converter in the page shell.
- [x] Add pure conversions for the selected temperature, length, and mass units, with validation for invalid input and incompatible units.
- [x] Add a converter UI with category, input value, source unit, and target unit controls.
- [x] Apply the shared input-digit cap and display precision settings in Converter mode.
- [x] Add conversion tests for both directions, temperature offsets, unit boundaries, and invalid input.
- [x] Update the README with available modes and unit categories.

Acceptance: calculator state and converter state remain separate; shared precision settings apply in both modes; converter results are correct for the supported unit groups; navigation and controls have accessible labels; tests and production build pass.
Checks: `pnpm test`, `pnpm build`.
Evidence: writer reported `pnpm test` passed (4 files, 76 tests) and `pnpm build` passed (45 modules). Independent verifier/parent spot-check passed all 76 tests and statically inspected conversion rules, UI labels, precision flow, and README. No DOM/browser harness was available; actual rendered navigation/focus behavior was not exercised. The category selector exposes only known categories; the pure conversion helper rejects unsupported units and mismatched categories.

## Progress and evidence
- Repository baseline inspected at `c277607`; previous calculator fixes are committed on `main` and the worktree is clean.
- Feature branch: `feat/calculator-settings-converter`.
- User approved an MVP settings menu, separate converter mode, and initial categories temperature/length/mass.
- Unit set selected for a minimal first version: °C/°F/K; mm/cm/m/km/in/ft/mi; mg/g/kg/oz/lb. Settings defaults preserve current behavior.
- PREF-1: complete; settings menu and persistence helpers use `maxInputFractionalDigits` and `displayDecimalPlaces`.
- PREF-2: complete. The user explicitly approved adding `src/pages/home/index.jsx` to the edit scope so shared settings flow into `Calculator`, and later authorized `dist/**` only for generated build output.
- CONV-3: complete. The user explicitly authorized `dist/` only for generated `pnpm build` artifacts; the writer used it only for the production build.
- Verification: `pnpm test` passed (4 files, 76 tests) and `pnpm build` passed (45 modules). Parent/verifier independently reran the test suite. Browser DOM/rendering behavior remains unverified because no harness is configured. Review inspection was read-only; no native review or receipt was started.
- Commit evidence: none; no commit was authorized.

## Next step
No further implementation is planned. Changes remain uncommitted on `feat/calculator-settings-converter`; the previous calculator work remains part of baseline commit `c277607`.
