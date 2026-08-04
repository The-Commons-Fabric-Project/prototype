# I/O surface discovery by project type

A lookup table. Find the rows matching the project in front of you, run the recipes,
skip the rest. The grep patterns are starting points — read the hits, don't paste
counts into the report.

## Contents
- [Identify the project type](#identify-the-project-type)
- [HTTP services](#http-services)
- [GraphQL, gRPC, WebSocket, queues](#graphql-grpc-websocket-queues)
- [CLI tools](#cli-tools)
- [Libraries and packages](#libraries-and-packages)
- [Frontend applications](#frontend-applications)
- [Data pipelines and jobs](#data-pipelines-and-jobs)
- [Infrastructure and config repos](#infrastructure-and-config-repos)
- [Configuration and environment (all types)](#configuration-and-environment-all-types)
- [Data layer discovery](#data-layer-discovery)

## Identify the project type

The manifest usually settles it in seconds. `bin`/`scripts.bin` or a `[[bin]]` target
means CLI. A `main` / `exports` field with no server dependency means library. A web
framework in the dependency list means service. `Dockerfile` + `EXPOSE` means service.
`*.tf`, `*.yaml` under `k8s/`, `helm/` means infra. Many repos are two of these at once
— a library that ships a CLI is extremely common — so cover both surfaces.

## HTTP services

| Stack | Where routes live | Recipe |
|---|---|---|
| Express / Koa / Fastify | `app.get(...)`, routers mounted with `app.use('/x', r)` | `grep -rnE "\.(get\|post\|put\|patch\|delete\|all)\(['\"]" src` — then trace `use()` mounts to reconstruct full paths |
| NestJS | decorators | `grep -rnE "@(Controller\|Get\|Post\|Put\|Patch\|Delete)\(" src` |
| Next.js / Nuxt / SvelteKit | file-system routing | `find app pages src/routes -name "route.*" -o -name "+server.*" -o -path "*api*"` — path on disk *is* the URL |
| Flask / FastAPI | decorators | `grep -rnE "@(app\|router)\.(get\|post\|put\|patch\|delete)\(\|@app.route" .` ; FastAPI also serves `/openapi.json` at runtime |
| Django | `urls.py` | read every `urlpatterns`, follow `include()` recursively |
| Rails | `config/routes.rb` | `bin/rails routes` if runnable — it's authoritative |
| Go net/http, chi, gin, echo | mux registration | `grep -rnE "\.(Handle\|HandleFunc\|GET\|POST\|PUT\|DELETE)\(" .` |
| Spring | annotations | `grep -rnE "@(RestController\|RequestMapping\|GetMapping\|PostMapping)" src` |
| Axum / Actix | router builder | `grep -rnE "\.route\(|#\[(get\|post\|put\|delete)\(" src` |

An OpenAPI/Swagger spec in the repo is a shortcut, but verify a few entries against the
code before trusting it wholesale — specs drift.

For each endpoint capture: method, full path (including mount prefixes), auth/middleware
requirement, path and query params, request body shape, response shape, notable status
codes. Auth is the field readers most often need and most often missing — if a route is
public in an otherwise-authenticated service, that deserves a callout.

## GraphQL, gRPC, WebSocket, queues

- **GraphQL** — find `.graphql`/`.gql` files or `typeDefs`. Report top-level Query,
  Mutation, and Subscription fields with arguments; the type graph beneath is detail.
- **gRPC** — `.proto` files are the whole answer. List services and their RPCs with
  request/response messages, and note streaming direction.
- **WebSocket / SSE** — grep for `socket.on(`, `WebSocket`, `EventSource`, `text/event-stream`.
  Document the message/event names and payloads; these are undocumented far more often
  than REST routes.
- **Queues / events** — grep for consumer registrations (`@Consumer`, `subscribe(`,
  `consume(`, Celery `@task`, Sidekiq workers). Report queue/topic names, payload shape,
  and who produces them. Async entry points are entry points.

## CLI tools

| Stack | Recipe |
|---|---|
| Python argparse/click/typer | `grep -rn "add_argument\|@click.option\|@click.command\|typer.Option" .` |
| Node commander/yargs/oclif | `grep -rn "\.command(\|\.option(\|\.positional(" .` |
| Go cobra/flag | `grep -rn "cobra.Command\|flag\.\(String\|Int\|Bool\)" .` |
| Rust clap | `grep -rn "#\[derive(Parser)\]\|#\[arg(\|Command::new" src` |
| Shell | read the `case` in the arg-parsing loop and any `usage()` function |

Running `--help` on each subcommand is the fastest and most accurate route when the tool
is safe to execute. Prefer it, but check what the binary does first — never run a command
whose side effects you don't understand.

Produce, per command: name, purpose, positional args, flags with types and defaults,
exit codes if meaningful, and one realistic example invocation. The example is what
makes this a better `--help` than the real one.

## Libraries and packages

The public surface is whatever the manifest exports, not everything defined. Check
`exports`/`main`/`types` in `package.json`, `__all__` and package `__init__.py`,
`pub`/`pub use` in Rust, exported (capitalized) identifiers in Go, `.d.ts` files.

Report the primary entry functions/classes with signatures, the main types, and
initialization or configuration objects. Note what's exported but undocumented, and
anything that looks internal yet leaked into the public surface — that's a versioning
hazard worth naming.

## Frontend applications

The I/O surface has three parts, and reports usually miss the last two:

1. **Routes** — the pages a user can reach. React Router `<Route>` elements, file-system
   routes, Vue Router config.
2. **Outbound calls** — every backend the app talks to. `grep -rn "fetch(\|axios\.\|useQuery(\|useSWR("`.
   Group by API base URL; this reveals the service dependencies at a glance.
3. **Build-time environment** — `VITE_*`, `NEXT_PUBLIC_*`, `REACT_APP_*`. These are
   baked into the bundle and are the usual cause of "works locally, breaks deployed".

Also worth a line: auth flow entry (login route, session/token storage), and any
global state store, since that's where most cross-cutting behavior actually lives.

## Data pipelines and jobs

Entry points are schedules and triggers: cron expressions, Airflow DAGs, GitHub Actions
`on:` blocks, Kubernetes CronJobs, Lambda handlers. For each, report the trigger, the
inputs (source tables, buckets, topics), the outputs (destination tables, files,
notifications), and the failure behavior — retries, dead-letter queues, alerting.

## Infrastructure and config repos

Surface = what gets deployed and what it's parameterized by. Terraform: modules,
required variables, outputs, providers. Kubernetes/Helm: workloads, services, ingress
hostnames, configmap/secret keys. CI: workflow triggers, required secrets, deploy
targets. Required-but-undocumented variables are the highest-value finding here.

## Configuration and environment (all types)

Always cover this, whatever the project type. Sources to sweep:

```bash
ls -a | grep -iE "\.env|config|settings|\.rc$"
grep -rn "process\.env\.\|os\.environ\|os\.getenv\|std::env::var\|System\.getenv" . \
  --include=* -l | head -30
```

Cross-reference the variables actually read in code against `.env.example` / the README.
Report each as: name, purpose, required or optional, default, and whether it's a secret.
The two discrepancies to hunt for are variables read by code but absent from the example
file (breaks fresh setup) and documented variables nothing reads (misleading cruft).
Both are cheap to find and consistently appreciated.

## Data layer discovery

Four places settle almost every question about storage. Check them in this order:

1. **Dependencies** — the driver or ORM names the engine: `pg`/`psycopg`/`pgx` (Postgres),
   `mysql2`, `better-sqlite3`/`sqlite3`, `mongoose`/`pymongo`, `redis`/`ioredis`,
   `prisma`, `drizzle-orm`, `typeorm`, `sequelize`, `sqlalchemy`, `gorm`, `diesel`,
   `boto3` (DynamoDB/S3). Several at once usually means several stores, not indecision.
2. **Connection construction** — where the DSN is assembled is where the truth is:
   ```bash
   grep -rn "DATABASE_URL\|DB_HOST\|createPool\|createConnection\|new Pool(\|connect(\|create_engine\|sql.Open(" . -l | head -20
   grep -rniE "postgres(ql)?://|mysql://|mongodb(\+srv)?://|redis://|sqlite:" . | head -20
   ```
3. **Local orchestration** — `docker-compose.yml` / `compose.yaml` services are the
   dev-environment answer: image tag gives the engine and version, `ports` gives the host
   port, `environment` gives the credentials, `volumes` tells you whether data persists
   across `down`.
4. **Schema and migrations** — `find . -path ./node_modules -prune -o \( -name "*.sql" -o -name "schema.prisma" -o -path "*migrations*" -o -name "models.py" -o -name "models/*.ts" \) -print | head -30`.
   Migration directory names carry dates, so the newest file tells you how live the
   schema is.

For managed/cloud databases the host won't be in the repo — it'll be an env var filled
from a secret manager, Terraform (`aws_db_instance`, `google_sql_database_instance`), or
a Kubernetes secret. Report the mechanism and the variable name; don't hunt for the
actual credential.

Migration/inspection commands worth reporting when the tool is present: `prisma migrate
dev` / `prisma studio`, `alembic upgrade head`, `rails db:migrate`, `python manage.py
migrate`, `golang-migrate up`, `drizzle-kit push`, `knex migrate:latest`. Read the
manifest's script section first — the project often wraps these already, and the wrapper
is what the reader should run.
