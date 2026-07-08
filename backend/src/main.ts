import { createApp } from './app.js';

async function main() {
  const app = createApp();
  const PORT = process.env.PORT || 3000;

  const server = app.listen(PORT, () => {
    console.log(`[SERVER] Commons Fabric backend running on http://localhost:${PORT}`);
  })

  const shutdown = () => {
    server.close(() => process.exit(0));
  };
  
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main().catch((err) => {
  console.error("[SERVER] Fatal startup error: ", err);
  process.exit(1);
})
