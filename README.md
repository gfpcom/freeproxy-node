# getfreeproxy

[![npm version](https://img.shields.io/npm/v/getfreeproxy.svg)](https://www.npmjs.com/package/getfreeproxy)
[![npm downloads](https://img.shields.io/npm/dm/getfreeproxy.svg)](https://www.npmjs.com/package/getfreeproxy)
[![license](https://img.shields.io/github/license/gfpcom/freeproxy-node.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)

A lightweight, zero-dependency TypeScript client library for the [GetFreeProxy API](https://developer.getfreeproxy.com). Get free proxies with simple, async/await syntax.

## Features

- ✨ **Zero Dependencies** — Uses only Node.js native `https` module
- 📦 **Dual Package** — ESM and CommonJS support
- 🎯 **Type Safe** — Full TypeScript support with comprehensive types
- 🚀 **Simple API** — Clean, intuitive interface with async/await
- ⚡ **Lightweight** — Only 5KB gzipped
- 🛡️ **Error Handling** — Comprehensive error wrapping
- 🧪 **Well Tested** — Full test coverage with Jest
- 📝 **Well Documented** — JSDoc comments and examples

## Installation

```bash
npm install getfreeproxy
```

```bash
yarn add getfreeproxy
```

```bash
pnpm add getfreeproxy
```

## Quick Start

### Basic Usage

```typescript
import { Client } from 'getfreeproxy';

const client = new Client({ apiKey: 'your-api-key' });

try {
  // Get proxies from first page
  const proxies = await client.query();
  console.log(`Got ${proxies.length} proxies`);
  
  // Print first proxy details
  if (proxies.length > 0) {
    const proxy = proxies[0];
    console.log(`${proxy.protocol}://${proxy.ip}:${proxy.port}`);
    console.log(`Country: ${proxy.countryCode}`);
    console.log(`Uptime: ${proxy.uptime}%`);
  }
} catch (error) {
  console.error(`API Error: ${error instanceof Error ? error.message : error}`);
}
```

### Query with Filters

```typescript
import { Client } from 'getfreeproxy';

const client = new Client({ apiKey: 'your-api-key' });

// Get US proxies
const usProxies = await client.queryCountry('US');

// Get HTTPS proxies
const httpsProxies = await client.queryProtocol('https');

// Get proxies from page 2
const page2Proxies = await client.queryPage(2);

// Combine multiple filters
const proxies = await client.query({
  country: 'US',
  protocol: 'https',
  page: 1,
});
```

### Error Handling

```typescript
import { Client } from 'getfreeproxy';

const client = new Client({ apiKey: 'your-api-key' });

try {
  const proxies = await client.query();
} catch (error) {
  console.error(`Error: ${error instanceof Error ? error.message : error}`);
}
```

### Custom Configuration

```typescript
import { Client } from 'getfreeproxy';

const client = new Client({
  apiKey: 'your-api-key',
  timeout: 10000, // 10 seconds
  baseUrl: 'https://custom-api.getfreeproxy.com', // Custom API endpoint
});

const proxies = await client.query();
```

## API Reference

### Client

#### Constructor

```typescript
new Client(options: ClientOptions)
```

**Options:**
- `apiKey` (required): Your API key from GetFreeProxy
- `timeout` (optional): Request timeout in milliseconds (default: 30000)
- `baseUrl` (optional): Custom API base URL (default: https://api.getfreeproxy.com)

#### Methods

##### `query(params?: QueryParams): Promise<Proxy[]>`

Retrieves proxies with optional filters.

**Parameters:**
- `params` (optional): Query parameters
  - `country`: Filter by country code (e.g., 'US', 'GB', 'DE')
  - `protocol`: Filter by protocol (e.g., 'http', 'https', 'socks5')
  - `page`: Page number for pagination (default: 1)

**Returns:** Array of proxy objects

**Throws:** `FreeProxyError` on API or network errors

**Example:**
```typescript
const proxies = await client.query({ country: 'US', page: 1 });
```

##### `queryCountry(country: string): Promise<Proxy[]>`

Convenience method to get proxies by country.

**Parameters:**
- `country`: Country code (e.g., 'US', 'GB')

**Returns:** Array of proxy objects

**Example:**
```typescript
const usProxies = await client.queryCountry('US');
```

##### `queryProtocol(protocol: string): Promise<Proxy[]>`

Convenience method to get proxies by protocol.

**Parameters:**
- `protocol`: Protocol type (e.g., 'http', 'https', 'socks5')

**Returns:** Array of proxy objects

**Example:**
```typescript
const httpsProxies = await client.queryProtocol('https');
```

##### `queryPage(page: number): Promise<Proxy[]>`

Convenience method to get proxies from a specific page.

**Parameters:**
- `page`: Page number

**Returns:** Array of proxy objects

**Example:**
```typescript
const page2Proxies = await client.queryPage(2);
```

### Proxy

```typescript
interface Proxy {
  id: string;                    // Unique identifier
  protocol: string;              // 'http', 'https', 'socks5', etc.
  ip: string;                    // IP address
  port: number;                  // Port number
  user?: string;                 // Username (if required)
  passwd?: string;               // Password (if required)
  countryCode: string;           // ISO 3166-1 alpha-2 country code
  region?: string;               // Region/State
  asnNumber?: string;            // Autonomous System Number
  asnName?: string;              // ASN name
  anonymity: string;             // Anonymity level
  uptime: number;                // Uptime percentage (0-100)
  responseTime: number;          // Response time in seconds
  lastAliveAt: string;           // ISO 8601 timestamp
  proxyUrl: string;              // Full proxy URL with credentials
  https: boolean;                // Supports HTTPS
  google: boolean;               // Can access Google
}
```

### FreeProxyError

Custom error class for API errors.

```typescript
class FreeProxyError extends Error {
  statusCode?: number;           // HTTP status code
  apiMessage?: string;           // Original API error message
}
```

## CommonJS Usage

```javascript
const { Client } = require('getfreeproxy');

const client = new Client({ apiKey: 'your-api-key' });

client.query().then(proxies => {
  console.log(`Got ${proxies.length} proxies`);
}).catch(error => {
  console.error(error.message);
});
```

## ESM Usage

```javascript
import { Client } from 'getfreeproxy';

const client = new Client({ apiKey: 'your-api-key' });
const proxies = await client.query();
```

## Advanced Examples

### Iterate Through Pages

```typescript
import { Client, FreeProxyError } from 'getfreeproxy';

const client = new Client({ apiKey: 'your-api-key' });

async function getAllProxies() {
  const allProxies = [];
  
  for (let page = 1; page <= 100; page++) {
    try {
      const proxies = await client.queryPage(page);
      
      if (proxies.length === 0) {
        break; // No more proxies
      }
      
      allProxies.push(...proxies);
      console.log(`Page ${page}: Got ${proxies.length} proxies`);
    } catch (error) {
      console.error(`Error on page ${page}:`, error);
      break;
    }
  }
  
  return allProxies;
}

const proxies = await getAllProxies();
```

### Filter Proxies by Criteria

```typescript
import { Client, Proxy } from 'getfreeproxy';

const client = new Client({ apiKey: 'your-api-key' });
const proxies = await client.query();

// Get only high-uptime proxies
const reliableProxies = proxies.filter(p => p.uptime >= 95);

// Get only proxies that support Google
const googleProxies = proxies.filter(p => p.google);

// Get only HTTPS-capable proxies
const httpsProxies = proxies.filter(p => p.https);

// Combine filters
const bestProxies = proxies.filter(
  p => p.uptime >= 95 && p.https && p.google
);
```

### Get Proxy URL with Authentication

```typescript
import { Client, Proxy } from 'getfreeproxy';

const client = new Client({ apiKey: 'your-api-key' });
const proxies = await client.query();

for (const proxy of proxies) {
  // Ready-to-use proxy URL with credentials
  console.log(`Full URL: ${proxy.proxyUrl}`);
  
  // Or build manually
  const auth = proxy.user && proxy.passwd ? 
    `${proxy.user}:${proxy.passwd}@` : '';
  const url = `${proxy.protocol}://${auth}${proxy.ip}:${proxy.port}`;
  console.log(`Manual URL: ${url}`);
}
```

## Getting Your API Key

Visit [GetFreeProxy](https://developer.getfreeproxy.com) to get your API key and manage your account.

## Testing

```bash
npm test                  # Run tests
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report
```

## Development

```bash
npm run dev             # Watch TypeScript compilation
npm run build           # Build for production (ESM + CommonJS)
npm run lint            # Run ESLint
npm run format          # Format with Prettier
```

## Build Output

The package publishes both ESM and CommonJS formats:

- **ESM**: `dist/esm/index.mjs`
- **CommonJS**: `dist/cjs/index.js`
- **Types**: `dist/index.d.ts`

## Browser Compatibility

This package is designed for Node.js only and uses Node.js built-in `https` module. For browser usage, consider using the browser-compatible [freeproxy-js](https://github.com/gfpcom/freeproxy-js) library instead.

## Related Projects

- [freeproxy-go](https://github.com/gfpcom/freeproxy-go) — Go implementation
- [freeproxy-python](https://github.com/gfpcom/freeproxy-python) — Python implementation
- [freeproxy-js](https://github.com/gfpcom/freeproxy-js) — Browser-compatible JavaScript implementation

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT © [gfpcom](https://github.com/gfpcom)

## Support

For API documentation and support, visit [GetFreeProxy Developer Docs](https://developer.getfreeproxy.com/docs).
