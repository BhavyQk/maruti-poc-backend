import fs from "fs/promises";
import path from "path";
import { config } from "../config";
import type { LogChunkData } from "../types";

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

export async function resolveLogFilePath(filename?: string): Promise<string> {
  if (filename) {
    const filePath = resolveLogPath(filename);
    try {
      await fs.access(filePath);
    } catch {
      throw new Error(`Log file not found: ${filename}`);
    }
    return filePath;
  }

  const filePaths = await getLogFilePaths();
  if (filePaths.length === 0) {
    throw new Error("No .log files found in data folder");
  }
  return filePaths[0];
}

function trimToValidUtf8(buffer: Buffer): Buffer {
  let end = buffer.length;
  while (end > 0 && (buffer[end - 1] & 0xc0) === 0x80) {
    end--;
  }
  return buffer.subarray(0, end);
}

export async function getLogChunk(
  filePath: string,
  chunkIndex: number
): Promise<LogChunkData> {
  const stats = await fs.stat(filePath);
  const totalBytes = stats.size;
  const chunkSize = config.maxChunkSize;
  const totalChunks = Math.max(1, Math.ceil(totalBytes / chunkSize));

  if (chunkIndex < 0 || chunkIndex >= totalChunks) {
    throw new Error(`Chunk ${chunkIndex} out of range. Valid range: 0-${totalChunks - 1}`);
  }

  const offset = chunkIndex * chunkSize;
  const length = Math.min(chunkSize, totalBytes - offset);
  const hasMore = chunkIndex < totalChunks - 1;

  const handle = await fs.open(filePath, "r");
  try {
    const buffer = Buffer.alloc(length);
    const { bytesRead } = await handle.read(buffer, 0, length, offset);
    let chunkBuffer: Buffer = buffer.subarray(0, bytesRead);

    if (hasMore && bytesRead === chunkSize) {
      chunkBuffer = Buffer.from(trimToValidUtf8(chunkBuffer));
    }

    return {
      chunk: chunkIndex,
      hasMore,
      data: chunkBuffer.toString("utf-8"),
    };
  } finally {
    await handle.close();
  }
}
