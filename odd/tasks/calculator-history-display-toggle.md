# Formatted and Toggleable Calculator History

## Objective
Format numeric operands in history using the current display precision and add an animated, accessible show/hide control for the history list.

## Problem and rationale
History results already use `displayDecimalPlaces`, but each saved expression is currently an opaque string containing raw operand text; chained results can therefore expose many digits in the history expression. The history should match the calculator's visible precision without changing saved values or restore behavior. The desktop History card also needs a persistent toggle so users can collapse and reveal its entries; compact screens should retain the History button and modal interaction.

## Scope
- Format numeric operands in history expressions using the current display precision, including entries saved before this change where their expression uses the known calculator-generated syntax.
- Keep raw operands and numeric results available for exact restore and calculation; never round persisted calculation values.
- Add an animated Show/Hide control in the desktop History card header; retain the heading/control while the entry list collapses and expands.
- Keep the compact-screen History button and modal; animate the history reveal/dismissal and respect `prefers-reduced-motion`.
- Expose toggle/dialog state accessibly (`aria-expanded`, control association, dialog close semantics).
- Update README with history formatting and toggle behavior.

## Constraints
- Do not add dependencies or a DOM/browser test dependency.
- Preserve old persisted `{ expression, result }` records; do not discard history or reduce precision during any schema extension.
- Display formatting follows the current `displayDecimalPlaces` setting, including for previously saved expressions where parsing is supported.
- Preserve the established contract that actual arithmetic and restored values retain full precision.
- No commit, push, or publication was requested; leave changes uncommitted.
- TDD mode: standard checks, user-selected in the existing calculator feature configuration; Vitest runner is `pnpm test`.
- Run `pnpm test` and `pnpm build`.
- Implementation route: delegated direct writer on `feat/calculator-history`.

## Task

### HIST-DISPLAY-1 — Format and toggle history entries
- [x] Render history operand text at the configured display precision, while retaining/restoring raw numeric values; retain compatibility with earlier history entries.
- [x] Add a desktop Show/Hide control that animates the list while leaving the control available; animate the compact modal interaction and honor reduced-motion preferences.
- [x] Keep toggle and dialog semantics accessible and preserve existing responsive layout and keyboard behavior.
- [x] Add focused tests for display formatting, legacy/current stored entries, and precision preservation; update README and run standard checks.
- Status: complete.

Acceptance: a history operation involving a computed value displays its operands and result rounded according to current settings; changing display settings changes the shown history text, not the stored/restored values. Old saved expressions remain visible and are reformatted when their syntax is recognized. The desktop History card can be collapsed/expanded with an animated list and an accessible control; compact-screen History continues through its modal and the reveal/dismissal is animated unless reduced motion is requested. No history persistence or restore behavior regresses.
Checks: `pnpm test`, `pnpm build`, static review of legacy compatibility, display-vs-stored precision, toggle state, reduced-motion styles, and dialog close behavior. Browser rendering, motion, focus, and click behavior remain unverified without a UI harness.

## Progress and evidence
- Existing branch: `feat/calculator-history`; previous history and responsive/modal features are completed locally but remain uncommitted.
- Read-only exploration delegated to `gentle-ai-explore`; it confirmed the current record stores an opaque expression string plus a full-precision numeric result, and result display re-formats dynamically with the current setting.
- Product decision: desktop card gets an in-card show/hide toggle; compact History button continues to open the modal. Format old and new history expressions for display without changing precise stored results.
- Motion convention: respect `prefers-reduced-motion`; current app only uses a reduced-motion-gated logo animation.
- TDD mode and runner reconciled from existing calculator feature configuration: standard checks (user-selected), `pnpm test` (Vitest).
- Forecast: approximately 140 authored changed lines; delivery strategy `ask-on-risk`.
- HIST-DISPLAY-1: complete. The writer observed RED with 3 focused failures before adding the formatter, then GREEN with 11 and finally 13 focused history tests passing. Full `pnpm test` passed (6 files, 120 tests), `pnpm build` passed, and scoped `git diff --check` passed. Recognized generated binary/unary expressions are formatted dynamically, including scientific notation; unknown/custom expression text remains unchanged. Data retains original expressions and full-precision results. Independent verification found no blocking static issues; it confirmed legacy/current records, accessibility state, reduced-motion styles, and precision behavior. Parent spot-check: `pnpm test` passed (6 files, 120 tests); `git diff --check` passed. Native assessment was unassessable/high because task/history files remain untracked, so separate risk-gated verification was completed. Browser rendering, motion, focus, dialog and keyboard interactions remain unverified without a UI harness. Build produced no unexpected tracked `dist/` changes.
- Commit evidence: none; no commit was authorized.

## Next step
Implementation and available checks are complete on `feat/calculator-history`; all changes remain uncommitted. Browser-level verification is unavailable without a UI harness.
