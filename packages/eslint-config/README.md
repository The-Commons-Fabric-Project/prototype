# @prototype/eslint-config

Shared ESLint 9+ flat-config base for the monorepo workspaces.

Each workspace keeps its own `eslint.config.js` and layers environment-specific config
on top of what this package exports — browser and React rules for the frontend, Node
globals for the backend. Only genuinely cross-cutting rules and ignores belong here.

## Exports

| Export          | What it is                                                              |
| --------------- | ----------------------------------------------------------------------- |
| `baseConfig`    | ESLint's recommended JS rules plus typescript-eslint's recommended set.  |
| `sharedIgnores` | Build outputs and generated trees nothing should ever lint.             |
| default         | `sharedIgnores` + `baseConfig`, ready to use as-is. Used by the root config. |

## Usage

```js
// backend/eslint.config.js
import globals from 'globals'
import tseslint from 'typescript-eslint'

import { baseConfig, sharedIgnores } from '@prototype/eslint-config'

export default tseslint.config(
  { ignores: [...sharedIgnores, 'src/generated/**'] },
  ...baseConfig,
  {
    files: ['**/*.ts'],
    languageOptions: { globals: globals.node },
  },
)
```

A workspace composing configs this way imports `typescript-eslint` and `globals`
directly, so it declares both itself. This package only supplies what *it* imports.

## Dependencies

`@eslint/js` and `typescript-eslint` are regular `dependencies`, so consumers get the
plugins without restating them.

`eslint` is a `peerDependency` on purpose. Each workspace runs `eslint .` from its own
`lint` script, so the binary has to resolve inside that workspace — which means the
workspace declares `eslint` itself rather than borrowing this package's copy.

## Changing the shared rules

Anything added here applies to every workspace at once, so prefer a workspace's own
config for rules that are not truly cross-cutting. After changing this file, run
`npm run lint` from the repo root to lint all workspaces together.
