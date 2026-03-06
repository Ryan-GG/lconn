import type { Response } from 'express';
import type { ApiResponse, PaginatedResponse } from '@lconn/shared';

export function sendSuccess<T>(res: Response, data: T, status = 200) {
  const body: ApiResponse<T> = { success: true, data };
  res.status(status).json(body);
}

export function sendPaginated<T>(res: Response, result: PaginatedResponse<T>) {
  sendSuccess(res, result);
}

export function sendError(res: Response, error: string, status: number) {
  const body: ApiResponse = { success: false, error };
  res.status(status).json(body);
}
