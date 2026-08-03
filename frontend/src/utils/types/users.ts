/**
 * Mirrors the `User` schema in backend/src/docs/api/openapi.yaml, which in turn
 * mirrors the `users` table in backend/src/docs/db/schema.dbml - the source of
 * truth for all of this.
 *
 * Note `fullname` rather than `username`, and a numeric `id`: both follow the
 * database. `passwordHash` is never sent by the API and so has no field here.
 */
export interface User {
  id: number;
  fullname: string;
  email: string;
  /** The organization the user publishes under. Resolving it to a name needs the organizations endpoint. */
  organizationId: number;
  /** RFC 3339 timestamp. */
  createdAt: string;
}

export type AuthAttemptStatus = 'unsent' | 'pending' | 'success' | 'fail';

/** The React context value. See hooks/useAuth.tsx. */
export interface AuthState {
  isAuthenticated: boolean;
  /**
   * True while the first session check is in flight.
   *
   * The session cookie is httpOnly, so on a fresh page load the app cannot know
   * whether it is signed in without asking the server. Treating that gap as
   * "signed out" is what makes a signed-in user's UI flicker through the
   * logged-out state on every refresh, so consumers should wait this out.
   */
  isLoading: boolean;
  /** The outcome of the most recent login attempt. */
  status: AuthAttemptStatus;
  /** Why the last attempt failed, ready to show. Empty unless `status` is 'fail'. */
  error: string;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}
