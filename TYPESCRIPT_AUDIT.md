# Frontend TypeScript Audit

**Date:** 2026-08-01
**Scope:** `frontend/` — `npx tsc -b` against `tsconfig.app.json` + `tsconfig.node.json`
**Status:** ✅ **0 errors** (down from 28). All 11 categories resolved.

> Regenerate this list with:
> ```sh
> cd frontend && npx tsc -b --force
> ```

## Configuration note

`strict` is still **not** enabled in either [`frontend/tsconfig.app.json`](frontend/tsconfig.app.json)
or [`frontend/tsconfig.node.json`](frontend/tsconfig.node.json). Verified 2026-08-01 that turning it
on adds **no** errors now that the audit is clear:

```sh
cd frontend && npx tsc -p tsconfig.app.json --noEmit --strict   # clean
cd frontend && npx tsc -p tsconfig.node.json --noEmit --strict  # clean
```

**This is the one action item left in this document.** Enabling `strict` today is free and stops
the nullability class of bug (category 10) from coming back. It gets more expensive the longer the
codebase grows without it.

Already enabled and pulling weight: `noUnusedLocals`, `noUnusedParameters`,
`noFallthroughCasesInSwitch`, `erasableSyntaxOnly`.

---

## Summary by category

All fixed 2026-08-01. Details in [Resolved](#resolved).

| # | Category | Count | Severity | Status |
|---|---|---:|---|---|
| 1 | Missing props interface | 3 | High | ✅ |
| 2 | Callback prop declared with wrong arity | 2 | High | ✅ |
| 3 | Missing required prop at call site | 1 | Medium | ✅ |
| 4 | Missing properties on `Event` | 2 | Medium | ✅ |
| 5 | Missing properties on `User` | 2 | Low | ✅ |
| 6 | Incomplete object literal vs. declared type | 2 | Medium | ✅ |
| 7 | Undefined identifier | 1 | **Critical** | ✅ |
| 8 | Implicit `any` parameter | 1 | Low | ✅ |
| 9 | Storybook / docs typing | 2 | Low | ✅ |
| 10 | Nullability | 1 | Medium | ✅ |
| 11 | Unused declarations | 5 | Trivial | ✅ |

---

## Open follow-ups

None of these are type errors. They are design issues the audit surfaced and deliberately did not
paper over.

1. **Org vs. user is unmodelled.** `CreateAccountModal` sends its "Organization name" field into
   `addUser` as `username`, and `CreateEventModal` passes `session.username` as an event's `org`.
   Three places now treat a user's name and an organization's name as the same string.
   `frontend/src/utils/types/orgs.ts` has a real `Org` type that `User` never references. This is
   the biggest remaining modelling gap.
2. **Import cycle.** `frontend/src/hooks/useOverlayContext.tsx` imports the modal components for
   its `Modals` registry, and those modals import `useToast` back from it. Works because function
   declarations hoist across ES module cycles, but it is fragile. Moving the `Modals` registry into
   its own module breaks it cleanly.
3. **The `Modals` registry is dead code.** Nothing renders from it — `Header.tsx` and `index.tsx`
   both import and render modals directly. It defines `ModalOption`, which *is* used, so the
   compiler stays quiet. Either render through it or reduce it to a string union.
4. **`EventDetailModal.tsx:52`** — `toast("Opening registration…")` fires on an `<a>` that opens a
   new tab. Type-checks; whether the toast is visible before the modal unmounts is untested.
5. **Unfinished auth work.** Removing the unused `useEffect` (`useAuth.tsx`) and `useRouteContext`
   (`__root.tsx`) imports cleared the warnings but not the TODOs they marked: token persistence and
   route-level auth context are both still commented out.

---

## Resolved

### Category 11 — unused declarations (5 errors)

Dead imports flagged by `noUnusedLocals` (TS6133), all leftovers from commented-out code: `Route`
in `docs.Calendar.tsx`, `React` in `docs.Tag.tsx`, `useEffect` in `useAuth.tsx`, `useRouteContext`
and `AuthState` in `__root.tsx`. Deleted. See open follow-up 5 for what they were marking.

### Category 10 — nullability (1 error)

`index.tsx` passed `user` (`User | null`) into `CreateEventModal`'s `session: User`. Gated the
modal on `user && modal === "create_event"` rather than widening `session` to accept `null` — the
create-event flow is meaningless without a signed-in user, and the render is already conditional.

### Category 8 — implicit and explicit `any` (1 error + 3 silent)

- `CreateEventModal.tsx` — `setF(patch)` typed `Partial<CreateEventFormData>` (the erroring one).
- `LoginForm.tsx` — `handleSubmit(e: any)` → `React.FormEvent`.
- `LoginForm.tsx` — `inputStyle(err: React.ErrorInfo | boolean)` → `boolean`. `React.ErrorInfo` was
  never right; both call sites pass a boolean (`false`, `!!err`).
- `useOverlayContext.tsx` — `toastTimer: any` → a named `ToastTimer` alias
  (`RefObject<ReturnType<typeof setTimeout> | undefined>`). This also removed a
  `useRef(0) as RefObject<NodeJS.Timeout | number>` cast that was asserting a Node type into
  browser code.

### Category 6 — incomplete object literal (2 errors)

The mock `auth` object was annotated `AuthState` but had no `status`. Rather than adding a dummy
`status: 'unsent'`, split the type in `utils/types/users.ts`:

- `AuthClient` — what an auth client provides (`isAuthenticated`, `user`, `login`, `logout`). The
  mock in `mocks/auth.ts` implements this, and a real client later will too.
- `AuthState extends AuthClient` — the React context value, adding `status`, which is UI state
  owned by `AuthProvider` and has no business in a credential store.

`status` also went from `string` to the `AuthAttemptStatus` union, which had been declared locally
in `useAuth.tsx` and is now exported from the types module.

The second error in this category (`LoginModal.tsx:16`, a `Partial<ModalHeaderProps>` spread into
badly-inferred state) had already been fixed as part of category 1 — `LoginModal` now uses an
explicit `LoginFormHeader` state type.

### Category 4 — missing properties on `Event` (2 errors)

`directory.tsx`'s `EventRow` read `event.month` and `event.day`, which `Event` does not declare.
Derived both from `event.date` via the existing `fmtDateChip` helper in `utils/datetime.ts`, which
returns exactly `{ month, day }`. The type was not widened, and the commented-out index signature
in `events.ts` was left commented out — uncommenting it would have silenced the error by disabling
property checking for the whole type.

### Category 3 — missing required prop (1 error)

`index.tsx` rendered `<CalendarView events={...} />` with no `onSelect`. Rather than making the
prop optional, wired it to the same behaviour `EventCardGrid` and `directory.tsx` already use:
local `selectedEvent` state, `onSelect={setSelectedEvent}`, and an `EventDetailModal` rendered on
it. Clicking a calendar event now opens its detail modal, which it previously did not do.

### Category 2 — callback props declared with wrong arity (2 errors)

Both declarations were wrong, not their call sites:

- `Calendar.tsx` — `onSelect: () => void` → `(event: Event) => void`
- `CreateEventModal.tsx` — `onCreate: () => void` →
  `(event: CreateEventFormData & { org: string }) => void`, which required exporting
  `CreateEventFormData`

### Category 9 — Storybook / docs typing (2 errors)

`ModalProps.children` was `ReactElement[]`, so passing a single child failed (TS2740 in
`docs.Modal.tsx:32`). Changed to `ReactNode`, covering one child, many, strings and `null`.

This was never only a story problem — any real caller passing exactly one child was equally
ill-typed, and only escaped because the modals all pass a header plus a body.

The other error, `docs.LoginModal.tsx`, cleared when category 1 landed.

### Category 5 — `session.name` (2 errors)

`User` declares `id`, `username`, `email` — no `name`. Both reads in `CreateEventModal` renamed to
`session.username`. Mechanically clean, but it exposed the org/user conflation now tracked as open
follow-up 1.

### Category 7 — `onCreate is not defined` (1 error)

`CreateAccountModal` called `onCreate` from the "Yes, create" handler, but the prop was commented
out of `CreateAccountModalProps` and never destructured — a live `ReferenceError` on every account
creation.

No consumer ever passed `onCreate`: the modal is rendered from the `Modals` registry in
`useOverlayContext.tsx` and from `Header.tsx`, both with `onClose` only. So rather than reviving a
prop nobody supplies, the modal now calls `addUser` from `mocks/auth.ts` directly, in a new
`handleCreate`. `addUser` throws when email or password is missing, so the call is wrapped in a
`try/catch` that toasts the error and leaves the modal open instead of falsely reporting success.

### Categories 1 + 9 (partial) — login props typing (4 errors)

`LoginModal` and `LoginForm` were destructuring props with no annotation (TS7031). Both now have
declared props types, which also cleared the missing-`args` error in `docs.LoginModal.tsx` and the
`LoginModal` half of category 6.

### `toast` passed as a prop (5 errors)

`EventDetailModal` alone received `toast` as a prop typed `toast: () => void`, while every other
modal pulled it from the `useToast()` hook. The signature was also wrong — the real function is
`(msg: string) => void`.

Fixed by removing the prop and calling `useToast()` inside the component. This cleared the arity
error plus three call sites that were not passing `toast` at all
(`EventCardGrid.tsx`, `directory.tsx`, `docs.EventDetailModal.tsx`).
