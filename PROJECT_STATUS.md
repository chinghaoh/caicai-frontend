# Caicai — Project Status

> Paste this file alongside CLAUDE.md at the start of every new chat session.
> Keep this file updated after every session.

---

## Current Status

**Phase:** started — ready to build  
**Last updated:** 2026-05-27

---

## Bootstrap Progress

```
[x] 1. Database migrations
[x] 2. Backend entities + repositories
[x] 3.  GlobalExceptionHandler + AppException
[x] 4.  Auth backend (register, verify, login, logout, forgot/reset password, demo)
[x] 5.  Shared frontend components (ui/)
[ ] 6.  apiClient + SessionExpiredModal
[ ] 7.  Auth frontend pages
[ ] 8.  Onboarding flow + AI goal suggestion
[ ] 9.  Food search (OpenFoodFacts + Redis cache)
[ ] 10. Favourite foods
[ ] 11. Food log
[ ] 12. Copy day feature
[ ] 13. Water tracking
[ ] 14. Weight tracking
[ ] 15. Goals (current, history)
[ ] 16. Dashboard (daily, weekly, monthly)
[ ] 17. Settings (profile, goals)
```

---

## Decisions Made This Session

- Added Button and Input to shared ui/ components (not in original CLAUDE.md)
- Deferred SectionHeader, ErrorMessage, MacroCard, CalorieRing — no immediate use case
- CalorieRing deferred to step 16 (dashboard)
- MacroCard deferred to step 11 (food log) where need will be clearer
- Macro education tooltips added to backlog (implement after step 16)


---

## Files Created So Far

_List every file created, so the next session knows what exists._
src/components/ui/StatCard.jsx
src/components/ui/PageHeader.jsx
src/components/ui/EmptyState.jsx
src/components/ui/FilterPills.jsx
src/components/ui/Pagination.jsx
src/components/ui/LoadingSpinner.jsx
src/components/ui/ProgressBar.jsx
src/components/ui/MacroBadge.jsx
src/components/ui/SessionExpiredModal.jsx
src/components/ui/Input.jsx
src/components/ui/Button.jsx

---

## Current Task

Step 6 — apiClient + SessionExpiredModal wiring into App.jsx
---

## Known Issues / Blockers

_Anything broken, unclear, or blocking progress._

None.

---

## How To Use This File

**Start of session:**
1. Paste CLAUDE.md
2. Paste this file
3. Say: "Continue from where we left off. Current task is [X]."

**End of session:**
1. Check off completed bootstrap steps
2. Add any new decisions to "Decisions Made"
3. Update "Files Created So Far"
4. Set "Current Task" to the next step
5. Note any blockers
