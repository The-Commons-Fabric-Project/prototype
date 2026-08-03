// Backend (Node + Express + TypeScript) ESLint flat config.
// Layers Node globals on top of the shared monorepo base.
import globals from 'globals'
import tseslint from 'typescript-eslint'

import { baseConfig, sharedIgnores } from '@prototype/eslint-config'

export default tseslint.config(
  // Prisma's generated client and the local SQLite dev database are not source we lint.
  { ignores: [...sharedIgnores, 'src/generated/**', '**/*.db'] },

  ...baseConfig,
  {
    // Everything here runs on Node: the TypeScript sources, this config, and the
    // plain-ESM build scripts under scripts/. Without .mjs/.js in this list those
    // scripts are linted with no Node globals, so `console` reads as undefined.
    files: ['**/*.ts', '**/*.mjs', '**/*.js'],
    languageOptions: {
      globals: globals.node,
      sourceType: 'module',
    },
  },
)
