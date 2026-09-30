# Calculator Result Display Precision

## Objective
Show the configured rounded precision in the calculator expression after evaluation without reducing the internal numeric precision used for chained calculations.

## Problem and rationale
`formatResult` already rounds the result display to the configured maximum decimal places, but a successful evaluation also stores the full-precision number string in `n1`, which the expression display renders raw. For values such as `sqrt(99)`, the result line says `9.95` while the remaining expression still shows many fractional digits. Keep the state precise and format only the expression view when it represents the just-evaluated result.

## Scope
- Format the visible post-evaluation operand using `displayDecimalPlaces` so it agrees with the result line.
- Preserve full precision in `n1` and all subsequent calculations.
- Do not round or rewrite manually entered operand strings or operands in a pending expression.
- Add focused tests for display formatting and preservation of full-precision chained arithmetic.
- Do not add UI testing dependencies; the current harness has no DOM/browser test environment.

## Constraints
- TDD mode: standard checks (user-selected in the existing calculator feature configuration); Vitest runner is `pnpm test`.
- Run `pnpm test` and `pnpm build`.
- Preserve existing uncommitted-independent repository state; the starting worktree was clean on `main`.
- Feature branch: `fix/calculator-result-display`.
- Do not commit; the user did not request a commit.

## Tasks

### DISP-1 — Format evaluated operand in the expression view
- [x] Show the configured rounded representation of the current evaluated result in the expression area.
- [x] Preserve full-precision calculator state for chained operations and preserve manually entered/pending operands.
- [x] Add regression tests and run the standard checks.

Acceptance: after evaluating `sqrt(99)` with three display decimals, both the result and remaining expression display `9.95`; internally retained result precision remains unrounded for any subsequent calculation. Other manually entered or pending-expression values retain current display behavior.
Checks: `pnpm test`, `pnpm build`, static inspection that only display output is formatted and numeric state remains unchanged. Browser-level rendering is unverified because no DOM/browser harness is configured.
Route: delegated direct writer; implementation and helper/test touch multiple non-trivial files. Evidence: writer and independent verifier passed `pnpm test` (5 files, 105 tests) and `pnpm build` (46 modules). Static inspection confirmed display-only formatting and full-precision state preservation. Browser rendering remains unverified because no DOM/browser harness is configured.

## Progress and evidence
- Read-only inspection confirmed successful evaluation stores the raw `String(evaluation.value)` in `n1`, while the top result line uses `formatResult`; the expression line renders `n1` directly.
- Existing full-precision chained-arithmetic tests must continue passing. The default display precision is three places.
- Writer added `formatExpressionOperand` and an evaluated-value marker so only the post-evaluation expression operand is formatted. Manual input clears the marker; pending expressions remain raw; calculation state still stores full precision.
- Writer checks: `pnpm test` passed (5 files, 105 tests); `pnpm build` passed (46 modules). Parent `git diff --check` passed. Existing untracked ODD task file was preserved.
- Native risk assessment was unassessable because the untracked task file prevents candidate classification; the fail-closed high-risk plan was satisfied by independent verification. Read-only review inspect found no existing lineage; no review was started because no work-unit commit candidate exists and no commit was authorized.
- Independent verifier confirmed `n1` retains `String(evaluation.value)`, expression formatting is applied only for evaluated values, manual input clears the marker, pending operands remain unchanged, and configurable precision flows to both display formatters.
- `pnpm test` passed independently (5 files, 105 tests); `pnpm build` passed independently (46 modules). Parent `git diff --check` passed; no unrelated generated diffs appeared.
- Browser-level rendering remains unverified because no DOM/browser harness is configured.

## Next step
Implementation and available verification are complete. Changes remain uncommitted on `fix/calculator-result-display`; no further action is authorized unless requested.
