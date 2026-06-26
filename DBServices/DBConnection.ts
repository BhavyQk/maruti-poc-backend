import { Sequelize } from "sequelize-typescript";
import * as pg from "pg";

// Connection pool idle timeout (ms) before a connection is released.
const DB_POOL = { IDLE: 10000 };

let sequelize: Sequelize | null = null;
const connection: { isConnected: boolean } = { isConnected: false };

// Initialize Sequelize instance lazily (after env vars are loaded)
const initializeSequelize = (): Sequelize => {
  if (!sequelize) {
    const databaseUrl = process.env.DATABASE_URL;
    const commonOpts = {
      dialect: "postgres" as const,
      pool: { max: 5, min: 0, idle: DB_POOL.IDLE },
      dialectModule: pg,
      logQueryParameters: true,
      dialectOptions: {
        ssl: { require: true, rejectUnauthorized: false },
      },
    };

    if (databaseUrl) {
      // Railway / Render / Neon all expose a single DATABASE_URL
      console.info("Initializing Sequelize from DATABASE_URL");
      sequelize = new Sequelize(databaseUrl, commonOpts);
      return sequelize;
    }

    const dbName = process.env.DB_NAME;
    const dbUser = process.env.DB_USER;
    const dbPassword = process.env.DB_PASSWORD;
    const dbHost = process.env.DB_HOST;
    const dbPort = process.env.DB_PORT;

    console.info("Initializing Sequelize with discrete vars:", {
      DB_NAME: dbName,
      DB_USER: dbUser,
      DB_HOST: dbHost,
      DB_PORT: dbPort,
      DB_PASSWORD: dbPassword ? "***" : "NOT SET",
    });

    if (!dbName || !dbUser || !dbHost || !dbPort) {
      throw new Error(
        "Missing database env vars: set DATABASE_URL or DB_HOST/DB_PORT/DB_NAME/DB_USER/DB_PASSWORD.",
      );
    }

    sequelize = new Sequelize(dbName, dbUser, dbPassword, {
      ...commonOpts,
      host: dbHost,
      port: Number(dbPort),
    });
  }
  return sequelize;
};

export default class DBServices {
  public getSequelizeInstance(): Sequelize {
    try {
      return initializeSequelize();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async createDBConnection() {
    try {
      console.info("DB Connection Function");
      if (connection.isConnected) {
        console.info("Using Existing Connection");
        return;
      }
      const sequelizeInstance = this.getSequelizeInstance();
      await sequelizeInstance.authenticate();
      connection.isConnected = true;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
