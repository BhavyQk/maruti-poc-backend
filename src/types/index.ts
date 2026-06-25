export interface LogChunkData {
  chunk: number;
  hasMore: boolean;
  data: string;
}

export interface ServiceItem {
  description: string;
  amount: number;
}

export interface JobCard {
  jobCardId: string;
  vehicleRegNo: string;
  serviceDetails: ServiceItem[];
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export type JobCardInput = {
  jobCardId?: string;
  vehicleRegNo: string;
  serviceDetails: ServiceItem[];
  totalAmount?: number;
};

export interface AppDynamicsCustomFields {
  user_id: string;
  mobile: string;
  screen: string;
  session_id: string;
  status_code: string;
  error_code: string;
  error_message: string;
  api_endpoint: string;
  car_registration: string;
  car_vin: string;
  customer_name: string;
  event_timestamp: string;
  additional_details: Record<string, string>;
}

export interface AppDynamicsEvent {
  title: string;
  body: string;
  severity: string;
  source: string;
  reported_by: string;
  custom_fields: AppDynamicsCustomFields;
}

export interface AppDynamicsQuery {
  user_id?: string;
  mobile?: string;
  screen?: string;
  session_id?: string;
  error_code?: string;
  severity?: string;
  car_registration?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
