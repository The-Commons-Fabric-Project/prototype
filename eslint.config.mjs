// Root ESLint flat config, for repo-level files that live outside any workspace.
//
// The rules themselves live in the @prototype/eslint-config workspace; this file
// only re-exports its ready-made config so editors have something to resolve at the
// repo root. `npm run lint` does not use it - that delegates to each workspace's own
// eslint.config.js.
export { default } from '@prototype/eslint-config'
