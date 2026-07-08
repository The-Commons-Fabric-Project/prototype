import { createApp } from './app.js';

async function main() {
  const app = createApp();
  const PORT = process.env.PORT || 3000;

  const server = app.listen(PORT, () => {
    console.log(`[SERVER] Commons Fabric backend running on http://localhost:${PORT}`);
  })

  // Shutdown handler logic - when running project in development mode tsx will spawn multiple child processes for watching/restarting the server
  // These child processes are not shutdown properly during manual shutdown (for whatever reason) and are only killed after the parent processes is killed
  // The shutdown handler prevents this by shutting down immediately after a SIGINT or SIGTERM is detected - not waiting for tsx
  // Not needed in production since tsx will not be used but it can't hurt  
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
