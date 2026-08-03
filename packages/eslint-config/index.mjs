// Shared ESLint 9+ flat-config base for the monorepo.
//
// Each workspace (frontend, backend) has its own `eslint.config.js` that imports
// `baseConfig` from here and layers on environment-specific config (browser + React
// for frontend, Node for backend). Keep only truly cross-cutting rules and ignores
// in this file.
//
// This is a real workspace package rather than a file the others reach into by
// relative path: a workspace that imports `../eslint.config.mjs` cannot be built or
// extracted on its own, and the dependencies that file needs would have to be
// declared somewhere it does not control. Depending on it by name keeps every
// workspace self-contained.
import js from '@eslint/js'
import tseslint from 'typescript-eslint'

// Build outputs and vendored/generated trees that should never be linted anywhere.
export const sharedIgnores = [
  '**/dist/**',
  '**/build/**',
  '**/coverage/**',
]

// The common rule set every workspace starts from: ESLint's recommended JS rules
// plus typescript-eslint's (non-type-checked) recommended rules.
export const baseConfig = tseslint.config(
  js.configs.recommended,
  tseslint.configs.recommended,
)

// A usable standalone config (base rules + shared ignores) for any root-level files.
export default tseslint.config(
  { ignores: sharedIgnores },
  ...baseConfig,
)
