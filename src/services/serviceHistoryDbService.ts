import DaoServices from "../../DBServices/DAOServices";
import { JobCard, ServiceHistory } from "../../models";

const dao = new DaoServices();

export interface ServiceHistoryInput {
  job_card_id: string; // business id e.g. JC-2026-0001
  description: string;
  amount: number;
  service_type?: string;
  service_date?: string;
  odometer?: number;
  car_registration?: string;
  client_mobile?: string;
}

async function resolveJobCard(jobCardId: string): Promise<any> {
  const card = await dao.findOneDao(JobCard, undefined as any, {
    job_card_id: jobCardId,
  });
  if (!card) {
    throw new Error(`Job card not found: ${jobCardId}`);
  }
  return card;
}

export async function listServiceHistory(filters: {
  car_registration?: string;
  client_mobile?: string;
  job_card_id?: string; // business id
}): Promise<ServiceHistory[]> {
  const where: Record<string, unknown> = {};
  if (filters.car_registration) where.car_registration = filters.car_registration;
  if (filters.client_mobile) where.client_mobile = filters.client_mobile;
  if (filters.job_card_id) {
    const card = await resolveJobCard(filters.job_card_id);
    where.job_card_id = card.id;
  }
  return (await dao.findAllDao(
    ServiceHistory,
    undefined as any,
    where
  )) as unknown as ServiceHistory[];
}

export async function addServiceHistory(input: ServiceHistoryInput): Promise<any> {
  if (!input?.job_card_id) {
    throw new Error("job_card_id is required");
  }
  if (!input?.description || !String(input.description).trim()) {
    throw new Error("description is required");
  }

  const card = await resolveJobCard(input.job_card_id);

  return dao.createDao(ServiceHistory, {
    job_card_id: card.id,
    // Default the denormalised identifiers from the parent job card.
    car_registration: input.car_registration ?? card.car_registration,
    client_mobile: input.client_mobile ?? card.client_mobile,
    service_type: input.service_type ?? null,
    description: input.description,
    amount: Number(input.amount || 0),
    service_date: input.service_date ?? null,
    odometer: input.odometer ?? null,
  });
}
