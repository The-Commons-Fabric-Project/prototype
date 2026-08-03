# packages/

Internal workspace packages. Everything here is `private` and shared only inside this
repo — none of it is published to npm.

| Package                     | Name                           | Purpose                                    |
| --------------------------- | ------------------------------ | ------------------------------------------ |
| `eslint-config/`            | `@prototype/eslint-config`     | Shared ESLint flat-config base.            |
| `typescript-config/`        | `@prototype/typescript-config` | Shared TypeScript compiler-option presets. |

These are picked up by the `"packages/*"` entry in the root `package.json`
`workspaces` array, alongside `frontend` and `backend`.

## Why shared config lives here instead of at the repo root

A workspace that reads `../eslint.config.mjs` cannot be built, tested or extracted on
its own, and the dependencies that file needs end up declared somewhere the workspace
does not control. Depending on `@prototype/eslint-config` by name removes both
problems: nothing reaches outside its own directory, and each package declares what it
uses.

The same rule applies to dependencies generally. Every workspace declares each package
it imports **and** each binary its scripts invoke (`eslint`, `tsc`), rather than
relying on npm hoisting them up from the root. Hoisting makes undeclared dependencies
appear to work, right up until someone runs the workspace on its own or switches
package manager.

## Adding a package

1. Create `packages/<name>/` with a `package.json`:

   ```json
   {
     "name": "@prototype/<name>",
     "version": "1.0.0",
     "private": true,
     "exports": { ".": "./index.mjs" }
   }
   ```

   Declare tools the consumer runs itself (like `eslint`) as `peerDependencies`, and
   things the package imports directly as `dependencies`. Use `exports` to control what
   consumers can reach — a preset that is not listed there is not importable by name.

2. Add it to the consuming workspace's `devDependencies` as `"@prototype/<name>": "*"`.
   The `*` resolves to the local workspace rather than the npm registry.

3. Run `npm install` from the repo root to create the symlink in `node_modules/@prototype/`.

Each package has its own README covering how to consume it.
