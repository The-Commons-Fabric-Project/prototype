/**
 * The /v1/auth/* operations, one function per endpoint.
 *
 * These are deliberately thin: no React, no state, no error interpretation. The
 * session they establish lives in an httpOnly cookie the browser manages, so
 * none of them return a token and there is nothing to persist. useAuth is what
 * turns these into state.
 */

import { get, post } from './client';
import type { User } from '../utils/types/users';

/** POST /v1/auth/login - sets the session cookie. Throws ApiError 401 if the credentials do not match. */
export const login = (email: string, password: string) => post<User>('/auth/login', { email, password });

/** POST /v1/auth/logout - clears the session cookie. Succeeds even with no session. */
export const logout = () => post<{ ok: boolean }>('/auth/logout');

/**
 * GET /v1/auth/profile - the signed-in user.
 *
 * Throws ApiError 401 when there is no valid session, which is the normal answer
 * for a signed-out visitor rather than a failure. Because the cookie is httpOnly
 * this is the only way to find out whether one exists.
 */
export const getProfile = () => get<User>('/auth/profile');

/**
 * POST /v1/auth/create-user - registers a user and signs them in.
 *
 * `organizationId` must be an existing organization: the API has no endpoint for
 * creating one, so registration cannot bring its own. See the note in
 * components/modals/CreateAccountModal.tsx.
 */
export const createUser = (input: { fullname: string; email: string; password: string; organizationId: number }) =>
  post<User>('/auth/create-user', input);
