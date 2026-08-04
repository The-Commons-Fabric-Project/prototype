---
name: project-audit
description: Audit an unfamiliar codebase and write a markdown report covering its structure, dependency reliance, data layer, and I/O surface. Invoke only when the user explicitly asks for this skill by name, or explicitly asks for a project audit or written overview report of a codebase. Do not invoke it on your own initiative for ordinary questions about a project, exploratory searching, or code changes — exploring unfamiliar code is not by itself a reason to run an audit.
---

# Project Audit

Produce a report that lets someone who has never seen the codebase understand what it
is, how it is put together, what it leans on, and how it is meant to be interacted with.

The value of this report is *judgment*, not simply listing information. A file listing is worthless —
the reader can run `ls`. What they cannot get cheaply is: which of these 40 directories
matter, which of these 60 dependencies would take a month to remove, and what the
actual entry points are. Every section below exists to answer a question a new
contributor would need to work on the project.

## Step 0: Settle scope and destination

Before exploring, get two things straight. Ask in a single message, and propose
defaults so the user can just say "yes":

1. **Scope** — whole repo, a subdirectory, or a specific concern? If the user already
   said ("just the frontend", "TypeScript errors only"), don't re-ask; restate your
   reading of it in one line and continue.
2. **Where to write the report** — always ask. Offer a sensible default (repo root as
   `PROJECT_OVERVIEW.md`, or a scratchpad path if you have one) and note that the repo
   root option adds a file to their tree. Never write into someone's repo without
   confirming — an unexpected untracked file in a clean working tree is a real
   annoyance, especially mid-review.

If the user gave a focused concern (bugs, types, auth, performance), the report keeps
the same skeleton but the depth budget shifts: shallow on everything, deep on the
concern, and add a dedicated findings section (see *Focused investigations*).

## Step 1: Triage before you drill

Big repos punish depth-first reading. Spend the first pass building a map, then decide
where the depth goes. Concretely:

- Read the manifests first — `package.json`, `go.mod`, `Cargo.toml`, `pyproject.toml`,
  `pom.xml`, `Gemfile`, `*.csproj`. They name the language, the frameworks, the scripts,
  and the entry points in one shot.
- Read the README and any `docs/`, `CONTRIBUTING.md`, `ARCHITECTURE.md`. Treat these as
  claims to verify, not facts — stale docs are the norm. When docs and code disagree,
  the code wins and the disagreement is itself worth reporting.
- Get the directory shape at 2–3 levels deep, with file counts and rough line counts per
  top-level area. Size is a decent first proxy for where the substance lives.
- Look at recent git history (`git log --oneline -30`, and `git log --format= --name-only
  -200 | sort | uniq -c | sort -rn | head -30`). Files that change constantly are the
  live parts of the system; files untouched for years are either stable infrastructure
  or dead weight, and the distinction is usually obvious from context.

From that map, pick the handful of areas that carry the system and read those properly.
State in the report which areas you read closely and which you only skimmed — an honest
coverage note is more useful than false uniformity, and it tells the reader where to
push back.

Parallelize the mechanical sweeps (dependency counting, endpoint grepping, config
scanning) rather than doing them in sequence. Use subagents for independent sweeps on
large repos if that is available to you.

## Step 2: Dependency reliance

The user specifically wants to know *how important* each dependency is, not just that
it exists. Importance is roughly: how much of the codebase touches it × how hard it
would be to swap out.

Count real usage rather than guessing. For each declared dependency, count importing
files — for example:

```bash
# JS/TS
grep -rEo "from ['\"](@?[a-z0-9._-]+(/[a-z0-9._-]+)?)" src --include=*.{ts,tsx,js,jsx} \
  | sed -E "s/.*['\"]//" | sort | uniq -c | sort -rn
# Python
grep -rEho "^\s*(import|from)\s+[a-zA-Z0-9_.]+" . --include=*.py | awk '{print $2}' \
  | cut -d. -f1 | sort | uniq -c | sort -rn
# Go
go list -deps ./... 2>/dev/null | head -50
```

Then classify each significant dependency into one of four tiers, and say *why* in a
few words each:

