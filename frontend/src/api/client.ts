/**
 * The single place the frontend talks to the backend.
 *
 * Paths are relative to /v1, never absolute: in production the backend serves
 * this build from its own origin, and in development vite.config.ts proxies /v1
 * to it. Same-origin in both, so the session cookie travels on its own and there
 * is no CORS to configure.
 *
 * The cookie is httpOnly, so nothing here reads or attaches it - the browser
 * does. That is also why there is no token to store: session state is
 * established by asking the server who we are (see auth.getProfile).
 */

/** Path prefix. Also the document's server URL - see backend/src/docs/api/openapi.yaml. */
const BASE = '/v1';

/** One field-level failure from the API's RFC 9457 `errors` extension. */
export interface FieldError {
  pointer: string;
  detail: string;
}

/**
 * A non-2xx response, carrying the problem details the API returned.
 *
 * Every backend error is `application/problem+json`, so `detail` is written to
 * be read by a person and is safe to surface in the UI. `status` is what callers
 * should branch on - 401 in particular, which means "not signed in" rather than
 * "something broke".
 */
export class ApiError extends Error {
  readonly status: number;
  readonly title: string;
  readonly detail: string;
  readonly errors: FieldError[];

  constructor(status: number, title: string, detail: string, errors: FieldError[] = []) {
    super(detail || title);
    this.name = 'ApiError';
    this.status = status;
    this.title = title;
    this.detail = detail;
    this.errors = errors;
  }

  /** True when the request failed because there is no valid session. */
  get isUnauthorized() {
    return this.status === 401;
  }
}

/** Shape of the problem+json body the API returns for every error. */
interface ProblemBody {
  title?: string;
  status?: number;
  detail?: string;
  errors?: FieldError[];
}

/**
 * Turns a failed response into an ApiError.
 *
 * A body is expected but not required: a proxy or a crash upstream of the app
 * can produce an error that never passed through the API's own handler, and that
 * still has to arrive as an ApiError rather than a parse exception.
 */
async function toApiError(response: Response): Promise<ApiError> {
  let problem: ProblemBody = {};
  try {
    const text = await response.text();
    if (text) problem = JSON.parse(text) as ProblemBody;
  } catch {
    // Not JSON. Fall through to the status-derived message below.
  }

  return new ApiError(
    response.status,
    problem.title || response.statusText || 'Request failed',
    problem.detail || `The server responded with ${response.status}.`,
    problem.errors ?? [],
  );
}

/**
 * Sends a request and returns the parsed body, throwing ApiError on any non-2xx.
 *
 * `credentials: 'include'` is belt and braces: same-origin requests would send
 * the cookie anyway, but this keeps auth working if VITE_API_TARGET ever points
 * somewhere else.
 */
export async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${BASE}${path}`, {
      ...init,
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        ...(init.body ? { 'Content-Type': 'application/json' } : {}),
        ...init.headers,
      },
    });
  } catch (cause) {
    // fetch only rejects when the request never got an answer - the backend is
    // down, or the dev proxy has nothing to talk to. Status 0 marks "no response"
    // so callers can tell it apart from a 500.
    throw new ApiError(0, 'Network error', 'Could not reach the server. Is the backend running?', [
      { pointer: '', detail: String(cause) },
    ]);
  }

  if (!response.ok) throw await toApiError(response);

  // 204, or any response the caller expects nothing from.
  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return undefined as T;
  }
  return (await response.json()) as T;
}

/** POST with a JSON body. */
export const post = <T>(path: string, body?: unknown) =>
  request<T>(path, { method: 'POST', body: body === undefined ? undefined : JSON.stringify(body) });

/** GET. */
export const get = <T>(path: string) => request<T>(path, { method: 'GET' });
