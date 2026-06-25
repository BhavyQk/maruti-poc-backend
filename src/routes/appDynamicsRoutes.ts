import { Router, type Request, type Response } from "express";
import {
  correlateWithBooking,
  getAppDynamicsEvents,
} from "../services/appDynamicsService";
import type { ApiResponse, AppDynamicsQuery } from "../types";

const router = Router();

function strOrUndefined(value: unknown): string | undefined {
  if (value === undefined) return undefined;
  const s = String(value).trim();
  return s.length ? s : undefined;
}

// Returns AppDynamics-format error events (optionally filtered for correlation)
router.get("/", async (req: Request, res: Response) => {
  try {
    const query: AppDynamicsQuery = {
      user_id: strOrUndefined(req.query.user_id),
      mobile: strOrUndefined(req.query.mobile),
      screen: strOrUndefined(req.query.screen),
      session_id: strOrUndefined(req.query.session_id),
      error_code: strOrUndefined(req.query.error_code),
      severity: strOrUndefined(req.query.severity),
      car_registration: strOrUndefined(req.query.car_registration),
    };

    const events = await getAppDynamicsEvents(query);
    res.json({ success: true, data: events } satisfies ApiResponse<typeof events>);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to read AppDynamics events";
    res.status(500).json({ success: false, error: message } satisfies ApiResponse<never>);
  }
});

// Correlate a booking/job-card failure with its AppDynamics monitoring events
router.get("/correlate", async (req: Request, res: Response) => {
  try {
    const events = await correlateWithBooking({
      vehicleRegNo: strOrUndefined(req.query.vehicleRegNo),
      sessionId: strOrUndefined(req.query.session_id),
      userId: strOrUndefined(req.query.user_id),
      mobile: strOrUndefined(req.query.mobile),
    });

    res.json({
      success: true,
      data: { matchCount: events.length, events },
    } satisfies ApiResponse<{ matchCount: number; events: typeof events }>);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to correlate events";
    res.status(500).json({ success: false, error: message } satisfies ApiResponse<never>);
  }
});

export default router;
