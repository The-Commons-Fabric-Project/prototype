This is for interacting with the backend

The peer of `mocks/`, which interacts with a mock backend instead. Flows move
from there to here as they are wired up; when `mocks/` is empty it can go.

- `client.ts` — the only place that calls `fetch`. Everything else in this
  folder goes through it. It prefixes `/v1`, sends the session cookie, and turns
  an `application/problem+json` error into a typed `ApiError`.
- `auth.ts` — the `/v1/auth/*` operations, one function per endpoint.

Two conventions worth keeping:

**Paths are relative, never absolute.** In production the backend serves this
build from its own origin; in development `vite.config.ts` proxies `/v1` to it.
Same-origin in both, which is what lets the `sameSite: 'lax'` session cookie
travel and means there is no CORS to configure.

**These functions hold no state and interpret no errors.** They call an endpoint
and return what it gave back, throwing `ApiError` otherwise. Deciding what a
failure *means* — that a 401 from `/auth/profile` is a signed-out visitor rather
than a fault — belongs to the caller, e.g. `hooks/useAuth.tsx`.

The API these mirror is defined in `backend/src/docs/api/openapi.yaml`. That
document is the contract; types here should match it, and it in turn follows
`backend/src/docs/db/schema.dbml`.
