export interface LogChunkData {
  chunk: number;
  hasMore: boolean;
  data: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
