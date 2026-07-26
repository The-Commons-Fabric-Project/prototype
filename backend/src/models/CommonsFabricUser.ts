import { prisma } from '../db/client.js';

export class CommonsFabricUserValidationError extends Error {}

export interface CommonsFabricUser {
  fullname: string;
  email: string;
  password: string;
  passwordHash?: string;
  organizationId: number;
}

/** The user fields returned to clients — never includes passwordHash. */
export interface CommonsFabricUserRecord {
  id: number;
  fullname: string;
  email: string;
  organizationId: number;
  createdAt: Date;
}

/**
 * Validates a raw request body and returns a typed CommonsFabricUser.
 * Throws CommonsFabricUserValidationError if the shape is invalid.
 */
export function parseCommonsFabricUser(body: unknown): CommonsFabricUser {
  const { fullname, email, password, organizationId } = (body ?? {}) as Record<string, unknown>;

  if (
    typeof fullname !== 'string' ||
    typeof email !== 'string' ||
    typeof password !== 'string' ||
    typeof organizationId !== 'number'
  ) {
    throw new CommonsFabricUserValidationError(
      'fullname (string), email (string), password (string) and organizationId (number) are required',
    );
  }

  return { fullname, email, password, organizationId };
}

/**
 * Creates a new user. Fails (Prisma P2002) if the email is already taken.
 * Throws CommonsFabricUserValidationError if the password has not been hashed.
 */
export async function dbInsertCommonsFabricUser(
  user: CommonsFabricUser,
): Promise<CommonsFabricUserRecord> {
  if (user.passwordHash === undefined) {
    throw new CommonsFabricUserValidationError('passwordHash must be set before inserting a user');
  }
  return prisma.user.create({
    data: {
      fullname: user.fullname,
      email: user.email,
      passwordHash: user.passwordHash,
      organizationId: user.organizationId,
    },
    select: { id: true, fullname: true, email: true, organizationId: true, createdAt: true },
  });
}