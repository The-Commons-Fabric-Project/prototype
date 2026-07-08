import express from 'express'
import { requestLoggingMiddleware } from './middleware/logging';
import path from 'path'
import cors from 'cors'

/**
 * App factory for initializing middleware, setting CORS policy and establishing routes
 * 
 * @returns 
 */
export function createApp() {
  const app = express();

  app.use(express.json());
  app.use(requestLoggingMiddleware);

  if (process.env.NODE_ENV === 'development') {
    const corsOrigin = process.env.CORS_ORIGIN === 'network'
      ? true // allows any local device from any port
      : (process.env.CORS_ORIGIN || 'http://localhost:5173');
    app.use(cors({ origin: corsOrigin, credentials: true }));
  } else if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../../frontend/dist')));
    app.get('/{*splat}', (_req, res) => {
      res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
    });
  } else {
    throw new Error("[SERVER] NODE_ENV not set, should be set to either: 'production' or 'development'");
  }

  // route assignment


  return app;
}
