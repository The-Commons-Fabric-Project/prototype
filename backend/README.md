## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create your local env file:

   ```bash
   cp .env.example .env
   ```

   `DATABASE_URL` defaults to a local SQLite file at `./dev.db` (relative to `backend/`) and should work out of the box.

3. Initialize the Prisma database:

   ```bash
   npm run db:migrate
   ```

   This applies all migrations in `prisma/migrations` to a local SQLite database (creating a `dev.db` file if it doesn't already exist) and regenerates the Prisma client. Re-run this command whenever you pull new migrations.

4. Start the dev server:

   ```bash
   npm run dev
   ```

## Prisma scripts

- `npm run db:migrate` — create/apply migrations against your local dev database (use this during development when you change `prisma/schema.prisma`).
- `npm run db:deploy` — apply existing migrations without generating new ones (used in production/CI).
- `npm run db:generate` — regenerate the Prisma client from the schema without touching migrations.
- `npm run db:studio` — open Prisma Studio to browse/edit local data.
