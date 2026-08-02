import express from 'express'
import { requestLoggingMiddleware } from './middleware/logging.js';
import { openApiValidator } from './middleware/openapi.js';
import { problemDetails } from './middleware/problemDetails.js';
import { usersRouter } from './endpoints/users.js';
import { eventsRouter } from './endpoints/events.js';
import { organizationsRouter } from './endpoints/organizations.js';
import { authRouter } from './endpoints/auth/index.js';
import path from 'path'
import cors from 'cors'

/**
 * App factory for initializing middleware, setting CORS policy and establishing routes
 *
 * Registration order matters and is not arbitrary:
 *
 *   1. body parsing and logging, which everything downstream depends on
 *   2. routers, so a real endpoint always wins over the SPA fallback
 *   3. the production static and catch-all handlers, which answer whatever is left
 *   4. the error handler, which must be last to see errors from all of the above
 *
 * The catch-all used to sit above the routers, so in production every GET was
 * answered with index.html before any router saw it.
 *
 * @returns
 */
export function createApp() {
  const app = express();
  const isDevelopment = process.env.NODE_ENV === 'development';

  if (!isDevelopment && process.env.NODE_ENV !== 'production') {
    throw new Error("[SERVER] NODE_ENV not set, should be set to either: 'production' or 'development'");
  }

  app.use(express.json());
  app.use(requestLoggingMiddleware);

  if (isDevelopment) {
    const corsOrigin = process.env.CORS_ORIGIN === 'network'
      ? true // allows any local device from any port
      : (process.env.CORS_ORIGIN || 'http://localhost:5173');
    app.use(cors({ origin: corsOrigin, credentials: true }));
  }

  // route assignment
  //
  // /users is mounted before the validator on purpose: it is not described in
  // openapi.yaml, and the validator refuses paths its document does not contain.
  app.use('/users', usersRouter);

  // Everything below is validated against src/docs/api/openapi.yaml. That document's
  // server URL ends in /v1, which is where the validator expects these to live.
  app.use(openApiValidator(isDevelopment));
  app.use('/v1', authRouter);
  app.use('/v1', eventsRouter);
  app.use('/v1', organizationsRouter);

  if (!isDevelopment) {
    // Serves the built vite project. Registered after the routers so a request that
    // matches a real endpoint is never swallowed by the SPA fallback.
    app.use(express.static(path.join(__dirname, '../../frontend/dist')));
    app.get('/{*splat}', (_req, res) => {
      res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
    });
  }

  // Last, so it sees errors from the routers and the validator alike.
  app.use(problemDetails);

  return app;
}
