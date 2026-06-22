import { createReadStream } from "fs";
import { Router, type Request, type Response } from "express";
import { resolveLogFilePath } from "../services/logService";
import type { ApiResponse } from "../types";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const filename = req.query.file ? String(req.query.file) : undefined;
    const format = req.query.format ? String(req.query.format) : "text";
    const filePath = await resolveLogFilePath(filename);

    if (format === "json") {
      const { readFile } = await import("fs/promises");
      const content = await readFile(filePath, "utf-8");
      const response: ApiResponse<string> = { success: true, data: content };
      res.json(response);
      return;
    }

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    createReadStream(filePath).pipe(res);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to read log file";
    const status = message.includes("not found") || message.includes("No .log") ? 404 : 500;
    res.status(status).json({ success: false, error: message } satisfies ApiResponse<never>);
  }
});

export default router;
