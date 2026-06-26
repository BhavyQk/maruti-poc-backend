require("dotenv").config({
  path: require("path").resolve(process.cwd(), ".env"),
});

// Prefer Railway/Render/Neon-style DATABASE_URL when present, otherwise fall back
// to discrete DB_* env vars so local dev keeps working.
const baseDialectOptions = {
  ssl: {
    require: true,
    rejectUnauthorized: false,
  },
};

function buildConfig(extraDbSuffix = "") {
  if (process.env.DATABASE_URL) {
    return {
      use_env_variable: "DATABASE_URL",
      dialect: "postgres",
      dialectModule: require("pg"),
      dialectOptions: baseDialectOptions,
    };
  }

  return {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME + extraDbSuffix,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    dialectModule: require("pg"),
    dialectOptions: baseDialectOptions,
  };
}

module.exports = {
  development: buildConfig(),
  test: buildConfig("_test"),
  production: buildConfig(),
};
