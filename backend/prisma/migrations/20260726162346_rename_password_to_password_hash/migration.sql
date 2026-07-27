-- Renames users.password -> users.password_hash, preserving the existing hashes.
ALTER TABLE "users" RENAME COLUMN "password" TO "password_hash";
