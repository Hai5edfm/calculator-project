# Calculator Correctness and Structure

## Objective
Make the calculator reliable for ordinary keypad use, preserve numeric precision across chained operations, and keep its README and package-manager setup consistent with pnpm.

## Problem and rationale
The current keypad can throw when deleting an empty second operand, accepts malformed decimal input in the second operand, truncates intermediate arithmetic results, leaves stale results after AC, and includes an unreachable factorial branch that calls an undefined function. The README uses a nonexistent npm install script while the user has selected pnpm. A focused extraction of calculator logic will make these transitions testable without overbuilding this small app.

## Scope
- Add a lightweight Vitest workflow using pnpm.
- Remove the npm lockfile as explicitly requested; retain and update the existing pnpm lock/workspace files as needed.
- Update the README for pnpm installation, development, tests, and production build.
- Fix keypad input, clear/delete, and arithmetic correctness issues with regression tests.
- Extract deterministic calculator/input logic from the keypad UI where it supports testing and clearer responsibilities.
- Preserve the existing visual design except for small responsive adjustments if needed by the targeted layout fix.

## Constraints
- TDD mode: standard checks (user-selected); Vitest is the approved runner.
- Package manager: pnpm (user-selected).
- Use focused functional checks and the project build; report any command that cannot run.
- Do not modify the pre-existing `.gitignore` edit. Preserve other unrelated user changes.
- No commit or publication was explicitly requested; leave changes uncommitted.
- Implementation route: delegated direct, one bounded writer at a time (multi-file write trigger).

## Tasks

### CALC-1 — Establish the pnpm test and documentation workflow
- [x] Upgrade Vite and `@vitejs/plugin-react` to a mutually compatible supported line, then add a compatible Vitest release and non-watch test script using pnpm.
- [x] Add a small meaningful test-runner smoke test; behavior regressions belong to CALC-2.
- [x] Remove `package-lock.json`; keep pnpm lock/workspace metadata authoritative and synchronized.
- [x] Correct and clarify README setup and useful project commands.

Acceptance: the upgraded app builds; `pnpm test` runs a real test; no npm lockfile remains; pnpm lock matches `package.json`.
Checks: `pnpm install --frozen-lockfile`, `pnpm test`, `pnpm build`.
Evidence: `pnpm install --lockfile-only` regenerated the lockfile under the user's explicit approval; `pnpm install --frozen-lockfile` passed on the post-deletion candidate; `pnpm test` passed (1 file, 1 test); `pnpm build` passed with Vite 6.4.3. The parent independently read back package/lock consistency, README command alignment, and absence of `package-lock.json`. No calculator behavior changed in this task.

### CALC-2 — Correct calculator input and arithmetic behavior
- [x] Make decimal entry consistent for both operands and handle incomplete decimal input safely.
- [x] Make DEL safe for an empty operand and make AC reset the displayed result.
- [x] Preserve full numeric precision internally, format only for display, and handle invalid/non-finite calculations consistently.
- [x] Remove the unreachable undefined factorial branch unless a working factorial feature is already supported by the UI.
- [x] Add focused regression tests for the confirmed edge cases.

Acceptance: keypad operations do not throw for empty operands or malformed input; chained calculations use untruncated intermediate values; invalid math produces a clear error state; regression cases pass.
Checks: `pnpm test`, `pnpm build`.
Evidence: writer reported `pnpm test` passed (2 files, 19 tests) and `pnpm build` passed. Independent verifier/parent spot-check re-ran `pnpm test` successfully (2 files, 19 tests). Read-only review found no obvious logic regression; no DOM integration test exists.

### CALC-3 — Finish calculator state separation and narrow layout
- [x] Extract editing, deletion, evaluation, and reset calculations into pure helper functions with tests (completed in CALC-2).
- [x] Extract evaluation-to-next-state success/error transitions into a pure helper and test the transitions.
- [x] Keep `NumberPad` focused on rendering and straightforward event wiring; avoid a broad reducer or file rename.
- [x] Make keypad sizing responsive so its five columns fit narrow viewports.

Acceptance: evaluation transitions are independently testable, controls remain functional, and the keypad can fit a narrow viewport without horizontal overflow.
Checks: `pnpm test`, `pnpm build`; inspect the responsive CSS constraints.
Evidence: `evaluationToState` handles and tests success/error outcomes; flexible grid tracks and viewport-aware container sizing replaced the fixed 60px-only layout. Writer reported `pnpm test` passed (2 files, 21 tests) and `pnpm build` passed; independent verifier/parent spot-check re-ran tests successfully (2 files, 21 tests). CSS was inspected, but no browser automation or visual viewport check exists.

## Progress and evidence
- Feature branch: `fix/calculator-correctness` (created from `main`).
- Existing worktree changes before this feature: modified `.gitignore`; untracked `pnpm-lock.yaml` and `pnpm-workspace.yaml`. These are user-owned; preserve the `.gitignore` edit and use the pnpm files as the requested package-manager baseline.
- Initial exploration: README/package/source audit confirmed the listed correctness defects; no test/build commands were run before implementation.
- Dependency research: official Vitest documentation says current Vitest requires Vite 6 or newer; the project uses Vite 2.9.17. The user explicitly chose to upgrade Vite and the React plugin rather than pin a legacy Vitest release.
- CALC-1: complete (uncommitted; no commit was authorized).
- CALC-2: complete (uncommitted; no commit was authorized).
- CALC-3: complete (uncommitted; no commit was authorized). Scope was narrowed after mapping because core helpers were already extracted in CALC-2; remaining evaluation-state separation and narrow layout work are complete.
- Verification: `pnpm install --frozen-lockfile`, `pnpm test` (2 files, 21 tests), and `pnpm build` passed. `pnpm test` was independently spot-checked by the parent/verifier. Responsive CSS was statically inspected; visual browser verification was unavailable. Native review inspection found no existing lineage; no review was started or receipt created.
- Commit evidence: none; no commit was authorized.

## Next step
No further implementation is planned. Changes remain uncommitted; the existing `.gitignore` edit and pnpm workspace metadata remain preserved.
