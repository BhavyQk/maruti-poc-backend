import fs from "fs/promises";
import path from "path";
import { config } from "../config";

const LOG_EXTENSION = ".log";

function resolveLogPath(filename: string): string {
  const safeName = path.basename(filename);
  if (!safeName.endsWith(LOG_EXTENSION)) {
    throw new Error(`Only ${LOG_EXTENSION} files are supported`);
  }
  return path.join(config.dataFolder, safeName);
}

async function getLogFilePaths(): Promise<string[]> {
  const entries = await fs.readdir(config.dataFolder, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(LOG_EXTENSION))
    .map((entry) => path.join(config.dataFolder, entry.name))
    .sort();
}

export async function getLogContent(filename?: string): Promise<string> {
  let filePath: string;

  if (filename) {
    filePath = resolveLogPath(filename);
    try {
      await fs.access(filePath);
    } catch {
      throw new Error(`Log file not found: ${filename}`);
    }
  } else {
    const filePaths = await getLogFilePaths();
    if (filePaths.length === 0) {
      throw new Error("No .log files found in data folder");
    }
    filePath = filePaths[0];
  }

  return fs.readFile(filePath, "utf-8");
}
