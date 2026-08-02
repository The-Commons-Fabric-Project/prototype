/**
 * Errors that carry an HTTP status, shaped like the ones express-openapi-validator
 * throws so that one error handler can format both.
 *
 * The validator's errors expose `status`, `name`, `message` and an optional
 * `errors: [{ path, message }]`; matching that shape here means
 * middleware/problemDetails.ts never has to ask where an error came from.
 */
export class HttpProblem extends Error {
  readonly status: number;
  readonly errors?: { path: string; message: string }[];

  constructor(status: number, title: string, detail: string, errors?: { path: string; message: string }[]) {
    super(detail);
    this.name = title;
    this.status = status;
    this.errors = errors;
  }
}

/** The requested resource does not exist. */
export const notFound = (detail: string) => new HttpProblem(404, 'Not Found', detail);

/**
 * The request was well-formed but violates a rule the schema cannot express -
 * `endsAt > startsAt`, for instance. `pointer` mirrors the validator's own
 * convention (`/query/endDate`, `/body/startsAt`) so clients can treat every 400
 * the same way.
 */
export const badRequest = (detail: string, pointer?: string) =>
  new HttpProblem(400, 'Bad Request', detail, pointer ? [{ path: pointer, message: detail }] : undefined);

/** Documented in the spec but not built yet. */
export const notImplemented = (detail: string) => new HttpProblem(501, 'Not Implemented', detail);
