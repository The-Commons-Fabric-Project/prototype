/**
 * Mirrors the `User` schema in backend/src/docs/api/openapi.yaml. `passwordHash` is
 * never sent by the API and so has no field here.
 */
export interface User {
  id: number;
  fullname: string;
  email: string;
  /** The organization the user publishes under. See hooks/useOrganizations.ts. */
  organizationId: number;
  /** RFC 3339 timestamp. */
  createdAt: string;
}

export type AuthAttemptStatus = 'unsent' | 'pending' | 'success' | 'fail';

export interface AuthState {
  isAuthenticated: boolean;
  /**
   * True while the first session check is in flight. Consumers should wait it out -
   * treating the gap as "signed out" is what flickers the UI on every refresh.
   */
  isLoading: boolean;
  status: AuthAttemptStatus;
  /** Ready to show. Empty unless `status` is 'fail'. */
  error: string;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}
