export interface User {
  id: string;
  username: string;
  email: string;
}

export type AuthAttemptStatus = 'unsent' | 'pending' | 'success' | 'fail';

/** What an auth client (mock or real) provides: credentials in, session out. */
export interface AuthClient {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

/** The React context value — an auth client plus the UI state AuthProvider owns. */
export interface AuthState extends AuthClient {
  status: AuthAttemptStatus;
}
