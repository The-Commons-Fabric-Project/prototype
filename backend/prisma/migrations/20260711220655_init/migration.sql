-- CreateTable
CREATE TABLE "users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fullname" TEXT NOT NULL CHECK (length(trim("fullname")) > 0),
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL CHECK (length("password") > 0),
    "organization_id" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "users_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "events" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL CHECK (length(trim("title")) > 0),
    "owner_id" INTEGER NOT NULL,
    "starts_at" DATETIME NOT NULL,
    "ends_at" DATETIME NOT NULL,
    "location" INTEGER NOT NULL,
    "description" TEXT,
    "thumbnail" TEXT,
    "registration_link" TEXT,
    "volunteer_contact" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CHECK ("ends_at" > "starts_at"),
    CONSTRAINT "events_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "events_location_fkey" FOREIGN KEY ("location") REFERENCES "addresses" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "organizations" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL CHECK (length(trim("name")) > 0),
    "logo" TEXT,
    "blurb" TEXT,
    "contact" TEXT,
    "website" TEXT
);

-- CreateTable
-- `tag` mirrors the org_tags Postgres enum; enforced here with an IN (...) CHECK
-- since SQLite has no enum type.
CREATE TABLE "organizations_tags" (
    "organization_id" INTEGER NOT NULL,
    "tag" TEXT NOT NULL CHECK ("tag" IN (
        'Advocacy', 'Civic', 'Community', 'Culture', 'Education', 'Equity',
        'Indigenous', 'Makers', 'Policy', 'Research', 'Seniors', 'Settlement',
        'Tech', 'Volunteer', 'Youth'
    )),

    PRIMARY KEY ("organization_id", "tag"),
    CONSTRAINT "organizations_tags_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "addresses" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "line1" TEXT NOT NULL DEFAULT '815 St. Laurent Blvd',
    "line2" TEXT,
    "city" TEXT NOT NULL DEFAULT 'Ottawa',
    "province" TEXT DEFAULT 'ON' CHECK ("province" IS NULL OR length("province") = 2),
    "postal_code" TEXT DEFAULT 'K1K3A7' CHECK ("postal_code" IS NULL OR length("postal_code") = 6),
    "country" TEXT NOT NULL DEFAULT 'CA' CHECK (length("country") = 2)
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
