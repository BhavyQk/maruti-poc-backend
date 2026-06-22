import path from "path";
import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: Number(process.env.PORT) || 3000,
  dataFolder: path.resolve(process.env.DATA_FOLDER || "./data"),
  maxResponseSize: Number(process.env.MAX_RESPONSE_SIZE) || 194800,
  // Raw bytes read per chunk; kept below maxResponseSize to fit JSON wrapper
  maxChunkSize: Number(process.env.MAX_CHUNK_SIZE) || 194800,
};
