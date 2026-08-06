import type { ErrorRequestHandler, Request } from 'express';

import { HttpProblem } from '../utils/problems.js';

/**
 * Formats every error as RFC 9457 problem details.
 *
 * express-openapi-validator writes no error body of its own, and Express' default
 * renderer would answer with an HTML stack trace - so this is what stops internals
 * leaking on a validation failure.
 *
 * Errors arrive with `status`, `name`, `message` and sometimes
 * `errors: [{ path, message }]`, from the validator or from utils/problems.ts.
 */

/** Fallbacks for errors without a usable `name`. */
const TITLES: Record<number, string> = {
  400: 'Bad Request',
  404: 'Not Found',
  405: 'Method Not Allowed',
  415: 'Unsupported Media Type',
  500: 'Internal Server Error',
  501: 'Not Implemented',
};

interface ProblemBody {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
  errors?: { pointer: string; detail: string }[];
}

const statusOf = (err: unknown): number => {
  const status = (err as { status?: unknown })?.status;
  return typeof status === 'number' && status >= 400 && status <= 599 ? status : 500;
};

const fieldErrorsOf = (err: unknown): { path: string; message: string }[] => {
  const errors = (err as { errors?: unknown })?.errors;
  return Array.isArray(errors) ? (errors as { path: string; message: string }[]) : [];
};

export const problemDetails: ErrorRequestHandler = (err, req: Request, res, next) => {
  // Streaming already started; only Express' default handler can salvage this.
  if (res.headersSent) {
    next(err);
    return;
  }

  const status = statusOf(err);
  const message = err instanceof Error ? err.message : String(err);

  // Raised deliberately by the server, so its message is safe to send as-is.
  const isDeliberate = err instanceof HttpProblem;

  // Only unanticipated failures are logged as errors.
  if (status >= 500 && !isDeliberate) {
    console.error(`[SERVER] ${req.method} ${req.originalUrl} failed:`, err);
  }

  // The error's own name is withheld at 5xx too - a PrismaClientKnownRequestError
  // in `title` names the ORM and nothing the caller can act on.
  const name = (err as { name?: string })?.name;
  const withheld = status >= 500 && !isDeliberate;
  const body: ProblemBody = {
    type: 'about:blank',
    title: withheld ? (TITLES[status] ?? 'Error') : name && name !== 'Error' ? name : (TITLES[status] ?? 'Error'),
    status,
    detail: withheld ? (TITLES[status] ?? 'The server failed to handle this request.') : message,
    instance: req.originalUrl,
  };

  const fieldErrors = fieldErrorsOf(err);
  if (!withheld && fieldErrors.length > 0) {
    body.errors = fieldErrors.map((error) => ({ pointer: error.path, detail: error.message }));
  }

  res.status(status).type('application/problem+json').json(body);
};