- **Load-bearing** — the architecture is shaped around it. Removing it means a rewrite.
  (A web framework, an ORM, a UI framework, a state library woven through components.)
- **Substantial** — used widely but behind ordinary interfaces; replaceable over days.
- **Peripheral** — a handful of call sites; a weekend to swap or inline.
- **Vestigial** — declared but barely or never imported. Flag these; they're free cleanup
  and they mislead newcomers about what the stack actually is.

Also call out, when true and interesting: dependencies pinned to old major versions,
two libraries doing the same job (two HTTP clients, two date libraries), and anything
unmaintained that sits in the load-bearing tier. That last combination is the single
most useful risk signal in this whole report.

## Step 3: The I/O surface

Think of this as the readable `--help` the project never wrote: everything the outside
world can send in or receive out. What counts as I/O depends on the kind of project —
see `references/io-surfaces.md` for per-ecosystem discovery recipes (HTTP frameworks,
CLIs, libraries, desktop/mobile, data pipelines, infra). Read that file once you know
what kind of project you're in; it's a lookup table, not required reading front to back.

Whatever the shape, the report should let a reader interact with the project without
opening the source. For an HTTP service that means method, path, auth requirement,
params, response shape, as well as the services endpoints. 
For a CLI, every subcommand and flag with its default. For
a library, the exported surface. In all cases include environment variables and config
keys — they are I/O too, and they are the single most common thing missing from
onboarding docs. List their names and purpose only, from how they're referenced in code
or `.env.example`/sample config — never read or print actual environment variable values
or a real `.env` file.

### Categorize, don't just list

A flat list of eighty endpoints is nearly as unhelpful as no list at all — the reader
can't tell which ones belong together, which subsystem owns them, or where to look for
the thing they actually need. Once a project has a non-trivial surface (roughly a dozen
endpoints or more), group it into named categories and give each its own subsection with
its own table.

Categorize by the boundaries the *system* already has, not by alphabet or by file layout:

- **Domain / resource** — Auth, Users, Customers, Orders, Billing, Admin. This is the
  right default for a monolithic API.
- **Service** — when it's a microservice architecture or a monorepo of several apps,
  the owning service is the top-level grouping and domains nest beneath it.
- **Access level** — a separate section for public/unauthenticated routes, admin-only
  routes, and internal/service-to-service routes when the codebase draws that line.
  Readers scan for this, and a public route sitting in an otherwise-authenticated area
  is exactly the kind of thing an audit should surface.
- **Versioning** — if `/v1` and `/v2` coexist, split them and say which is current.

Derive the categories from evidence — router mount prefixes, controller/module names,
directory structure, the shared middleware a group of routes passes through — and name
each category the way the codebase names it, so the reader can grep for it. Where a
category maps to specific files, say so under the heading (`Auth — src/routes/auth.ts`).
Anything that doesn't fit goes in a final "Miscellaneous" group rather than being forced
into a category that misrepresents it.

The same logic applies to non-HTTP surfaces: group CLI subcommands by command family,
library exports by module, queue consumers by topic domain.

Use tables where the data is regular — this is the one place in the report where density
beats prose.

## Step 3b: The data layer

Establish what the storage is. Don't infer it from a single dependency —
`pg` in `package.json` and a `sqlite:///dev.db` in the dev config can both be true, and
the interesting fact is the mismatch. Look at the ORM/driver dependencies, the
connection string or DSN wherever it's built, migration tooling, docker-compose services,
and any Terraform/Helm database resources.

Cover these, dropping what doesn't apply:

- **Engine and version** — Postgres 15, SQLite, MongoDB, Redis, DynamoDB, plain JSON or
  YAML files on disk, or no persistence at all. Say plainly if the project is
  config-file-only; "there is no database" is a genuinely useful finding.
- **Where it lives, per environment** — a local file path, a container from
  `docker-compose.yml`, a managed cloud instance, an in-memory test double. Dev and prod
  usually differ; report both and note it when they diverge in a way that could bite
  (SQLite locally, Postgres in prod is the classic).
