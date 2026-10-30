# Frontend-testing pilot (29–30 Oct 2026)

Worktree: `C:\Users\marco\worktrees\whiteboard-frontend-testing`  
Branch: `feat/frontend-testing-pilot` (from `origin/main`). Not merged.

## Done here

1. Added `e2e/fixtures.ts` (`@axe-core/playwright` makeAxeBuilder).
2. Added `e2e/a11y.spec.ts`.
3. Wired `test:e2e:install`, `test:e2e:report`, `test:e2e:trace` and pinned `@axe-core/playwright@4.14.0`.
4. `npm run build` OK; smoke e2e **2 passed**.
5. Axe **failed** on Excalidraw chrome: `.reset-zoom-button` ("100%" text not in accessible name) — proves axe is wired.

## Still open

- Visual container baselines (`test:visual:setup` user-run).
- Fix or exclude the known zoom-button name mismatch.
- Agent parity prompt across Claude / Cursor / Codex.
