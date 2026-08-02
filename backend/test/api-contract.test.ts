/**
 * Asserts that the OpenAPI document is actually enforcing the request contract.
 *
 * These are deliberately behavioural rather than redundant re-checks in the
 * handlers. The handlers trust express-openapi-validator to have already rejected
 * anything the document disallows, and that trust is only safe if something proves
 * the validator is still mounted and still refusing. Restating "eventId must be an
 * integer" inside a handler would guard one field while leaving every other
 * guarantee - unevaluatedProperties, unknown query parameters, 405, 415 - to fail
 * silently. These tests fail all at once instead, and name the real cause.
 *
 * Nothing here reaches the database: every request is rejected before a handler
 * runs, and the one that does reach a handler (POST, which is 501 until auth
 * exists) returns before querying. So these need no seeded data.
 */
import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import type { AddressInfo } from 'node:net';
import type { Server } from 'node:http';

let server: Server;
let base: string;

before(async () => {
  // createApp refuses to build without an explicit mode, and development is what
  // turns response validation on - so these run against the stricter configuration.
  process.env.NODE_ENV ??= 'development';

  const { createApp } = await import('../src/app.js');
  server = createApp().listen(0); // port 0: let the OS pick, so tests never collide
  await once(server, 'listening');
  base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
});

after(async () => {
  await new Promise<void>((resolve) => server.close(() => resolve()));
  // db/client.ts opens a connection pool at import time even though nothing here
  // queries; without this the test process would not exit.
  const { prisma } = await import('../src/db/client.js');
  await prisma.$disconnect();
});

const json = (body: unknown) => ({
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify(body),
});

const validEvent = {
  title: 'Repair Cafe',
  startsAt: '2026-09-01T17:00:00Z',
  endsAt: '2026-09-01T20:00:00Z',
};

/** Asserts the status and that the body is a problem+json document, and returns it. */
async function expectProblem(response: Response, status: number) {
  assert.equal(response.status, status);
  assert.equal(
    response.headers.get('content-type')?.split(';')[0],
    'application/problem+json',
    'errors must be problem+json - the document describes no other error media type',
  );

  const body = (await response.json()) as Record<string, unknown>;
  assert.equal(body.status, status, 'the status member must agree with the HTTP status');
  assert.equal(typeof body.title, 'string');
  assert.equal(typeof body.detail, 'string');
  return body;
}

test('a path parameter of the wrong type is rejected', async () => {
  const body = await expectProblem(await fetch(`${base}/v1/events/abc`), 400);
  assert.match(String(body.detail), /eventId/);
});

test('a server-assigned field cannot be smuggled into a create', async () => {
  // The guarantee that EventCreate's unevaluatedProperties: false provides. If this
  // regresses, a client can choose which user owns an event it created.
  const response = await fetch(`${base}/v1/events`, json({ ...validEvent, ownerId: 9 }));
  const body = await expectProblem(response, 400);
  assert.match(String(body.detail), /unevaluated properties/i);

  const errors = body.errors as { pointer: string }[];
  assert.ok(Array.isArray(errors) && errors.length > 0, 'field-level failures carry an errors array');
  assert.equal(errors[0]!.pointer, '/body/ownerId', 'the pointer names the offending field');
});

test('an undeclared query parameter is rejected', async () => {
  const body = await expectProblem(await fetch(`${base}/v1/events?bogus=1`), 400);
  assert.match(String(body.detail), /bogus/);
});

test('a path outside the document is a problem+json 404', async () => {
  await expectProblem(await fetch(`${base}/v1/nope`), 404);
});

test('a method the document does not describe is a 405', async () => {
  await expectProblem(await fetch(`${base}/v1/events`, { method: 'DELETE' }), 405);
});

test('a request body that is not JSON is a 415', async () => {
  const response = await fetch(`${base}/v1/events`, {
    method: 'POST',
    headers: { 'content-type': 'text/plain' },
    body: 'hi',
  });
  await expectProblem(response, 415);
});

test('a valid create is accepted by the document and refused by the handler', async () => {
  // Pins the deliberate gap: the body passes validation, so this 501 is the handler
  // declining to invent an owner rather than the document rejecting the request.
  // When auth lands this becomes a 201 and this test should be rewritten, not deleted.
  const body = await expectProblem(await fetch(`${base}/v1/events`, json(validEvent)), 501);
  assert.match(String(body.detail), /authentication/i);
});

test('routes outside the document are not intercepted by the validator', async () => {
  // /users is mounted before the validator precisely so it stays reachable while
  // absent from the spec. If that order is reversed the validator answers 404,
  // because the document does not describe /users.
  //
  // Only 404 is excluded rather than asserting 200: this endpoint does query the
  // database, so an unseeded checkout should not fail the ordering check.
  const response = await fetch(`${base}/users/count`);
  assert.notEqual(response.status, 404, '/users must not be swallowed by the validator');
});
