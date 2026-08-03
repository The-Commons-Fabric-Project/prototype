# @prototype/typescript-config

Shared TypeScript compiler options for the monorepo workspaces.

Each workspace extends one of these presets by name and adds only what is genuinely
its own — `outDir`, `include`, `lib`, `jsx` and so on. Nothing here is reachable by
relative path, so a workspace stays self-contained: it declares this package as a
devDependency and never reads a file outside its own directory.

| Preset      | Extends     | For                                                            |
| ----------- | ----------- | -------------------------------------------------------------- |
| `base.json` | –           | Options every workspace shares. Not meant to be extended directly. |
| `node.json` | `base.json` | Workspaces that emit real files and run on Node (the backend).  |
| `vite.json` | `base.json` | Bundler mode: type-checking only, with Vite doing the emit.     |

`vite.json` is shared by the frontend's two projects (`tsconfig.app.json` and
`tsconfig.node.json`), which previously duplicated a dozen identical options between
them and could drift apart silently.

## Why there are no comments in these files

TypeScript parses config files as JSONC, so comments would work as far as `tsc` is
concerned. Editors do not: VS Code selects JSONC by filename, and only `tsconfig.json`
and `jsconfig.json` qualify. A file named `base.json` is checked as strict JSON, so
comments there are reported as errors and `JSON.parse` fails on them outright. Keep
these files valid strict JSON and document them here instead.

## Usage

```jsonc
// backend/tsconfig.json
{
  "extends": "@prototype/typescript-config/node.json",
  "compilerOptions": { "outDir": "dist", "rootDir": "src" },
  "include": ["src"]
}
```

Adding a preset means adding the file here and listing it in this package's
`exports`, which is what makes `@prototype/typescript-config/<name>.json` resolvable.
