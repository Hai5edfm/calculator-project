# Responsive Calculator History and Chained Display

## Objective
Present calculator history as a desktop side card and a mobile dialog, and keep computed operands visually rounded while preserving full-precision arithmetic.

## Problem and rationale
History currently appears beneath the keypad inside the Calculator card. The requested desktop layout calls for the shortcut map on the left, calculator in the center, and a separate History card on the right; on narrow layouts History should be opened from a button in a modal. Separately, the expression display exposes a computed operand's raw precision as soon as a new operation is selected, even though the result display stays rounded. The app's established precision contract is to round display only and retain full precision for calculations.

## Scope
- Render the keyboard shortcut map, calculator, and History as distinct desktop cards, with History to the calculator's right.
- At responsive widths where three cards do not fit, replace the History card with a History button that opens an accessible modal containing the entries and their restore actions.
- Preserve the responsive keyboard shortcut map below the calculator on narrow layouts.
- Close the modal after restoring an entry; keep an accessible close action and sensible focus behavior.
- Keep a computed first operand formatted to the configured display precision while an operation/second operand is pending; clear that display state when the first operand is edited or reset.
- Preserve the exact full-precision stored operand for all actual chained calculations.
- Update README to describe desktop and narrow-screen history access.

## Constraints
- Do not add dependencies or a DOM/browser test dependency.
- Use the existing responsive layout conventions and select breakpoints based on avoiding three-card overflow.
- Preserve the current calculation-precision contract: formatting affects display only; arithmetic uses the full-precision value.
- No commit, push, or publication was requested; leave changes uncommitted.
- TDD mode: standard checks, user-selected in the existing calculator feature configuration; Vitest runner is `pnpm test`.
- Run `pnpm test` and `pnpm build`.
- Implementation route: delegated direct, one bounded writer for the multi-file change.
- Continue on the existing feature branch `feat/calculator-history`; its history implementation is already present as uncommitted parent-owned work.

## Task

### HIST-UX-1 — Align history layout and computed-result display
- [x] Add a separate right-side desktop History card and responsive narrow-screen History button/modal with restore and close actions.
- [x] Preserve the keyboard shortcut map below the calculator on narrow layouts and keep dialog/keyboard interaction accessible.
- [x] Keep computed first-operand display formatting through operator selection and second-operand editing, without changing arithmetic precision; add focused regression coverage where supported by the existing test harness.
- [x] Update README and run the standard checks.
- Status: complete.

Acceptance: wide layouts show three distinct cards with History to the calculator's right; compact layouts show a History button whose modal lists the same restorable entries while the shortcut map remains below the calculator. After 99 ÷ 7 at two displayed decimals, selecting + continues to display 14.14 as the first operand while an ensuing calculation still uses the exact full-precision result internally. Selecting a modal history entry restores its saved full-precision result and closes the modal. Storage/history behavior from the prior feature remains unchanged.
Checks: `pnpm test`, `pnpm build`, static review of layout breakpoints and computed-operand state transitions. Browser rendering, focus, and actual click/keyboard interactions remain unverified if no compatible harness is available.

## Progress and evidence
- Existing feature branch: `feat/calculator-history`; prior history implementation is present in the worktree and remains uncommitted.
- Exploration delegated to `gentle-ai-explore`; it mapped `src/containers/Calculator/index.jsx`, `src/styles/containers/Calculator/index.css`, `src/App.css`, and `src/pages/home/index.jsx`, and traced the precision bug to both operator handlers clearing `evaluatedOperand`.
- Accepted precision behavior: keep full precision for arithmetic and keep the rounded representation in the expression display while the computed first operand remains unedited. This matches the existing README contract.
- Existing narrow layout breakpoint is 820px; three-card layout needs a responsive cutoff determined by the writer from available card widths.
- TDD mode and runner reconciled from existing calculator feature configuration: standard checks (user-selected), `pnpm test` (Vitest).
- Route: delegated direct writer; UI layout, state behavior, tests, styles, and README span multiple non-trivial files.
- Forecast: approximately 160 authored changed lines; delivery strategy `ask-on-risk`.
- HIST-UX-1: complete. Writer observed RED (2 new failures; 113 existing tests passed), then GREEN (all 115 passed) after adding the display-state helper and regression cases. Writer `pnpm build` passed. Independent verifier confirmed the three-column card order, 896px breakpoint, modal/close/restore and focus logic by static inspection, keyboard suppression, and display-only rounding with full-precision arithmetic; it independently passed `pnpm test` (6 files, 115 tests) and `pnpm build`. Parent spot-check: `pnpm test` passed (6 files, 115 tests); `git diff --check` passed. Native risk assessment was unassessable/high because feature task/history files are untracked, so separate risk-gated verification was completed. Browser rendering, clicks, modal focus and keyboard behavior remain unverified because no UI harness is configured. Independent verifier did not compare persistence with its prior baseline, but static inspection confirms current use of the versioned key, newest-first cap, and numeric results.
- Commit evidence: none; no commit was authorized.

## Next step
Implementation and available checks are complete on `feat/calculator-history`; changes remain uncommitted. Browser-level verification is unavailable without a UI harness.
