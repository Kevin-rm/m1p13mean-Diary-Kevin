import "dotenv/config";
import app from "./app.js";
import logger from "./config/logger.js";
import { connectDB, disconnectDB } from "./config/database.js";
import { seedDatabase } from "./config/seed.js";

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await connectDB();
    if (process.env.ENABLE_SEED === "true") await seedDatabase();

    const server = app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });

    const shutdown = async signal => {
      logger.info(`${signal} received, shutting down gracefully`);
      server.close(async () => {
        await disconnectDB();
        process.exit(0);
      });
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
}

start();
