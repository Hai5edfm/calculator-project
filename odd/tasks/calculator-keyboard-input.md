# Calculator Keyboard Input

## Objective
Make calculator keyboard input discoverable and efficient through a visible shortcut guide and arrow-key navigation of the keypad.

## Problem and rationale
The Calculator supports physical-key input, but users cannot see the mapping and cannot navigate the keypad with arrow keys. Add a semi-transparent left-side guide on wide screens and make arrow navigation move actual focus between keypad actions, while preserving native button activation and avoiding interference with converter/settings controls.

## Scope
- Keep digits `0`–`9` and `.` as input to the currently edited operand.
- Keep `+`, `-`, `*`, and `/` as the existing basic arithmetic operation choices; `=` always evaluates; `Backspace` deletes one character.
- `Enter` evaluates when focus is outside the keypad, but activates the focused keypad button when focus is inside it; `Space` activates the focused keypad button using native button behavior.
- Arrow keys move focus among the keypad buttons; stop at grid edges rather than wrapping. Use real button focus and a visible focus indicator, not `aria-selected` to represent focus.
- Add a semantic keyboard-mapping table on the left of the calculator at wide widths; stack it responsively on narrow screens and keep text fully opaque/readable over its translucent background.
- Enable calculator shortcuts only while Calculator mode is active; ignore input/select/textarea/contenteditable targets and avoid hijacking Settings or mode-navigation controls.
- Reuse existing calculator validation, input precision, and state behavior; add focused tests for key mapping and arrow navigation logic where compatible with the utility-test pattern.
- Do not map `Escape` or `Delete` to AC; do not add exponent, remainder, or unary-operation shortcuts in this task.
- Do not add browser/UI test dependencies solely for this feature.

## Constraints
- Implementation route: delegated direct; one writer for multi-file changes.
- TDD mode: standard checks (user-selected in the existing calculator feature configuration); Vitest runner is `pnpm test`.
- No DOM/browser test harness is configured; report keyboard event integration as unverified automatically if there is no existing compatible harness.
- Preserve existing calculator and converter behavior and shared settings.
- Feature branch: `feat/calculator-keyboard-input`, created from clean `main`.
- Do not commit; the user did not request a commit.

## Tasks

### KEY-1 — Add calculator keyboard shortcuts
- [x] Map digits, decimal, basic arithmetic, evaluate, and backspace to existing calculator actions.
- [x] Scope shortcuts to active Calculator mode and ignore editable fields and non-calculator menu controls.
- [x] Add focused tests for the key mapping and verify existing behavior remains intact.

Acceptance: the listed keys perform the same actions as the corresponding keypad controls; operations respect current operand editing and configured precision; shortcuts do not interfere with Converter inputs, Settings controls, or inactive Calculator mode.
Checks: `pnpm test`, `pnpm build`, static inspection of active-mode and editable-target guards. Browser-level keyboard interaction remains unverified because no DOM/browser harness is configured.
Route: delegated direct writer; multi-file behavior change. Evidence: writer reports `pnpm test` passed (4 files, 100 tests), `pnpm build` passed (45 modules), and `git diff --check` passed. Independent verifier reran `pnpm test` (4 files, 100 tests) and `pnpm build` (45 modules), both passed; statically confirmed mode gating, editable/menu guards, and reuse of existing input/evaluation/deletion helpers. Initial background verification process failed with an assistant error and provided no findings; a fresh foreground verifier completed successfully.

### KEY-2 — Add shortcut guide and keypad arrow navigation
- [x] Show a semi-transparent semantic key-mapping table beside the Calculator, stacking it on narrow screens.
- [x] Let arrow keys move real focus between keypad buttons with a visible focus style; do not use `aria-selected` to describe focus.
- [x] Make Enter activate the focused keypad button while retaining Enter-to-evaluate outside the keypad; preserve Space's native button activation and `=` evaluation.
- [x] Update the key mapping/navigation tests and document that browser-level UI behavior cannot be automated with the existing harness.

