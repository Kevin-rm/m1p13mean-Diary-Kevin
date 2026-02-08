import "dotenv/config";
import app from "./app.js";
import logger from "./config/logger.js";
import { connectDB } from "./config/database.js";
import { seedDatabase } from "./config/seed.js";

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await connectDB();
    await seedDatabase();

    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
}

start();
