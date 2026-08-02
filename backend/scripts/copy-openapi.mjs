/**
 * Copies src/docs/api/openapi.yaml into dist/ after a build.
 *
 * `tsc` compiles TypeScript and copies nothing else, so without this step the
 * OpenAPI document never reaches dist/ and a deployment that ships only the build
 * output cannot start - src/middleware/openapi.ts throws at boot rather than
 * serving an unvalidated API.
 *
 * The destination mirrors the source layout (dist/docs/api/openapi.yaml) so the
 * resolver finds it next to the compiled middleware.
 *
 * Node's fs is used rather than `cp` so the build does not depend on a Unix shell.
 */
import { copyFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const backendRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const source = path.join(backendRoot, 'src/docs/api/openapi.yaml');
const destination = path.join(backendRoot, 'dist/docs/api/openapi.yaml');

await mkdir(path.dirname(destination), { recursive: true });
await copyFile(source, destination);

console.log(`[BUILD] copied ${path.relative(backendRoot, source)} -> ${path.relative(backendRoot, destination)}`);
