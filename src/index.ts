/**
 * FreeProxy Node Client
 * A lightweight TypeScript client for the GetFreeProxy API
 */

export { Client } from './client';
export { FreeProxyError } from './error';
export type { Proxy, QueryParams, ClientOptions } from './types';

// Default export for convenience
export { Client as default } from './client';
