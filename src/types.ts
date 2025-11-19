/**
 * Represents a single proxy entry from the GetFreeProxy API
 */
export interface Proxy {
  /** Unique identifier for the proxy */
  id: string;
  /** Proxy protocol type (e.g., 'http', 'https', 'socks5') */
  protocol: string;
  /** IP address of the proxy */
  ip: string;
  /** Port number of the proxy */
  port: number;
  /** Username for authentication (if required) */
  user?: string;
  /** Password for authentication (if required) */
  passwd?: string;
  /** Country code of the proxy location */
  countryCode: string;
  /** Region/State of the proxy location */
  region?: string;
  /** ASN (Autonomous System Number) */
  asnNumber?: string;
  /** ASN name */
  asnName?: string;
  /** Anonymity level of the proxy */
  anonymity: string;
  /** Uptime percentage */
  uptime: number;
  /** Response time in seconds */
  responseTime: number;
  /** Last time the proxy was confirmed alive */
  lastAliveAt: string;
  /** Full proxy URL with credentials */
  proxyUrl: string;
  /** Whether the proxy supports HTTPS */
  https: boolean;
  /** Whether the proxy can access Google */
  google: boolean;
}

/**
 * Query parameters for filtering proxies
 */
export interface QueryParams {
  /** Filter by country code (e.g., 'US', 'GB') */
  country?: string;
  /** Filter by protocol (e.g., 'http', 'https', 'socks5') */
  protocol?: string;
  /** Page number for pagination (default: 1) */
  page?: number;
}

/**
 * Configuration options for the Client
 */
export interface ClientOptions {
  /** API key for authentication */
  apiKey: string;
  /** Custom timeout in milliseconds (default: 30000) */
  timeout?: number;
  /** Custom API base URL (default: https://api.getfreeproxy.com) */
  baseUrl?: string;
}
