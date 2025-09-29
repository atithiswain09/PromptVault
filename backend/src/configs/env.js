const { config } = require("dotenv");
config();

const _config = {
  MONGODB_URI: process.env.MONGODB_URI,
  PORT: Number(process.env.PORT || "3000"),
  JWT_SECRET: process.env.JWT_SECRET
};

const ENV_DEV = process.env.NODE_ENV == "development";
const ENV = ENV_DEV ? _config : Object.freeze(_config);

module.exports = { ENV };
