-- Restores events.ends_at, reversing 20260803200000_drop_event_end_time.
--
-- The drop is not undone by deleting that migration: it has already been applied,
-- and migrations are append-only. This goes forward instead, rebuilding the table
-- with the column and the `ends_at > starts_at` CHECK back in place.
--
-- The original end times are gone - the drop discarded them and nothing here can
-- recover them. The intended path is therefore `prisma migrate reset` followed by
-- db:seed: dev.db is gitignored and holds nothing but seed data, and on a reset the
-- history replays with `events` still empty, so the backfill below matches no rows.
--
-- It exists only because the NOT NULL column has to come from somewhere if this is
-- applied to a database that does have rows. It adds 1-3 hours to starts_at, derived
-- from the row id so a rebuild is repeatable, which always satisfies the CHECK. The
-- arithmetic is in milliseconds because that is how Prisma stores DateTime in SQLite;
-- a database whose starts_at holds ISO text instead was not written by this app.
--
-- The table is rebuilt rather than altered because ALTER TABLE ADD COLUMN cannot
-- add a NOT NULL column without a constant default (the backfill is not one) and
-- cannot add a CHECK at all. Every other column, default, CHECK and foreign key is
-- carried across unchanged - see 20260802194500_email_and_url_checks for where the
-- volunteer_contact and registration_link predicates come from.

PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;

-- RedefineTables
CREATE TABLE "new_events" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL CHECK (length(trim("title")) > 0),
    "owner_id" INTEGER NOT NULL,
    "starts_at" DATETIME NOT NULL,
    "ends_at" DATETIME NOT NULL,
    "location" TEXT,
    "description" TEXT,
    "thumbnail" TEXT,
    "registration_link" TEXT,
    "volunteer_contact" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CHECK ("ends_at" > "starts_at"),
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
    SELECT
        "id",
        "title",
        "owner_id",
        "starts_at",
        "starts_at" + (1 + ("id" % 3)) * 3600000,
        "location",
        "description",
        "thumbnail",
        "registration_link",
        "volunteer_contact",
        "created_at"
    FROM "events";
DROP TABLE "events";
ALTER TABLE "new_events" RENAME TO "events";

PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
