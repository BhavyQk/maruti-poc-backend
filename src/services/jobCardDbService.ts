import { randomUUID } from "crypto";
import DaoServices from "../../DBServices/DAOServices";
import { JobCard, ServiceHistory } from "../../models";

const dao = new DaoServices();

export interface ServiceLine {
  description: string;
  amount: number;
  service_type?: string;
  service_date?: string;
  odometer?: number;
}

export interface JobCardInput {
  job_card_id?: string;
  car_registration: string;
  client_mobile: string;
  customer_name?: string;
  car_vin?: string;
  total_amount?: number;
  status?: "Open" | "In-Progress" | "Completed" | "Disputed" | "Corrected";
  serviceDetails?: ServiceLine[];
}

function generateJobCardId(): string {
  return `JC-${randomUUID().slice(0, 8).toUpperCase()}`;
}

function computeTotal(lines: ServiceLine[] = []): number {
  return lines.reduce((sum, l) => sum + Number(l.amount || 0), 0);
}

function validate(input: JobCardInput): void {
  if (!input?.car_registration || !String(input.car_registration).trim()) {
    throw new Error("car_registration is required");
  }
  if (!input?.client_mobile || !String(input.client_mobile).trim()) {
    throw new Error("client_mobile is required");
  }
}

export async function listJobCards(filters: {
  car_registration?: string;
  client_mobile?: string;
}): Promise<JobCard[]> {
  const where: Record<string, unknown> = {};
  if (filters.car_registration) where.car_registration = filters.car_registration;
  if (filters.client_mobile) where.client_mobile = filters.client_mobile;
  return (await dao.findAllDao(JobCard, undefined as any, where)) as unknown as JobCard[];
}

export async function getJobCard(jobCardId: string): Promise<any> {
  const card = await dao.findOneDao(JobCard, undefined as any, {
    job_card_id: jobCardId,
  });
  if (!card) {
    throw new Error(`Job card not found: ${jobCardId}`);
  }
  const services = await dao.findAllDao(ServiceHistory, undefined as any, {
    job_card_id: card.id,
  });
  return { ...card.dataValues, serviceHistory: services };
}

export async function createJobCard(input: JobCardInput): Promise<any> {
  validate(input);

  const job_card_id = String(input.job_card_id ?? "").trim() || generateJobCardId();

  const existing = await dao.findOneDao(JobCard, undefined as any, { job_card_id });
  if (existing) {
    throw new Error(`Job card already exists: ${job_card_id}`);
  }

  const total_amount =
    input.total_amount === undefined
      ? computeTotal(input.serviceDetails)
      : Number(input.total_amount);

  const card: any = await dao.createDao(JobCard, {
    job_card_id,
    car_registration: input.car_registration,
    client_mobile: input.client_mobile,
    customer_name: input.customer_name ?? null,
    car_vin: input.car_vin ?? null,
    total_amount,
    status: input.status ?? "Open",
  });

  // Persist any provided service lines into service_history (denormalised).
  if (Array.isArray(input.serviceDetails) && input.serviceDetails.length) {
    for (const line of input.serviceDetails) {
      await dao.createDao(ServiceHistory, {
        job_card_id: card.id,
        car_registration: input.car_registration,
        client_mobile: input.client_mobile,
        service_type: line.service_type ?? null,
        description: line.description,
        amount: Number(line.amount || 0),
        service_date: line.service_date ?? null,
        odometer: line.odometer ?? null,
      });
    }
  }

  return getJobCard(job_card_id);
}

export async function updateJobCard(
  jobCardId: string,
  input: Partial<JobCardInput>
): Promise<any> {
  const existing = await dao.findOneDao(JobCard, undefined as any, {
    job_card_id: jobCardId,
  });
  if (!existing) {
    throw new Error(`Job card not found: ${jobCardId}`);
  }

  const updateAttrs: Record<string, unknown> = {};
  for (const key of [
    "car_vin",
    "total_amount",
  ] as const) {
    if (input[key] !== undefined) updateAttrs[key] = input[key];
  }

  await dao.updateDao(JobCard, updateAttrs, { job_card_id: jobCardId });
  return getJobCard(jobCardId);
}

export async function deleteJobCard(jobCardId: string): Promise<void> {
  const existing = await dao.findOneDao(JobCard, undefined as any, {
    job_card_id: jobCardId,
  });
  if (!existing) {
    throw new Error(`Job card not found: ${jobCardId}`);
  }
  await dao.deleteDao(JobCard, { where: { job_card_id: jobCardId } });
}
