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
 * Creates a user if the email is new, or updates the existing user with that
 * email otherwise.
 */
export function dbUpsertCommonsFabricUser(user: CommonsFabricUser) {
  return prisma.user.upsert({
    where: { email: user.email },
    create: {
      fullname: user.fullname,
      email: user.email,
      password: user.password,
      organizationId: user.organizationId,
    },
    update: {
      fullname: user.fullname,
      password: user.password,
      organizationId: user.organizationId,
    },
    select: { id: true, fullname: true, email: true, organizationId: true, createdAt: true },
  });
}