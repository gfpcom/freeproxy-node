/**
 * Custom error class for FreeProxy API errors
 */
export class FreeProxyError extends Error {
  /** HTTP status code (if applicable) */
  public readonly statusCode?: number;
  /** Original error message from API or HTTP error */
  public readonly apiMessage?: string;

  constructor(message: string, statusCode?: number, apiMessage?: string) {
    super(message);
    this.name = 'FreeProxyError';
    this.statusCode = statusCode;
    this.apiMessage = apiMessage;

    // Maintain proper prototype chain
    Object.setPrototypeOf(this, FreeProxyError.prototype);
  }

  /**
   * Static factory method to create error from API response
   */
  static fromApiResponse(statusCode: number, body: string): FreeProxyError {
    let apiMessage = '';
    try {
      const parsed = JSON.parse(body);
      apiMessage = parsed.error || JSON.stringify(parsed);
    } catch {
      apiMessage = body;
    }

    const message = `API Error [${statusCode}]: ${apiMessage}`;
    return new FreeProxyError(message, statusCode, apiMessage);
  }

  /**
   * Static factory method to create error from HTTP error
   */
  static fromHttpError(error: Error, statusCode?: number): FreeProxyError {
    const message = `HTTP Error: ${error.message}`;
    return new FreeProxyError(message, statusCode);
  }

  /**
   * Static factory method to create error from request error
   */
  static fromRequestError(error: Error): FreeProxyError {
    const message = `Request Error: ${error.message}`;
    return new FreeProxyError(message);
  }
}
