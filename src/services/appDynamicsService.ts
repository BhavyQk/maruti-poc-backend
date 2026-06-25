import fs from "fs/promises";
import { config } from "../config";
import type { AppDynamicsEvent, AppDynamicsQuery } from "../types";

async function readEvents(): Promise<AppDynamicsEvent[]> {
  try {
    const raw = await fs.readFile(config.appDynamicsFile, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

function matches(event: AppDynamicsEvent, query: AppDynamicsQuery): boolean {
  const cf = event.custom_fields;
  const checks: Array<[string | undefined, string | undefined]> = [
    [query.user_id, cf.user_id],
    [query.mobile, cf.mobile],
    [query.screen, cf.screen],
    [query.session_id, cf.session_id],
    [query.error_code, cf.error_code],
    [query.severity, event.severity],
    [query.car_registration, cf.car_registration],
  ];

  return checks.every(([wanted, actual]) => {
    if (wanted === undefined || wanted === "") return true;
    return String(actual ?? "").toLowerCase() === wanted.toLowerCase();
  });
}

export async function getAppDynamicsEvents(
  query: AppDynamicsQuery = {}
): Promise<AppDynamicsEvent[]> {
  const events = await readEvents();
  const hasFilter = Object.values(query).some((v) => v !== undefined && v !== "");
  if (!hasFilter) return events;
  return events.filter((event) => matches(event, query));
}

/**
 * Correlate a booking/job-card failure with AppDynamics monitoring events.
 * Matches on any of the identifying fields that link a booking attempt to
 * its observability events (vehicle reg, session, user, mobile).
 */
export async function correlateWithBooking(criteria: {
  vehicleRegNo?: string;
  sessionId?: string;
  userId?: string;
  mobile?: string;
}): Promise<AppDynamicsEvent[]> {
  const events = await readEvents();
  const { vehicleRegNo, sessionId, userId, mobile } = criteria;

  const anyCriteria = [vehicleRegNo, sessionId, userId, mobile].some(
    (v) => v !== undefined && v !== ""
  );
  if (!anyCriteria) return [];

  return events.filter((event) => {
    const cf = event.custom_fields;
    const regMatch =
      !!vehicleRegNo &&
      cf.car_registration.toLowerCase() === vehicleRegNo.toLowerCase();
    const sessionMatch = !!sessionId && cf.session_id === sessionId;
    const userMatch = !!userId && cf.user_id === userId;
    const mobileMatch = !!mobile && cf.mobile === mobile;
    return regMatch || sessionMatch || userMatch || mobileMatch;
  });
}
