// Shared ESLint 9+ flat-config base for the monorepo.
//
// Each workspace (frontend, backend) has its own `eslint.config.js` that imports
// `baseConfig` from here and layers on environment-specific config (browser + React
// for frontend, Node for backend). Keep only truly cross-cutting rules and ignores
// in this file.
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
