import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { config } from "../config";
import type { JobCard, JobCardInput, ServiceItem } from "../types";

const STORE_PATH = config.jobCardsFile;

async function readStore(): Promise<JobCard[]> {
  try {
    const raw = await fs.readFile(STORE_PATH, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

async function writeStore(cards: JobCard[]): Promise<void> {
  await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
  await fs.writeFile(STORE_PATH, JSON.stringify(cards, null, 2), "utf-8");
}

function normalizeServiceDetails(details: unknown): ServiceItem[] {
  if (!Array.isArray(details)) {
    throw new Error("serviceDetails must be an array of { description, amount }");
  }
  return details.map((item, index) => {
    const description = (item as ServiceItem)?.description;
    const amount = Number((item as ServiceItem)?.amount);
    if (typeof description !== "string" || description.trim().length === 0) {
      throw new Error(`serviceDetails[${index}].description is required`);
    }
    if (!Number.isFinite(amount) || amount < 0) {
      throw new Error(`serviceDetails[${index}].amount must be a non-negative number`);
    }
    return { description: description.trim(), amount };
  });
}

function computeTotal(details: ServiceItem[]): number {
  return details.reduce((sum, item) => sum + item.amount, 0);
}

function validateInput(input: JobCardInput): {
  vehicleRegNo: string;
  serviceDetails: ServiceItem[];
  totalAmount: number;
} {
  const vehicleRegNo = String(input?.vehicleRegNo ?? "").trim();
  if (!vehicleRegNo) {
    throw new Error("vehicleRegNo is required");
  }

  const serviceDetails = normalizeServiceDetails(input?.serviceDetails);

  const totalAmount =
    input?.totalAmount === undefined ? computeTotal(serviceDetails) : Number(input.totalAmount);
  if (!Number.isFinite(totalAmount) || totalAmount < 0) {
    throw new Error("totalAmount must be a non-negative number");
  }

  return { vehicleRegNo, serviceDetails, totalAmount };
}

export async function listJobCards(): Promise<JobCard[]> {
  return readStore();
}

export async function getJobCard(jobCardId: string): Promise<JobCard> {
  const cards = await readStore();
  const card = cards.find((c) => c.jobCardId === jobCardId);
  if (!card) {
    throw new Error(`Job card not found: ${jobCardId}`);
  }
  return card;
}

export async function createJobCard(input: JobCardInput): Promise<JobCard> {
  const { vehicleRegNo, serviceDetails, totalAmount } = validateInput(input);
  const cards = await readStore();

  const jobCardId = String(input?.jobCardId ?? "").trim() || `JC-${randomUUID().slice(0, 8).toUpperCase()}`;
  if (cards.some((c) => c.jobCardId === jobCardId)) {
    throw new Error(`Job card already exists: ${jobCardId}`);
  }

  const now = new Date().toISOString();
  const card: JobCard = {
    jobCardId,
    vehicleRegNo,
    serviceDetails,
    totalAmount,
    createdAt: now,
    updatedAt: now,
  };

  cards.push(card);
  await writeStore(cards);
  return card;
}

export async function updateJobCard(
  jobCardId: string,
  input: JobCardInput
): Promise<JobCard> {
  const cards = await readStore();
  const index = cards.findIndex((c) => c.jobCardId === jobCardId);
  if (index === -1) {
    throw new Error(`Job card not found: ${jobCardId}`);
  }

  const { vehicleRegNo, serviceDetails, totalAmount } = validateInput(input);
  const updated: JobCard = {
    ...cards[index],
    vehicleRegNo,
    serviceDetails,
    totalAmount,
    updatedAt: new Date().toISOString(),
  };

  cards[index] = updated;
  await writeStore(cards);
  return updated;
}

export async function deleteJobCard(jobCardId: string): Promise<void> {
  const cards = await readStore();
  const next = cards.filter((c) => c.jobCardId !== jobCardId);
  if (next.length === cards.length) {
    throw new Error(`Job card not found: ${jobCardId}`);
  }
  await writeStore(next);
}
