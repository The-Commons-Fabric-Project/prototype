/**
 * What is left of the mock auth client.
 *
 * Logging in is real now - see api/auth.ts and hooks/useAuth.tsx. Account
 * creation is not, and cannot be yet: `POST /v1/auth/create-user` requires an
 * `organizationId` for an organization that already exists, and the API has no
 * operation for creating one. The form in components/modals/CreateAccountModal.tsx
 * asks for an organization *name*, so there is nothing to map it to.
 *
 * So this keeps that one flow working exactly as it did before, in memory and
 * only in memory. Be aware of the gap it leaves: an account created here cannot
 * be logged into, because login now asks the server, which has never heard of it.
 * Deleting this file is part of finishing the create-account flow, not a
 * prerequisite for it.
 */

/** Only the fields the create-account form collects - deliberately not the API's User. */
export interface MockAccount {
  id: string;
  username: string;
  email: string;
  password: string;
}

const accounts: MockAccount[] = [
  {
    id: '0',
    username: 'Ottawa Civic Tech',
    email: 'hi@ottawacivictech.example',
    password: 'demo123',
  },
];

export const addUser = (userInfo: Partial<MockAccount>) => {
  const { email, username, password } = { ...userInfo };
  if (!email || !password) {
    throw new Error('both email and password are required');
  }

  accounts.push({
    id: (parseInt(accounts[accounts.length - 1].id) + 1).toString(),
    email,
    username: username ? username : email,
    password,
  });
}
