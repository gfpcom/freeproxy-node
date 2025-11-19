import { Client, FreeProxyError } from '../src/index';

describe('Client', () => {
  describe('constructor', () => {
    it('should create a client with valid API key', () => {
      const client = new Client({ apiKey: 'test-api-key' });
      expect(client).toBeInstanceOf(Client);
    });

    it('should throw error if API key is missing', () => {
      expect(() => new Client({ apiKey: '' })).toThrow('apiKey is required');
    });

    it('should accept custom timeout', () => {
      const client = new Client({ apiKey: 'test-api-key', timeout: 5000 });
      expect(client).toBeInstanceOf(Client);
    });

    it('should accept custom baseUrl', () => {
      const client = new Client({
        apiKey: 'test-api-key',
        baseUrl: 'https://custom.example.com',
      });
      expect(client).toBeInstanceOf(Client);
    });

    it('should use default timeout and baseUrl', () => {
      const client = new Client({ apiKey: 'test-api-key' });
      expect(client).toBeInstanceOf(Client);
    });
  });
});

describe('FreeProxyError', () => {
  it('should be an instance of Error', () => {
    const error = new FreeProxyError('Test error');
    expect(error).toBeInstanceOf(Error);
  });

  it('should have correct name', () => {
    const error = new FreeProxyError('Test error');
    expect(error.name).toBe('FreeProxyError');
  });

  it('should have correct message', () => {
    const error = new FreeProxyError('Test error');
    expect(error.message).toBe('Test error');
  });

  it('should support status code', () => {
    const error = new FreeProxyError('Test error', 401);
    expect(error.statusCode).toBe(401);
    expect(error.apiMessage).toBeUndefined();
  });

  it('should support apiMessage', () => {
    const error = new FreeProxyError('Test error', 400, 'INVALID_PARAM');
    expect(error.statusCode).toBe(400);
    expect(error.apiMessage).toBe('INVALID_PARAM');
  });

  it('should create error from API response with JSON', () => {
    const error = FreeProxyError.fromApiResponse(400, JSON.stringify({ error: 'INVALID_PARAMETER' }));
    expect(error).toBeInstanceOf(FreeProxyError);
    expect(error.statusCode).toBe(400);
    expect(error.message).toContain('INVALID_PARAMETER');
    expect(error.apiMessage).toBe('INVALID_PARAMETER');
  });

  it('should create error from API response with plain text', () => {
    const error = FreeProxyError.fromApiResponse(500, 'Internal Server Error');
    expect(error).toBeInstanceOf(FreeProxyError);
    expect(error.statusCode).toBe(500);
    expect(error.message).toContain('Internal Server Error');
  });

  it('should create error from API response with malformed JSON', () => {
    const error = FreeProxyError.fromApiResponse(500, '{broken json}');
    expect(error).toBeInstanceOf(FreeProxyError);
    expect(error.statusCode).toBe(500);
    expect(error.message).toContain('500');
  });

  it('should create error from HTTP error', () => {
    const httpError = new Error('Connection refused');
    const error = FreeProxyError.fromHttpError(httpError, 500);
    expect(error).toBeInstanceOf(FreeProxyError);
    expect(error.statusCode).toBe(500);
    expect(error.message).toContain('Connection refused');
  });

  it('should create error from HTTP error without status code', () => {
    const httpError = new Error('Network timeout');
    const error = FreeProxyError.fromHttpError(httpError);
    expect(error).toBeInstanceOf(FreeProxyError);
    expect(error.statusCode).toBeUndefined();
    expect(error.message).toContain('Network timeout');
  });

  it('should create error from request error', () => {
    const requestError = new Error('Timeout');
    const error = FreeProxyError.fromRequestError(requestError);
    expect(error).toBeInstanceOf(FreeProxyError);
    expect(error.message).toContain('Timeout');
  });

  it('should maintain prototype chain', () => {
    const error = new FreeProxyError('Test');
    expect(error instanceof FreeProxyError).toBe(true);
    expect(error instanceof Error).toBe(true);
  });
});
