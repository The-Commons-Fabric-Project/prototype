-- Adds the four regex CHECKs from src/docs/db/schema.dbml that SQLite could not
-- take verbatim.
--
-- The DBML enforces these with Postgres' case-insensitive `~*` operator:
--   organizations.contact      ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
--   organizations.website      ~* '^https?://[^\s/$.?#].[^\s]*$'
--   events.volunteer_contact   ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
--   events.registration_link   ~* '^https?://[^\s/$.?#].[^\s]*$'
--
-- SQLite has no regex operator, so each pattern is re-expressed with built-in
-- scalar functions below. The email form is decomposed as: exactly one '@', no
-- whitespace, a non-empty local part, and a domain containing a '.' that has at
-- least one character on either side. The URL form is: an http(s) scheme, no
-- whitespace, and at least two characters after '://' the first of which is not
-- one of / $ . ? # - which is what the character class in the pattern says.
--
-- LIKE is used for the scheme test on purpose. It is case-insensitive for ASCII in
-- SQLite, which matches the `~*` in the DBML. The API layer is deliberately
-- stricter - openapi.yaml applies a case-sensitive pattern, so 'HTTPS://x.y' is
-- refused at the edge though the database would accept it. See the note on
-- Event.registrationLink in openapi.yaml.
--
-- Until now these lived only in the application layer (src/models/constraints.ts
-- and the seed script). That left every other write path - Prisma Studio, a manual
-- sqlite3 session, a future admin endpoint - free to store a phone number in an
-- email column, which response validation then turns into a 500 for every caller
-- reading that row.
--
-- SQLite cannot ALTER TABLE ... ADD CONSTRAINT, so both tables are rebuilt. Every
-- existing column, default, CHECK and foreign key is carried over unchanged; the
-- new CHECKs are the only additions.

PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;

-- RedefineTables
CREATE TABLE "new_organizations" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL CHECK (length(trim("name")) > 0),
    "logo" TEXT,
    "blurb" TEXT,
    "contact" TEXT,
    "website" TEXT,
    CHECK ("contact" IS NULL OR (
        length("contact") - length(replace("contact", '@', '')) = 1
        AND instr("contact", ' ') = 0
        AND instr("contact", char(9)) = 0
        AND instr("contact", char(10)) = 0
        AND instr("contact", char(13)) = 0
        AND instr("contact", '@') > 1
        AND instr(substr("contact", instr("contact", '@') + 1), '.') > 1
        AND substr("contact", length("contact"), 1) <> '.'
    )),
    CHECK ("website" IS NULL OR (
        ("website" LIKE 'http://%' OR "website" LIKE 'https://%')
        AND instr("website", ' ') = 0
        AND instr("website", char(9)) = 0
        AND instr("website", char(10)) = 0
        AND instr("website", char(13)) = 0
        AND length(substr("website", CASE WHEN "website" LIKE 'https://%' THEN 9 ELSE 8 END)) >= 2
        AND instr('/$.?#', substr("website", CASE WHEN "website" LIKE 'https://%' THEN 9 ELSE 8 END, 1)) = 0
    ))
);
INSERT INTO "new_organizations" ("id", "name", "logo", "blurb", "contact", "website")
    SELECT "id", "name", "logo", "blurb", "contact", "website" FROM "organizations";
DROP TABLE "organizations";
ALTER TABLE "new_organizations" RENAME TO "organizations";

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
    CHECK ("volunteer_contact" IS NULL OR (
        length("volunteer_contact") - length(replace("volunteer_contact", '@', '')) = 1
        AND instr("volunteer_contact", ' ') = 0
        AND instr("volunteer_contact", char(9)) = 0
        AND instr("volunteer_contact", char(10)) = 0
        AND instr("volunteer_contact", char(13)) = 0
        AND instr("volunteer_contact", '@') > 1
        AND instr(substr("volunteer_contact", instr("volunteer_contact", '@') + 1), '.') > 1
        AND substr("volunteer_contact", length("volunteer_contact"), 1) <> '.'
    )),
    CHECK ("registration_link" IS NULL OR (
        ("registration_link" LIKE 'http://%' OR "registration_link" LIKE 'https://%')
        AND instr("registration_link", ' ') = 0
        AND instr("registration_link", char(9)) = 0
        AND instr("registration_link", char(10)) = 0
        AND instr("registration_link", char(13)) = 0
        AND length(substr("registration_link", CASE WHEN "registration_link" LIKE 'https://%' THEN 9 ELSE 8 END)) >= 2
        AND instr('/$.?#', substr("registration_link", CASE WHEN "registration_link" LIKE 'https://%' THEN 9 ELSE 8 END, 1)) = 0
    )),
    CONSTRAINT "events_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_events" ("id", "title", "owner_id", "starts_at", "ends_at", "location", "description", "thumbnail", "registration_link", "volunteer_contact", "created_at")
    SELECT "id", "title", "owner_id", "starts_at", "ends_at", "location", "description", "thumbnail", "registration_link", "volunteer_contact", "created_at" FROM "events";
DROP TABLE "events";
ALTER TABLE "new_events" RENAME TO "events";

PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
