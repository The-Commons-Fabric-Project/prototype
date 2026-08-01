export interface User {
  id: string;
  username: string;
  email: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  status: string;
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}