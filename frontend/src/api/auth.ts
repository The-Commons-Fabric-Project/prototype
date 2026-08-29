/**
 * The /v1/auth/* operations, one function per endpoint. The session lives in an
 * httpOnly cookie, so none of these return a token. useAuth turns them into state.
 */

import { get, post } from './client';
import type { components as c } from "./openapi.gen";

/**
 * Mirrors the `User` schema in backend/src/docs/api/openapi.yaml. `passwordHash` is
 * never sent by the API and so has no field here.
 */
export type User = c["schemas"]["User"]
//   id: number;
//   fullname: string;
//   email: string;
//   /** The organization the user publishes under. See hooks/useOrganizations.ts. */
//   organizationId: number;
//   /** RFC 3339 timestamp. */
//   createdAt: string;

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

/** POST /v1/auth/login - sets the session cookie. Throws ApiError 401 if the credentials do not match. */
export const login = (email: string, password: string) => post<User>('/auth/login', { email, password });

/** POST /v1/auth/logout - clears the session cookie. Succeeds even with no session. */
export const logout = () => post<{ ok: boolean }>('/auth/logout');

/**
 * GET /v1/auth/profile - the signed-in user. Throws ApiError 401 when there is no
 * session, the normal answer for a signed-out visitor rather than a failure.
 */
export const getProfile = () => get<User>('/auth/profile');

/**
 * POST /v1/auth/create-user - registers a user and signs them in. `organizationId`
 * must already exist; the API has no endpoint for creating one.
 */
export const createUser = (input: { fullname: string; email: string; password: string; organizationId: number }) =>
  post<User>('/auth/create-user', input);
