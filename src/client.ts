import * as https from 'https';
import { URL } from 'url';
import { Proxy, QueryParams, ClientOptions } from './types';
import { FreeProxyError } from './error';

const DEFAULT_BASE_URL = 'https://api.getfreeproxy.com';
const DEFAULT_API_PATH = '/v1/proxies';
const DEFAULT_TIMEOUT = 30000;

/**
 * Client for interacting with the GetFreeProxy API
 */
export class Client {
  private apiKey: string;
  private baseUrl: string;
  private timeout: number;

  constructor(options: ClientOptions) {
    if (!options.apiKey) {
      throw new Error('apiKey is required');
    }
    this.apiKey = options.apiKey;
    this.baseUrl = options.baseUrl || DEFAULT_BASE_URL;
    this.timeout = options.timeout || DEFAULT_TIMEOUT;
  }

  /**
   * Query proxies with optional filters
   * @param params Query parameters for filtering
   * @returns Array of proxy objects
   * @throws FreeProxyError if the request fails
   */
  async query(params?: QueryParams): Promise<Proxy[]> {
    const url = this.buildUrl(params);
    return this.request(url);
  }

  /**
   * Query proxies filtered by country
   * @param country Country code (e.g., 'US', 'GB')
   * @returns Array of proxy objects
   * @throws FreeProxyError if the request fails
   */
  async queryCountry(country: string): Promise<Proxy[]> {
    return this.query({ country });
  }

  /**
   * Query proxies filtered by protocol
   * @param protocol Protocol type (e.g., 'http', 'https', 'socks5')
   * @returns Array of proxy objects
   * @throws FreeProxyError if the request fails
   */
  async queryProtocol(protocol: string): Promise<Proxy[]> {
    return this.query({ protocol });
  }

  /**
   * Query proxies from a specific page
   * @param page Page number (default: 1)
   * @returns Array of proxy objects
   * @throws FreeProxyError if the request fails
   */
  async queryPage(page: number): Promise<Proxy[]> {
    return this.query({ page });
  }

  /**
   * Build the request URL with query parameters
   */
  private buildUrl(params?: QueryParams): string {
    const url = new URL(DEFAULT_API_PATH, this.baseUrl);

    if (params?.country) {
      url.searchParams.append('country', params.country);
    }
    if (params?.protocol) {
      url.searchParams.append('protocol', params.protocol);
    }
    if (params?.page) {
      url.searchParams.append('page', params.page.toString());
    }

    return url.toString();
  }

  /**
   * Make an HTTPS request to the API
   */
  private request(urlString: string): Promise<Proxy[]> {
    return new Promise((resolve, reject) => {
      const url = new URL(urlString);

      const options = {
        hostname: url.hostname,
        port: url.port || 443,
        path: url.pathname + url.search,
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Accept': 'application/json',
          'User-Agent': 'freeproxy-node/1.0.0',
        },
        timeout: this.timeout,
      };

      const req = https.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          // Handle non-2xx status codes
          if (!res.statusCode || res.statusCode < 200 || res.statusCode >= 300) {
            const error = FreeProxyError.fromApiResponse(res.statusCode || 500, data);
            reject(error);
            return;
          }

          try {
            // Parse JSON response
            const proxies = JSON.parse(data) as Proxy[];
            resolve(proxies);
          } catch (parseError) {
            const error = new FreeProxyError(
              `Failed to parse API response: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`
            );
            reject(error);
          }
        });
      });

      req.on('error', (error) => {
        reject(FreeProxyError.fromRequestError(error));
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new FreeProxyError(`Request timeout after ${this.timeout}ms`));
      });

      req.end();
    });
  }
}
