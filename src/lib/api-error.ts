import axios from 'axios';
import type { ApiErrorBody } from '@/api/types';

const FALLBACK_MESSAGE = 'An unexpected error occurred';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function readEnvelope(data: unknown): ApiErrorBody['error'] | undefined {
  if (!isRecord(data) || !isRecord(data.error)) return undefined;
  const { code, message, requestId, details } = data.error;
  if (typeof code !== 'string' || typeof message !== 'string' || typeof requestId !== 'string') {
    return undefined;
  }
  return { code, message, requestId, details };
}

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const envelope = readEnvelope(error.response?.data);
    if (envelope?.message) return envelope.message;
    if (error.message) return error.message;
  }
  if (error instanceof Error && error.message) return error.message;
  return FALLBACK_MESSAGE;
}

export function getRequestId(error: unknown): string | undefined {
  if (!axios.isAxiosError(error)) return undefined;
  return readEnvelope(error.response?.data)?.requestId;
}

export function isNetworkError(error: unknown): boolean {
  return axios.isAxiosError(error) && !error.response;
}

export function isAuthError(error: unknown): boolean {
  return (
    axios.isAxiosError(error) &&
    (error.response?.status === 401 || error.response?.status === 403)
  );
}

export function isNotFoundError(error: unknown): boolean {
  return axios.isAxiosError(error) && error.response?.status === 404;
}

export function getErrorCode(error: unknown): string | undefined {
  if (!axios.isAxiosError(error)) return undefined;
  return readEnvelope(error.response?.data)?.code;
}
