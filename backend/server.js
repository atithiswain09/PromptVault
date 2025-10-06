const { ENV } = require("./src/configs/env");
const { log, error } = require("console");

const { createServer } = require("http");
const connectDB = require("./src/database");

async function main() {
  const app = require("./src/app");
  const server = createServer(app);
  const PORT = ENV.PORT;

  const DBConnection = await connectDB();

  server.listen(PORT, () => log("server is running on port: ", PORT));

  const shutdown = async () => {
    log("graceful shutdown initiated");

    DBConnection?.close();

    server.close(() => log("HTTP server closed"));
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main().catch((err) => {
  error("Startup error", err);
  process.exit(1);
});
