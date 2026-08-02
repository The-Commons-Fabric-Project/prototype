import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import * as OpenApiValidator from 'express-openapi-validator';

/**
 * Wires src/docs/api/openapi.yaml into the request pipeline.
 *
 * The document is the contract, so validation is driven from it rather than
 * restated in the handlers: query and path parameters are type-checked and
 * coerced, request bodies are checked against EventCreate (whose
 * `unevaluatedProperties: false` is what rejects a smuggled ownerId), and paths
 * or methods the document does not describe are refused before any handler runs.
 *
 * The validator writes no error body of its own - failures are thrown and land in
 * middleware/problemDetails.ts.
 */

const moduleDir = path.dirname(fileURLToPath(import.meta.url));

/**
 * `tsc` compiles TypeScript and copies nothing else, so the YAML never lands in
 * dist/. Prefer a copy sitting next to the compiled output if a build ever starts
 * producing one, and otherwise read the source document, which is where it lives
 * both under tsx in development and under node dist/ today.
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

    // Loud in development so a handler that forgets to resolve organizationId fails
    // immediately. In production the same violation is logged rather than thrown:
    // responses are validated per row, so one organization with a malformed contact
    // would otherwise turn the whole event list into a 500 for every visitor.
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
