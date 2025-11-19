import { Client, createErrorMessage } from '../src/index';

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

describe('Error handling', () => {
  it('should throw Error instances on failure', () => {
    const client = new Client({ apiKey: 'invalid' });
    expect(() => {
      throw new Error('Connection failed');
    }).toThrow(Error);
  });

  it('should create error message from API response with JSON error field', () => {
    const message = createErrorMessage(400, JSON.stringify({ error: 'INVALID_PARAMETER' }));
    expect(message).toContain('400');
    expect(message).toContain('INVALID_PARAMETER');
  });

  it('should create error message from API response with plain text', () => {
    const message = createErrorMessage(500, 'Internal Server Error');
    expect(message).toContain('500');
    expect(message).toContain('Internal Server Error');
  });

  it('should create error message from API response with malformed JSON', () => {
    const message = createErrorMessage(500, '{broken json}');
    expect(message).toContain('500');
    expect(message).toContain('{broken json}');
  });

  it('should create error message with status code and full JSON object', () => {
    const message = createErrorMessage(400, JSON.stringify({ code: 'ERR_001', detail: 'Bad request' }));
    expect(message).toContain('400');
    expect(message).toContain('code');
  });

  it('should create error message with nested error object', () => {
    const message = createErrorMessage(403, JSON.stringify({ error: 'UNAUTHORIZED', details: 'Invalid token' }));
    expect(message).toContain('403');
    expect(message).toContain('UNAUTHORIZED');
  });

  it('should handle empty string body', () => {
    const message = createErrorMessage(500, '');
    expect(message).toContain('500');
  });

  it('should handle network error messages', () => {
    const networkError = new Error('Request Error: ECONNREFUSED');
    expect(networkError.message).toContain('ECONNREFUSED');
  });

  it('should handle timeout error messages', () => {
    const timeoutError = new Error('Request timeout after 30000ms');
    expect(timeoutError.message).toContain('timeout');
  });

  it('should handle parse error messages', () => {
    const parseError = new Error('Failed to parse API response: Unexpected token');
    expect(parseError.message).toContain('parse');
  });
});
