import { Router, type Request, type Response } from "express";
import { getLogChunk, resolveLogFilePath } from "../services/logService";
import type { ApiResponse } from "../types";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const filename = req.query.file ? String(req.query.file) : undefined;
    const chunk = Math.max(0, Number(req.query.chunk) || 0);
    const filePath = await resolveLogFilePath(filename);
    const data = await getLogChunk(filePath, chunk);

    const response: ApiResponse<typeof data> = { success: true, data };
    res.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to read log file";
    const status =
      message.includes("not found") ||
      message.includes("No .log") ||
      message.includes("out of range")
        ? 404
        : 500;
    res.status(status).json({ success: false, error: message } satisfies ApiResponse<never>);
  }
});

export default router;
