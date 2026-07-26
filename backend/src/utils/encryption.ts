import { hash, argon2id } from 'argon2';

/**
 * Hashes a plaintext password for storage in users.password_hash.
 *
 * Uses argon2 which is the OWASP reccomended library for security - includes password salting
 * This function should be the default hash function for all security concerns (to prevent incompatible hashes)
 */
export async function hashPassword(plaintext: string): Promise<string> {
  return hash(plaintext, { type: argon2id });
}