- **How to connect** — the concrete steps. Which env vars supply the credentials, what
  the connection string looks like (with secrets redacted), the command to open a shell
  (`psql "$DATABASE_URL"`, `sqlite3 ./data/app.db`, `redis-cli`, `docker compose exec db
  psql -U app`), and what has to be running first. This is the highest-value paragraph
  in the section — write it so it can be copy-pasted. Name env vars from code and config
  *references* (`process.env.X`, `.env.example`, docker-compose, Terraform) — never read
  their actual values. Do not `cat`/`print`/`env` a real `.env` file or otherwise dump
  live environment variables; that's how secrets end up quoted in a report.
- **Schema and migrations** — where the schema is defined (models, `schema.prisma`,
  `.sql` files), the migration tool and how to run it, whether seed data exists and how
  to load it, and the main tables with a one-line purpose each. Relationships matter more
  than columns; don't transcribe every field.
- **Access path from code** — the layer application code goes through: an ORM, a
  repository/DAO layer, raw SQL, or a client library called directly from handlers.
  Point at the file where connections are created. Note if the pattern is inconsistent —
  half the codebase using an ORM and half using raw queries is worth a line.
- **Other stateful stores** — caches, session stores, object storage, search indexes,
  message brokers. Each with the same treatment: what, where, how to reach it.

If credentials or the connection can't be verified without running things, say what
you inferred and from which file rather than presenting a guess as tested fact.

## Step 4: Write the report

Save as markdown at the agreed path. Use this skeleton, dropping sections that don't
apply rather than padding them with "N/A":

```markdown
# <Project Name>

**One-paragraph summary** — what it does, who it's for, what stack.

## At a glance
| | |
|---|---|
| Language / runtime | |
| Framework | |
| Entry point(s) | |
| Build / run | |
| Tests | |
| Size | ~N files, ~N LOC |

## Architecture
Prose + a diagram if the shape warrants one. How a request/invocation flows through
the system end to end.

## Directory map
Only the directories that matter, one line each on what lives there and why.

## Dependencies
Tiered table: name, version, tier, what it's used for, notes.

## I/O surface
One `###` subsection per category (Auth, Customers, Admin, or per service), each with
its own table. Then environment variables and config keys.

## Data layer
Engine and version, where it lives per environment, how to connect (copy-pasteable),
schema and migrations, how code reaches it, other stateful stores.

## Observations
Rough edges, risks, inconsistencies, dead code. Concrete and file-anchored.

## Coverage
What was read closely, what was skimmed, what was skipped.
```

Anchor claims to files with relative paths and line numbers (`src/api/routes.ts:42`) so
the reader can jump straight there and check you. A report that can be verified in ten
seconds gets trusted; one that can't gets re-derived from scratch.

Include a mermaid diagram when the system has a genuine shape worth seeing — a request
path through layers, a service topology, a data flow. Skip it when the answer would be
three boxes in a row; a trivial diagram costs the reader attention and returns nothing.

## Length and honesty

Aim for something a person actually reads: roughly 200–500 lines for a typical project,
more only if the surface is genuinely large (a hundred endpoints need a hundred rows).
Cut anything that restates what a config file already says plainly.

Two failure modes to avoid, both of which come from wanting the report to look complete:

- **Fabricated confidence.** If you didn't read the payments module, say so in Coverage.
  Do not infer its behavior from its name and write it up as fact.
- **Filler.** "This project uses modern best practices" tells the reader nothing. If a
  sentence would be true of any repo, delete it.

## Focused investigations

When the user scopes to a concern instead of the whole project, keep a slim version of
the skeleton (At a glance, Architecture, Coverage) and put the weight into findings.

Run the tooling that already exists before reading code by hand — `tsc --noEmit`,
`eslint`, `mypy`, `go vet`, `cargo clippy`, the test suite. Real diagnostics beat
guesses, and the output gives you an exact worklist. If the tool isn't configured, say
that; a missing type-check config is itself a finding.

Report findings grouped by root cause rather than by file. Ten errors from one missing
type definition are one finding with ten sites, and framing it that way is the
difference between a fix and a slog. For each: what's wrong, where (file:line), why it
matters, and the suggested fix. Order by severity, not by discovery order.

Investigate and report — don't start fixing unless the user asks. They came for the map.
