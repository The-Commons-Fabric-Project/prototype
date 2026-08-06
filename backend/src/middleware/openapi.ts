import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import * as OpenApiValidator from 'express-openapi-validator';

/**
 * Wires src/docs/api/openapi.yaml into the request pipeline: parameters are
 * type-checked and coerced, bodies are checked against their schema, and
 * undocumented paths or methods are refused before any handler runs.
 *
 * Failures are thrown rather than written, and land in problemDetails.ts.
 */

const moduleDir = path.dirname(fileURLToPath(import.meta.url));

/**
 * `tsc` copies nothing but TypeScript, so the YAML never lands in dist/. Prefers a
 * copy next to the compiled output should a build ever start producing one.
 */
function resolveSpecPath(): string {
  const candidates = [
    path.join(moduleDir, '../docs/api/openapi.yaml'), // dist/docs/... if the build copies it
    path.join(moduleDir, '../../src/docs/api/openapi.yaml'), // backend/src/docs/... (dev and current prod)
  ];

  const found = candidates.find((candidate) => existsSync(candidate));
  if (!found) {
    throw new Error(`[SERVER] could not locate openapi.yaml; looked in:\n  ${candidates.join('\n  ')}`);
  }
  return found;
}

export function openApiValidator(isDevelopment: boolean) {
  return OpenApiValidator.middleware({
    apiSpec: resolveSpecPath(),
    validateRequests: true,

    // Thrown in development so a bad response fails immediately; logged in
    // production, where one malformed row would otherwise 500 the whole list.
    validateResponses: isDevelopment
      ? true
      : {
          onError: (error, body, req) => {
            console.error(`[SERVER] response for ${req.method} ${req.originalUrl} violates the spec:`, error.message);
            console.error('[SERVER] offending body:', JSON.stringify(body));
          },
        },
  });
}
