import { Router, type Request, type Response } from "express";
import { getLogContent } from "../services/logService";
import type { ApiResponse } from "../types";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const filename = req.query.file ? String(req.query.file) : undefined;
    const content = await getLogContent(filename);
    const response: ApiResponse<string> = { success: true, data: content };
    res.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to read log file";
    const status = message.includes("not found") || message.includes("No .log") ? 404 : 500;
    res.status(status).json({ success: false, error: message } satisfies ApiResponse<never>);
  }
});

export default router;
