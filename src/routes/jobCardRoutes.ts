import { Router, type Request, type Response } from "express";
import {
  createJobCard,
  deleteJobCard,
  getJobCard,
  listJobCards,
  updateJobCard,
} from "../services/jobCardService";
import type { ApiResponse } from "../types";

const router = Router();

function sendError(res: Response, error: unknown, fallback: string): void {
  const message = error instanceof Error ? error.message : fallback;
  let status = 500;
  if (message.includes("not found")) status = 404;
  else if (message.includes("already exists")) status = 409;
  else if (message.includes("required") || message.includes("must be")) status = 400;
  res.status(status).json({ success: false, error: message } satisfies ApiResponse<never>);
}

router.get("/", async (_req: Request, res: Response) => {
  try {
    const data = await listJobCards();
    res.json({ success: true, data } satisfies ApiResponse<typeof data>);
  } catch (error) {
    sendError(res, error, "Failed to list job cards");
  }
});

router.get("/:jobCardId", async (req: Request, res: Response) => {
  try {
    const data = await getJobCard(String(req.params.jobCardId));
    res.json({ success: true, data } satisfies ApiResponse<typeof data>);
  } catch (error) {
    sendError(res, error, "Failed to fetch job card");
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const data = await createJobCard(req.body);
    res.status(201).json({ success: true, data } satisfies ApiResponse<typeof data>);
  } catch (error) {
    sendError(res, error, "Failed to create job card");
  }
});

router.put("/:jobCardId", async (req: Request, res: Response) => {
  try {
    const data = await updateJobCard(String(req.params.jobCardId), req.body);
    res.json({ success: true, data } satisfies ApiResponse<typeof data>);
  } catch (error) {
    sendError(res, error, "Failed to update job card");
  }
});

router.delete("/:jobCardId", async (req: Request, res: Response) => {
  try {
    await deleteJobCard(String(req.params.jobCardId));
    res.json({ success: true } satisfies ApiResponse<never>);
  } catch (error) {
    sendError(res, error, "Failed to delete job card");
  }
});

export default router;
