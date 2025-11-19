/**
 * Helper function to create error message from API response
 */
export function createErrorMessage(statusCode: number, body: string): string {
  try {
    const parsed = JSON.parse(body);
    const errorField = parsed.error || JSON.stringify(parsed);
    return `${statusCode}: ${errorField}`;
  } catch {
    return `${statusCode}: ${body}`;
  }
}
