import { toast } from 'sonner';
import { getErrorMessage, getRequestId } from '@/lib/api-error';

export function toastApiError(error: unknown): void {
  const requestId = getRequestId(error);
  toast.error(getErrorMessage(error), {
    description: requestId ? `Error ID: ${requestId}` : undefined,
  });
}
