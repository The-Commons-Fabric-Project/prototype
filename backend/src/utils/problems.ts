/**
 * Errors that carry an HTTP status, shaped like the ones express-openapi-validator
 * throws so that one error handler can format both.
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

export const notFound = (detail: string) => new HttpProblem(404, 'Not Found', detail);

/** `pointer` follows the validator's convention (`/query/endDate`, `/body/startsAt`). */
export const badRequest = (detail: string, pointer?: string) =>
  new HttpProblem(400, 'Bad Request', detail, pointer ? [{ path: pointer, message: detail }] : undefined);

export const notImplemented = (detail: string) => new HttpProblem(501, 'Not Implemented', detail);

export const conflict = (detail: string) => new HttpProblem(409, 'Conflict', detail);

export const unauthorized = (detail: string) => new HttpProblem(401, 'Unauthorized', detail);
