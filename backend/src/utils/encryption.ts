import { hash, verify, argon2id } from 'argon2';

/**
 * Hashes a plaintext password for storage in users.password_hash.
 *
 * argon2id is the OWASP recommendation and salts per call. Use this everywhere
 * rather than hashing directly, so the stored formats stay compatible.
 */
export async function hashPassword(plaintext: string): Promise<string> {
  return hash(plaintext, { type: argon2id });
}

export async function verifyPassword(passwordHash: string, plaintext: string): Promise<boolean> {
  return verify(passwordHash, plaintext);
}
