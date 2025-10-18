const { ENV } = require("./src/configs/env");
const { log, error } = require("console");

const { createServer } = require("http");
const connectDB = require("./src/database");

// A function which handles all main server operations
async function main() {
  const app = require("./src/app"); // imports app as express server
  const server = createServer(app); // creates http server
  const PORT = ENV.PORT;

  await connectDB(); // creates connection to database
  server.listen(PORT, () => log("server is running on port: ", PORT)); 
}

main().catch((err) => {
  error("Startup error", err);
  process.exit(1); // exits process, if server got error
});
