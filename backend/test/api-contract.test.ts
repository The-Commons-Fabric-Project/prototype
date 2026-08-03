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
 * queries it. The create tests stop at the auth gate or at the interval check,
 * both of which run before the insert, so these need no seeded data. The happy
 * path of POST /events is the one thing they therefore cannot cover.
 */
import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import type { AddressInfo } from 'node:net';
import type { Server } from 'node:http';

let server: Server;
let base: string;
/** A Cookie header carrying a session for a user who need not exist - see sessionFor. */
let session: string;

before(async () => {
  // createApp refuses to build without an explicit mode, and development is what
  // turns response validation on - so these run against the stricter configuration.
  process.env.NODE_ENV ??= 'development';
  // `npm test` runs without --env-file, so nothing has loaded .env. Signing refuses
  // to fall back to a default secret, which is the point - supply one for the run.
  process.env.SESSION_SECRET ??= 'test-secret-not-used-outside-this-process';

  const { createApp } = await import('../src/app.js');
  const { SESSION_COOKIE_NAME, signSessionToken } = await import('../src/utils/userSessions.js');

  // Signed with the same secret the server verifies against, so this is a genuine
  // session rather than a stub. The userId is never dereferenced: every test using
  // it is answered before the insert that would need the row to exist.
  session = `${SESSION_COOKIE_NAME}=${signSessionToken({ userId: 1 })}`;

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

/**
 * A JSON POST, optionally signed in.
 *
 * Most of these assert something about body or parameter validation, and the
 * validator checks security first - so without a cookie they would all be
 * answered 401 before reaching the rule under test.
 */
const json = (body: unknown, cookie?: string) => ({
  method: 'POST',
  headers: { 'content-type': 'application/json', ...(cookie ? { cookie } : {}) },
  body: JSON.stringify(body),
});

const validEvent = {
  title: 'Repair Cafe',
  startsAt: '2026-09-01T17:00:00Z',
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
  const response = await fetch(`${base}/v1/events`, json({ ...validEvent, ownerId: 9 }, session));
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

test('a timestamp with unencoded colons is accepted', async () => {
  // The validator rejects reserved characters in a query value unless the parameter
  // sets allowReserved, and every RFC 3339 timestamp contains colons - so without it
  // the calendar's own request is a 400 unless the client writes %3A. Both windows
  // here are inverted on purpose: that is refused by the handler, after the
  // validator has passed the value through, and before anything reaches the
  // database. So the assertion is about which 400 comes back, not whether one does.
  const window = (start: string, end: string) => `${base}/v1/events?startDate=${start}&endDate=${end}`;

  const raw = await expectProblem(await fetch(window('2026-12-01T00:00:00Z', '2026-08-01T00:00:00Z')), 400);
  assert.match(String(raw.detail), /endDate must be later/, 'a raw colon must reach the handler, not be refused as unencoded');

  // Percent-encoded values must keep working - allowReserved permits, it does not require.
  const encoded = await expectProblem(
    await fetch(window(encodeURIComponent('2026-12-01T00:00:00Z'), encodeURIComponent('2026-08-01T00:00:00Z'))),
    400,
  );
  assert.match(String(encoded.detail), /endDate must be later/);
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
    headers: { 'content-type': 'text/plain', cookie: session },
    body: 'hi',
  });
  await expectProblem(response, 415);
});

test('a create with no session cookie is refused by the document', async () => {
  // The outer of the two auth layers: cookieAuth in the document, enforced by the
  // validator, which only asks whether a session cookie is there at all.
  const body = await expectProblem(await fetch(`${base}/v1/events`, json(validEvent)), 401);
  assert.match(String(body.detail), /cookie/i);
});

test('a create with a forged session is refused by the handler', async () => {
  // The inner layer. This cookie has the right name, so it satisfies the document
  // and gets past the validator; requireAuth then rejects it because the signature
  // does not verify. That this fails differently from the test above is the whole
  // point - neither layer is sufficient alone, so neither is redundant.
  const response = await fetch(`${base}/v1/events`, json(validEvent, 'session=not.a.real.token'));
  const body = await expectProblem(response, 401);
  assert.match(String(body.detail), /invalid or has expired/i);
});

test('the auth gate runs ahead of body validation', async () => {
  // No session and a body the document also rejects: the answer is 401, and says
  // nothing about the body. This is ordering inside the validator - security is
  // checked before the request - and it is the behaviour we want: an anonymous
  // caller cannot use validation errors to probe the schema. The cost is that a
  // 401 can hide a body that would have failed too, which is why every test above
  // that targets body validation sends a session.
  const body = await expectProblem(await fetch(`${base}/v1/events`, json({ ...validEvent, ownerId: 9 })), 401);
  assert.doesNotMatch(String(body.detail), /ownerId|unevaluated/i, 'an unauthenticated 401 must not describe the body');
});

test('an event may no longer carry an end time', async () => {
  // endsAt was removed from the schema, the database and the document. Sending it
  // is now an unknown property rather than a second timestamp, so the same
  // unevaluatedProperties rule that blocks a smuggled ownerId rejects it. This
  // guards against the field creeping back in through one layer only.
  const response = await fetch(
    `${base}/v1/events`,
    json({ ...validEvent, endsAt: '2026-09-01T20:00:00Z' }, session),
  );
  const body = await expectProblem(response, 400);

  const errors = body.errors as { pointer: string }[];
  assert.equal(errors[0]!.pointer, '/body/endsAt', 'the pointer names the offending field');
});

test('an inverted query window is refused', async () => {
  // The one remaining rule JSON Schema cannot express. It constrains the query
  // window, not the event - which has no end to compare against.
  const body = await expectProblem(
    await fetch(`${base}/v1/events?startDate=2026-12-01T00:00:00Z&endDate=2026-08-01T00:00:00Z`),
    400,
  );
  assert.match(String(body.detail), /endDate must be later/);

  const errors = body.errors as { pointer: string }[];
  assert.equal(errors[0]!.pointer, '/query/endDate', 'the pointer names the offending parameter');
});
