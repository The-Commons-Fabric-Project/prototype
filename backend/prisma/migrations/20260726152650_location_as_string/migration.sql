/*
  Warnings:

  - You are about to drop the `addresses` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "addresses";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_events" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL CHECK (length(trim("title")) > 0), -- This check had to be added manually because prisma is annoying
    "owner_id" INTEGER NOT NULL,
    "starts_at" DATETIME NOT NULL,
    "ends_at" DATETIME NOT NULL,
    "location" TEXT,
    "description" TEXT,
    "thumbnail" TEXT,
    "registration_link" TEXT,
    "volunteer_contact" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CHECK ("ends_at" > "starts_at"), -- Also had to be added manually
    CONSTRAINT "events_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_events" ("created_at", "description", "ends_at", "id", "location", "owner_id", "registration_link", "starts_at", "thumbnail", "title", "volunteer_contact") SELECT "created_at", "description", "ends_at", "id", "location", "owner_id", "registration_link", "starts_at", "thumbnail", "title", "volunteer_contact" FROM "events";
DROP TABLE "events";
ALTER TABLE "new_events" RENAME TO "events";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
