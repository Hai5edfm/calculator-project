# Menu UI/UX Improvements

## Objective
Improve the app's mode/settings menu controls and make the Settings popover dismiss predictably when the user clicks outside it.

## Problem and rationale
The home shell has Calculator/Converter mode controls and a Settings control, but the menu buttons lack consistent hover/pressed feedback. The Settings panel currently remains open after outside clicks, including mode changes, which is unexpected for a popover. Preserve the existing selected-state, keyboard focus, and focus-return affordances while making dismissal behavior intuitive.

## Scope
- Refine hover, pressed, and selected affordances for the Calculator/Converter mode controls and Settings menu controls, consistent with the existing visual system.
- Dismiss the Settings panel on pointer interaction outside its trigger/panel boundary.
- Preserve interaction inside the panel and existing explicit-close/Escape behavior; avoid unexpectedly stealing focus after outside dismissal.
- Do not restyle the calculator keypad or converter form controls.
- Do not introduce a new UI testing dependency solely for this change; report that browser-level behavior remains unverified if no existing DOM test harness exists.

## Constraints
- Implementation: delegated direct, one bounded writer for multi-file edits.
- Verification runner: `pnpm test` (Vitest) and `pnpm build`; no DOM testing environment is currently configured.
- Preserve current Settings semantics and accessibility attributes.
- Worktree baseline was clean on `main`; implementation branch: `feat/menu-ui-ux`.
- No commit was explicitly requested; do not commit.

## Tasks

### MENU-1 — Improve menu interactions
- [x] Add consistent hover and pressed feedback to the mode navigation and Settings controls while retaining selected mode and keyboard focus indicators.
- [x] Close the Settings panel when pointer interaction occurs outside the trigger/panel wrapper.
- [x] Preserve interaction inside the panel, toggle behavior, explicit close, Escape handling, and sensible focus behavior.

Acceptance: menu controls communicate hover, activation, and current mode without changing layout or interfering with focus styles. Outside interaction dismisses Settings; internal settings controls remain usable; dismissal does not steal focus from the clicked target; keyboard close behavior remains intact.
Checks: `pnpm test`, `pnpm build`, static interaction/focus-path inspection. Browser-level interaction remains unverified because this project has no configured DOM test environment.
Route: delegated direct writer; multi-file UI change. Evidence: implementation done; `pnpm test` passed (4 files, 76 tests); `pnpm build` passed (45 modules); parent source inspection passed. Browser-level pointer/focus interactions unavailable. User chose to restore the pnpm-generated out-of-scope `pnpm-lock.yaml` metadata diff; restoration completed, and only authorized source changes plus this ODD task file remain modified/untracked.

## Progress and evidence
- Read-only mapper confirmed `src/pages/home/index.jsx` renders Calculator/Converter mode buttons and Settings; mode controls use `aria-pressed`, and Settings exposes `aria-expanded`/`aria-controls`.
- `src/components/Settings/index.jsx` previously focused the first select on open and restored focus to its trigger on Escape/explicit close, but had no outside-click dismissal. Menu groups had focus styling but lacked hover/pressed feedback.
- Vitest is configured for Node; no DOM test library or `jsdom` was found. The exact test command is `pnpm test`.
- Implementation completed by a bounded writer: added restrained hover/pressed states in `src/App.css` and `src/styles/components/Settings/index.css`; added wrapper-scoped `pointerdown` dismissal to `src/components/Settings/index.jsx`. Outside dismissal does not restore focus; Escape and explicit close still do.
- `pnpm test`: passed, 4 files / 76 tests. `pnpm build`: passed, 45 modules transformed. Parent read-only inspection confirmed the wrapper contains trigger/panel, outside dismissal avoids focus stealing, and selected/focus-visible states remain defined.
- Browser pointer/focus interactions remain unverified because no DOM/browser test harness is configured.
- The verification commands unexpectedly added pnpm 12 package-manager metadata to `pnpm-lock.yaml` (158 insertions and one deletion) outside the authorized implementation paths. The user explicitly chose restoration; `git restore -- pnpm-lock.yaml` returned it to the clean branch baseline.
- No commit was made; the user did not request one. No native review was run; there is no work-unit commit candidate.

## Next step
Implementation and available checks are complete. The user may request a commit or browser-level interaction coverage later; no further action is authorized now.
