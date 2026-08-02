/**
 * Guards the constants derived from src/docs/db/schema.dbml against drift.
 *
 * The DBML is the source of truth, but nothing can import it, so the values it
 * declares have to be restated wherever they are enforced - in SQL, in TypeScript,
 * and in JSON Schema. This test pins the restatements that are checkable:
 *
 *   - src/models/orgTags.ts      ORG_TAGS, used by the seed and the application layer
 *   - src/models/constraints.ts  the regex CHECKs SQLite cannot run
 *   - src/docs/api/openapi.yaml  the OrganizationTag enum and the `pattern` keywords
 *
 * The CHECK in prisma/migrations/**\/migration.sql is deliberately NOT asserted.
 * Migrations are an append-only history: changing a constraint means writing a new
 * migration, not editing the old one, so pinning to the initial migration would
 * fail the first time something legitimately changes. Covering the database means
 * querying a migrated schema, which needs a provisioned DB.
 *
 * frontend/src/types/orgs.ts holds its own copies of ORG_TAGS and EMAIL_RE and is
 * NOT covered here - that copy goes away when frontend types are generated from
 * the spec.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import YAML from 'yaml';

import { EMAIL_PATTERN, URL_PATTERN } from '../src/models/constraints.js';
import { ORG_TAGS } from '../src/models/orgTags.js';

const backendRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (relative: string) => readFileSync(path.join(backendRoot, relative), 'utf8');

interface Schema {
  enum?: string[];
  pattern?: string;
  properties?: Record<string, Schema>;
}

const spec = (): Record<string, Schema> =>
  (YAML.parse(read('src/docs/api/openapi.yaml')) as { components: { schemas: Record<string, Schema> } })
    .components.schemas;

/** A named property's schema, so a failure says which field moved. */
function property(schemaName: string, propertyName: string): Schema {
  const property = spec()[schemaName]?.properties?.[propertyName];
  assert.ok(property, `components.schemas.${schemaName}.properties.${propertyName} is missing`);
  return property;
}

/** The `enum org_tags { ... }` block in the DBML, one bare identifier per line. */
function dbmlOrgTags(): string[] {
  const block = /enum\s+org_tags\s*\{([^}]*)\}/.exec(read('src/docs/db/schema.dbml'));
  assert.ok(block, 'no `enum org_tags { ... }` block found in schema.dbml');
  return block[1]!.split('\n').map((line) => line.trim()).filter(Boolean);
}

function openApiOrgTags(): string[] {
  const values = spec().OrganizationTag?.enum;
  assert.ok(values, 'components.schemas.OrganizationTag has no enum');
  return values;
}

// Membership is the contract, not declaration order, so both sides are sorted before
// comparing - reordering a list for readability should not fail the build.
const sorted = (values: readonly string[]) => [...values].sort();

test('the OpenAPI OrganizationTag enum matches schema.dbml', () => {
  assert.deepEqual(sorted(openApiOrgTags()), sorted(dbmlOrgTags()));
});

test('ORG_TAGS matches schema.dbml', () => {
  assert.deepEqual(sorted(ORG_TAGS), sorted(dbmlOrgTags()));
});

test('no source declares a duplicate tag', () => {
  for (const [name, values] of [
    ['schema.dbml', dbmlOrgTags()],
    ['openapi.yaml', openApiOrgTags()],
    ['ORG_TAGS', [...ORG_TAGS]],
  ] as const) {
    assert.equal(new Set(values).size, values.length, `${name} declares a duplicate tag`);
  }
});

test('the OpenAPI email patterns match EMAIL_PATTERN', () => {
  assert.equal(property('Organization', 'contact').pattern, EMAIL_PATTERN);
  assert.equal(property('EventCore', 'volunteerContact').pattern, EMAIL_PATTERN);
});

test('the OpenAPI URL patterns match URL_PATTERN', () => {
  assert.equal(property('Organization', 'website').pattern, URL_PATTERN);
  assert.equal(property('EventCore', 'registrationLink').pattern, URL_PATTERN);
});

test('the constraint patterns still match the CHECKs in schema.dbml', () => {
  // The DBML spells them inside `~* '...'`; the quoted body should be character-for
  // -character what the application layer and the spec use.
  const dbml = read('src/docs/db/schema.dbml');
  const checks = [...dbml.matchAll(/~\*\s*'([^']+)'/g)].map((match) => match[1]!);
  assert.ok(checks.includes(EMAIL_PATTERN), `no CHECK in schema.dbml spells ${EMAIL_PATTERN}`);
  assert.ok(checks.includes(URL_PATTERN), `no CHECK in schema.dbml spells ${URL_PATTERN}`);
});
