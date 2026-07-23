import { prisma } from '../db/client.js';

export class CommonsFabricUserValidationError extends Error {}

export interface CommonsFabricUser {
  fullname: string;
  email: string;
  password: string;
  organizationId: number;
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
 */
export function dbInsertCommonsFabricUser(user: CommonsFabricUser) {
  return prisma.user.create({
    data: {
      fullname: user.fullname,
      email: user.email,
      password: user.password,
      organizationId: user.organizationId,
    },
    select: { id: true, fullname: true, email: true, organizationId: true, createdAt: true },
  });
}