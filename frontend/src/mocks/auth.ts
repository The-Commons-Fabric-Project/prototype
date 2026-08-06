/**
 * What is left of the mock auth client. Login is real; account creation cannot be
 * yet, because create-user needs an existing `organizationId` and the form asks for
 * an organization *name* the API has no operation to create.
 *
 * In memory only, so an account created here cannot then be logged into. Deleting
 * this file is part of finishing the create-account flow.
 */

/** Only the fields the create-account form collects - not the API's User. */
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
