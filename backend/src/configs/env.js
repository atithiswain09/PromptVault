import "dotenv/config";

const _config = {
  MONGODB_URI: process.env.MONGODB_URI,
  PORT: Number(process.env.PORT || "3000"),
};

const ENV_DEV = process.env.NODE_ENV == "development";
const ENV = ENV_DEV ? _config : Object.freeze(_config);

export { ENV };
