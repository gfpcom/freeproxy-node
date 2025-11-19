/**
 * Helper function to create error message from API response
 */
import { STATUS_CODES } from 'http';

export function createErrorMessage(statusCode: number, body: string): string {
  try {
    const parsed = JSON.parse(body);
    if (parsed.error) {
      return parsed.error;
    }
  } catch {
    // Body is not JSON, will use status text
  }
  
  return STATUS_CODES[statusCode] || `HTTP Error ${statusCode}`;
}
