import type { ErrorRequestHandler, Request } from 'express';

import { HttpProblem } from '../utils/problems.js';

/**
 * Formats every error as RFC 9457 problem details, the only error shape the
 * OpenAPI document describes.
 *
 * express-openapi-validator does not write an error body of its own - it throws
 * typed errors and leaves the response to us. Without this handler Express falls
 * back to its default renderer, which answers with an HTML page containing a stack
 * trace, so this is what stops internals leaking on any validation failure.
 *
 * Errors arrive here with `status`, `name`, `message` and sometimes
 * `errors: [{ path, message }]` - either from the validator or from
 * utils/problems.ts, which deliberately mirrors that shape.
 */

/** Fallbacks for errors that reach us without a usable `name`. */
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
  // Streaming already started - Express' default handler is the only thing that can
  // salvage this, and it will destroy the connection.
  if (res.headersSent) {
    next(err);
    return;
  }

  const status = statusOf(err);
  const message = err instanceof Error ? err.message : String(err);

  // An HttpProblem was raised deliberately, so its message was written to be read by
  // a caller and is safe to send at any status - a 501 explaining that an endpoint
  // needs auth is far more use than a bare "Not Implemented". Anything else at 5xx
  // is a failure we did not anticipate: log it, but answer generically, because
  // `detail` and the field errors can carry schema paths and internal messages
  // (response-validation failures arrive here as 500s).
  const isDeliberate = err instanceof HttpProblem;

  if (status >= 500) {
    console.error(`[SERVER] ${req.method} ${req.originalUrl} failed:`, err);
  }

  // For 5xx the error's own name is withheld too: a PrismaClientKnownRequestError
  // in `title` tells a caller which ORM we use and nothing they can act on.
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