Acceptance: on wide screens the mapping table sits to the left of the calculator, remains readable, and moves into a usable stacked layout on narrow screens. Arrow navigation moves focus among buttons and stops at edges; Enter/Space activate the focused button, while Enter outside the keypad and `=` evaluate. Existing calculator shortcuts and mode/input guards remain intact.
Checks: `pnpm test`, `pnpm build`, static inspection of focus semantics, direction handling, key guide completeness, and responsive layout. Browser-level interactions remain unverified because no DOM/browser harness is configured.
Route: delegated direct writer; multi-file accessibility and UI change. Evidence: writer passed `pnpm test` (5 files, 103 tests) after correcting two navigation-test failures and `pnpm build` (46 modules). Independent verifier found no static implementation issues and independently passed the same test/build commands. A responsive follow-up preserves the user's absolute layout above 1400px, uses an in-flow side panel from 821–1400px, and keeps static stacking at 820px and below; `pnpm build` passed after that adjustment. Browser-level event/layout behavior remains unavailable without a DOM/browser harness.

## Progress and evidence
- Read-only mapping confirmed keypad actions are routed through existing pure calculation/input helpers and Calculator state; `Home` keeps Calculator and Converter rendered but hides inactive content.
- Existing keypad actions include digits, decimal, `+`, `-`, multiplication (`x`), division (`÷`), exponent, remainder, unary square/root, `AC`, `DEL`, `Ans`, and `=`. KEY-1 intentionally mapped only the common keyboard subset.
- Existing tests cover pure calculator helpers; there is no component/browser test library. `pnpm test` runs `vitest run`; `pnpm build` runs Vite.
- KEY-1 mapped supported keys to existing actions in `src/utils/calculator.js`; `Calculator` applies those actions only when active and ignores editable targets plus Settings/mode navigation controls. `Home` passes the active-mode flag.
- KEY-1 writer checks: `pnpm test` passed (4 files, 100 tests); `pnpm build` passed (45 modules); `git diff --check` passed. Independent verifier confirmed the behavior and reran test/build successfully.
- Native risk assessment was unassessable because the untracked ODD task document prevented classifying the workspace candidate; RDD's high-risk path was followed with an independent verifier. No review was started because there is no work-unit commit candidate and no commit was authorized.
- KEY-1 browser-level keyboard events remain unverified through a browser/DOM harness.
- KEY-2 product decision: the user selected contextual Enter: Enter activates a focused keypad button, but still evaluates when focus is outside the keypad; `=` always evaluates. Space uses native button activation.
- Accessible focus decision: keypad buttons are actions, not selectable options, so do not use `aria-selected`; arrow navigation moves actual focus and should expose a visible focus indicator.
- KEY-2 writer added the shortcut table and responsive layout, geometry-based arrow navigation across the 5-column grid (including spanning buttons), visible focus styling, contextual Enter, and navigation tests. Writer's final `pnpm test` passed (5 files, 103 tests) after an initial run revealed and fixed two test failures; `pnpm build` passed (46 modules). No `pnpm-lock.yaml` diff was reported.
- Native assessment was unassessable because the untracked ODD task document blocks classification; read-only inspect was already used. The independent high-risk verifier found no static issues and independently passed `pnpm test` (5 files, 103 tests) and `pnpm build` (46 modules). No review was started because no work-unit commit candidate exists and no commit was authorized.
- Parent confirmed the final worktree contains the intended keyboard implementation and the untracked ODD task document only; no `pnpm-lock.yaml` diff appeared. Build output under ignored `dist/` does not appear in Git status.
- Responsive follow-up: preserved the user's `position: absolute` layout above 1400px and existing static stack at 820px and below; added an in-flow flex layout for 821–1400px with `width: clamp(220px, 24vw, 320px)`. Read-only verification confirmed the 821px case fits the available width and `pnpm build` passed. Browser viewport rendering remains unverified.
- Browser-level keyboard activation, focus, and responsive layout remain unverified due to the absence of a DOM/browser harness.

## Next step
Implementation and available verification are complete. The user may request browser-level interaction tests or a commit later; no further action is authorized now.
