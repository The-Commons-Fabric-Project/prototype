/**
 * Mock react auth client, ref: https://github.com/better-auth/better-auth/blob/main/packages/better-auth/src/client/react/index.ts
 */

import type { AuthState, User } from "../types/users"

type UserCredentials = User & { password: string };

const accounts: UserCredentials[] = [{ 
  id: "0",
  username: "Ottawa Civic Tech", 
  email: "hi@ottawacivictech.example", 
  password: "demo123" 
}];

// copied from https://tanstack.com/router/latest/docs/framework/react/examples/kitchen-sink-react-query-file-based?path=examples%2Freact%2Fkitchen-sink-react-query-file-based%2Fsrc%2Futils%2Fauth.tsx
export const auth: AuthState = {
  isAuthenticated: false,
  user: null,
  login: async (username: string, password: string) => {
    const matches = accounts.filter(u => u.email === username);
    if (matches.length == 1 && matches[0].password === password) {
      const { id, username, email } = matches[0];
      auth.isAuthenticated = true;
      auth.user = { id: id, username: username, email: email } as User;
    } else {
      auth.isAuthenticated = false;
    }
  },
  logout: async () => {
    auth.isAuthenticated = false;
    auth.user = null;
  }
}

export const addUser = (userInfo: Partial<UserCredentials>) => {
  const { email, username, password } = {...userInfo};
  const newUser: UserCredentials = {
    id: "",
    email: "",
    username: "",
    password: ""
  };
  if (email && password) {
    newUser.email = email;
    newUser.username = username ? username : email;
    newUser.password = password;
    newUser.id = (parseInt(accounts[accounts.length-1].id)+1).toString();

    accounts.push(newUser);
  } else {
    throw new Error("both email and password are required");
  }
}