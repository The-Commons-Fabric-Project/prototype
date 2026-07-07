import express from 'express'
import { requestLoggingMiddleware } from './middleware/logging';
import path from 'path'
import cors from 'cors'

async function main() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());
  app.use(requestLoggingMiddleware);

  if (process.env.NODE_ENV === 'development') {
    const corsOrigin = process.env.CORS_ORIGIN === 'network'
      ? true // allows any local device from any port
      : (process.env.CORS_ORIGIN || 'http://localhost:5173');
    app.use(cors({ origin: corsOrigin, credentials: true }));
  }

  // In production: serve the built Vite frontend
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../../frontend/dist')));
    app.get('/{*splat}', (_req, res) => {
      res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`[SERVER] Commons Fabric backend running on http://localhost:${PORT}`);
  })
}

main().catch((err) => {
  console.error("[SERVER] Fatal startup error: ", err);
  process.exit(1);
})