import { Router, type Request, type Response } from "express";
import {
  addServiceHistory,
  listServiceHistory,
} from "../services/serviceHistoryDbService";
import type { ApiResponse } from "../types";

const router = Router();

function sendError(res: Response, error: unknown, fallback: string): void {
  const message = error instanceof Error ? error.message : fallback;
  let status = 500;
  if (message.includes("not found")) status = 404;
  else if (message.includes("required")) status = 400;
  res.status(status).json({ success: false, error: message } satisfies ApiResponse<never>);
}

// GET /api/service-history?car_registration=...&mobile=...&job_card_id=...
router.get("/", async (req: Request, res: Response) => {
  try {
    const data = await listServiceHistory({
      car_registration: req.query.car_registration
        ? String(req.query.car_registration)
        : undefined,
      client_mobile: req.query.mobile ? String(req.query.mobile) : undefined,
      job_card_id: req.query.job_card_id ? String(req.query.job_card_id) : undefined,
    });
    res.json({ success: true, data } satisfies ApiResponse<typeof data>);
  } catch (error) {
    sendError(res, error, "Failed to list service history");
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const data = await addServiceHistory(req.body);
    res.status(201).json({ success: true, data } satisfies ApiResponse<typeof data>);
  } catch (error) {
    sendError(res, error, "Failed to add service history");
  }
});

export default router;
