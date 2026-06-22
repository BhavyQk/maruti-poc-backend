import path from "path";
import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: Number(process.env.PORT) || 3000,
  dataFolder: path.resolve(process.env.DATA_FOLDER || "./data"),
};
