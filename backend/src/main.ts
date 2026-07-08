import { createApp } from './app';

async function main() {
  const app = createApp();
  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`[SERVER] Commons Fabric backend running on http://localhost:${PORT}`);
  })
}

main().catch((err) => {
  console.error("[SERVER] Fatal startup error: ", err);
  process.exit(1);
})
