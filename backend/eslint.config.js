// Backend (Node + Express + TypeScript) ESLint flat config.
// Layers Node globals on top of the shared monorepo base.
import globals from 'globals'
import tseslint from 'typescript-eslint'

import { baseConfig, sharedIgnores } from '../eslint.config.mjs'

export default tseslint.config(
  // Prisma's generated client and the local SQLite dev database are not source we lint.
  { ignores: [...sharedIgnores, 'src/generated/**', '**/*.db'] },

  ...baseConfig,
  {
    files: ['**/*.ts'],
    languageOptions: {
      globals: globals.node,
      sourceType: 'module',
    },
  },
)
