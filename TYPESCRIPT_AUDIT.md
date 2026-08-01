# Frontend TypeScript Audit

**Date:** 2026-08-01
**Scope:** `frontend/` — `npx tsc -b` against `tsconfig.app.json` + `tsconfig.node.json`
**Status:** 13 errors across 9 files (down from 28; see [Resolved](#resolved) below)

> Regenerate this list with:
> ```sh
> cd frontend && npx tsc -b --force
> ```

## Configuration note

`strict` is **not** enabled in either [`frontend/tsconfig.app.json`](frontend/tsconfig.app.json) or
[`frontend/tsconfig.node.json`](frontend/tsconfig.node.json). Turning it on today adds **no new
errors** — every issue below is already surfaced by the current settings. That makes enabling
`strict` a cheap win once these are cleared, and it would prevent the nullability class of bug
(category 10) from recurring.

Already enabled and pulling weight: `noUnusedLocals`, `noUnusedParameters`,
`noFallthroughCasesInSwitch`, `erasableSyntaxOnly`.

---

## Summary by category

| # | Category | Count | Severity |
|---|---|---:|---|
| 1 | ~~Missing props interface~~ | 0 | ✅ Resolved |
| 2 | [Callback prop declared with wrong arity](#2-callback-prop-declared-with-wrong-arity) | 2 | High |
| 3 | [Missing required prop at call site](#3-missing-required-prop-at-call-site) | 1 | Medium |
| 4 | [Missing properties on `Event`](#4-missing-properties-on-event) | 2 | Medium |
| 5 | ~~Missing properties on `User`~~ | 0 | ✅ Resolved |
| 6 | [Incomplete object literal vs. declared type](#6-incomplete-object-literal-vs-declared-type) | 2 | Medium |
| 7 | ~~Undefined identifier~~ | 0 | ✅ Resolved |
| 8 | [Implicit `any` parameter](#8-implicit-any-parameter) | 1 | Low |
| 9 | ~~Storybook / docs typing~~ | 0 | ✅ Resolved |
| 10 | [Nullability](#10-nullability) | 1 | Medium |
| 11 | [Unused declarations](#11-unused-declarations) | 5 | Trivial |

---

## 1. Missing props interface — ✅ Resolved (2026-08-01)

`LoginModal` and `LoginForm` now declare `LoginModalProps` / `LoginFormProps` instead of
destructuring untyped props (TS7031). This also cleared the `docs.LoginModal.tsx` story error
from category 9. See [Resolved](#resolved).

## 2. Callback prop declared with wrong arity

The prop type says `() => void`, but the component invokes it with an argument
(TS2554 — *Expected 0 arguments, but got 1*). The declaration is wrong, not the call.

| Call site | Declared at | Actually called with |
|---|---|---|
| `frontend/src/components/calendar/Calendar.tsx:102` | `Calendar.tsx:19` — `onSelect: () => void` | `onSelect(event)` |
| `frontend/src/components/modals/CreateEventModal.tsx:141` | `CreateEventModal.tsx:30` — `onCreate: () => void` | `onCreate({ ...form, org })` |

**Fix**

```ts
onSelect: (event: Event) => void;
onCreate: (event: CreateEventFormData & { org: string }) => void;
```

## 3. Missing required prop at call site

Consumer omits a prop the type marks required (TS2741).

- `frontend/src/routes/index.tsx:52` — `<CalendarView events={...} />` is missing `onSelect`.

Interacts with category 2: fix `onSelect`'s signature first, then decide whether `index.tsx`
should open the event detail modal (as `EventCardGrid` and `directory.tsx` both do) or whether
`onSelect` should be optional.

## 4. Missing properties on `Event`

Code reads fields that `frontend/src/utils/types/events.ts` does not declare (TS2339).

- `frontend/src/routes/directory.tsx:78` — `event.month`
- `frontend/src/routes/directory.tsx:81` — `event.day`

`Event` carries `date: string` and `time: string` only. Prefer deriving the display values from
`date` using the existing `frontend/src/utils/datetime.ts` helpers rather than widening the type
with denormalized fields.

Note: `events.ts` has a commented-out index signature (`[prop: string]: unknown`). Uncommenting it
would silence these two errors — do not, it disables property checking for the whole type.

## 5. Missing properties on `User` — ✅ Resolved (2026-08-01)

Both `session.name` reads in `CreateEventModal` renamed to `session.username`.
See [Resolved](#resolved).

## 6. Incomplete object literal vs. declared type

- `frontend/src/mocks/auth.ts:17` — the mock `auth` object is annotated `AuthState` but omits
  `status` (TS2741).

  The deeper issue: `AuthState` describes the *React context value* (including `status`, which is
  UI state owned by `AuthProvider`), while the mock is a bare credential store. These are two
  different shapes being forced into one type. Splitting them is the real fix; adding
  `status: 'unsent'` to the mock only silences the symptom.

- `frontend/src/components/modals/LoginModal.tsx:16` — `setHeader({...e})` spreads a
  `Partial<ModalHeaderProps>` into state whose type was *inferred* as
  `{ title: string; subtitle: undefined }` (TS2345).

  Two defects at once: the inferred state type is wrong (`subtitle` can never be set to a string),
  and the partial spread can drop `title` entirely.

  **Fix**

  ```ts
  const [header, setHeader] = useState<ModalHeaderProps>({ title: "Log in", subtitle: undefined });
  const updateHeader = (e: Partial<ModalHeaderProps>) => setHeader(h => ({ ...h, ...e }));
  ```

## 7. Undefined identifier — ✅ Resolved (2026-08-01)

The `ReferenceError: onCreate is not defined` crash in `CreateAccountModal` is fixed — it now
calls `addUser` from `frontend/src/mocks/auth.ts` directly. See [Resolved](#resolved).

## 8. Implicit `any` parameter

- `frontend/src/components/modals/CreateEventModal.tsx:47` — `const setF = (patch) => ...` (TS7006).
  Should be `(patch: Partial<CreateEventFormData>)`.

Related, and **not currently erroring** but worth cleaning while you are in these files — explicit
`any` that defeats the compiler silently:

- `frontend/src/components/modals/LoginForm.tsx:35` — `(e: any)`, should be `React.FormEvent`
- `frontend/src/hooks/useOverlayContext.tsx:20` — `toastTimer: any`, should be
  `RefObject<ReturnType<typeof setTimeout>>`
- `frontend/src/components/modals/LoginForm.tsx:9` — `inputStyle(err: React.ErrorInfo | boolean)`
  takes `React.ErrorInfo`, which looks like a mistake; callers pass a string error message

## 9. Storybook / docs typing — ✅ Resolved (2026-08-01)

`docs.LoginModal.tsx` cleared when category 1 landed; `Modal`'s `children` is now `ReactNode`,
clearing `docs.Modal.tsx`. See [Resolved](#resolved).

## 10. Nullability

- `frontend/src/routes/index.tsx:59` — passes `user` (`User | null`) into `session: User` (TS2322).

Needs a guard before rendering `CreateEventModal` — the create-event flow is meaningless without a
signed-in user, so gate the modal on `user &&` rather than widening `session` to accept `null`.

This is the class of error that will multiply once `strict` is enabled; worth establishing the
pattern now.

## 11. Unused declarations

Flagged by `noUnusedLocals` (TS6133) — dead imports, mostly leftovers from commented-out code.

| Location | Symbol |
|---|---|
| `frontend/src/components/calendar/docs.Calendar.tsx:4` | `Route` |
| `frontend/src/components/chips/docs.Tag.tsx:1` | `React` |
| `frontend/src/hooks/useAuth.tsx:10` | `useEffect` — the restore-auth-on-load effect is commented out |
| `frontend/src/routes/__root.tsx:5` | `useRouteContext` |
| `frontend/src/routes/__root.tsx:8` | `AuthState` |

Safe to delete, with one caveat: the `useEffect` in `useAuth.tsx` and `useRouteContext` in
`__root.tsx` both point at unfinished auth work (token persistence, route-level auth context).
Removing the imports is correct, but the underlying TODOs remain open.

---

## Suggested order of work

1. ~~**Category 7** — the only live runtime crash.~~ ✅
2. ~~**Categories 1 + 9** — typing the two login components also fixes the broken story.~~
   ✅ for 1; category 9 still has the `docs.Modal.tsx` `children` error.
3. ~~**Category 5** — trivial rename, clears 2 errors.~~ ✅
4. ~~**Category 9** — `Modal`'s `children` type.~~ ✅
5. **Categories 2 + 3** — fix `onSelect` / `onCreate` signatures, then their call sites.
6. **Categories 4, 6, 10** — genuine modelling decisions; worth a moment's design thought each.
7. **Category 8** — implicit `any` on `setF`.
8. **Category 11** — mechanical cleanup.
9. **Enable `strict`** once the count reaches zero.

---

## Resolved

### Category 9 — `Modal` `children` type (1 error, fixed 2026-08-01)

`ModalProps.children` was `ReactElement[]`, so passing a single child failed (TS2740 in
`docs.Modal.tsx:32`). Changed to `ReactNode`, which covers one child, many, strings and `null`.
The `ReactElement` import in `Modal.tsx` became `ReactNode`.

Note this was never only a story problem — every real caller passing exactly one child was equally
ill-typed and only got away with it because the modals pass a header plus a body.

The other error in this category, `docs.LoginModal.tsx`, cleared when category 1 landed.

### Category 5 — `session.name` (2 errors, fixed 2026-08-01)

`User` declares `id`, `username`, `email` — no `name`. Both reads in `CreateEventModal`
(`:129` display, `:141` the `org` field passed to `onCreate`) renamed to `session.username`.

Mechanically clean, but it makes the modelling gap explicit: `:141` uses a *username* as an event's
`org`. That's the same org/user conflation flagged under category 7's follow-up, and it should be
settled when `User` is revisited rather than left as a rename.

### Category 7 — `onCreate is not defined` (1 error, fixed 2026-08-01)

`CreateAccountModal` called `onCreate` from the "Yes, create" handler, but the prop was commented
out of `CreateAccountModalProps` and never destructured — a live `ReferenceError` on every account
creation.

No consumer ever passed `onCreate`: the modal is rendered from the `Modals` registry in
`useOverlayContext.tsx` and from `Header.tsx`, both with `onClose` only. So rather than reviving a
prop nobody supplies, the modal now calls `addUser` from `frontend/src/mocks/auth.ts` directly, in
a new `handleCreate`. `addUser` throws when email or password is missing, so the call is wrapped in
a `try/catch` that toasts the error and leaves the modal open instead of falsely reporting success.

The dead `(e: any)` on `handleSubmit` was typed `React.FormEvent` at the same time.

**Follow-up, open:** the step-1 "Organization name" field is passed as `username`. `addUser`'s
`UserCredentials` has no notion of an organization — the org/user distinction is unmodelled, and
the same conflation shows up in category 5's `session.name`. Worth resolving when `User` is
revisited.

### Categories 1 + 9 (partial) — login props typing (4 errors, fixed 2026-08-01)

`LoginModal` and `LoginForm` were destructuring props with no annotation (TS7031). Both now have
declared props types, which also cleared the missing-`args` error in `docs.LoginModal.tsx`.

The other half of category 9 — `docs.Modal.tsx:32`, `children` typed `ReactElement[]` — is
unrelated to the login work and **still open**.

### `toast` passed as a prop (5 errors, fixed 2026-08-01)

`EventDetailModal` alone received `toast` as a prop typed `toast: () => void`, while every other
modal (`CreateEventModal`, `CreateAccountModal`, `LoginForm`) pulled it from the `useToast()` hook.
The signature was also wrong — the real function is `(msg: string) => void`.

Fixed by removing the prop and calling `useToast()` inside the component. This cleared the arity
error plus three call sites that were not passing `toast` at all
(`EventCardGrid.tsx`, `directory.tsx`, `docs.EventDetailModal.tsx`).

**Two follow-ups this surfaced, both still open:**

- `EventDetailModal.tsx:52` — `toast("Opening registration…")` fires on an `<a>` that opens a new
  tab. It now type-checks, but whether the toast is actually visible before the modal unmounts is
  untested. Behavioral, not a type issue.
- **Import cycle.** `frontend/src/hooks/useOverlayContext.tsx` imports the modal components for its
  `Modals` registry, and those modals import `useToast` back from it. This cycle pre-existed
  (`CreateEventModal` and `CreateAccountModal` already did it) and works because function
  declarations hoist across ES module cycles — but it is fragile. Moving the `Modals` registry into
  its own module would break the cycle cleanly.
