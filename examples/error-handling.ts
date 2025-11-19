/**
 * Error handling example
 * Demonstrates various error scenarios
 */

import { Client, FreeProxyError } from '../src/index';

async function main() {
  console.log('Example 1: Invalid API key\n');
  try {
    const client = new Client({ apiKey: 'invalid-key' });
    await client.query();
  } catch (error) {
    if (error instanceof FreeProxyError) {
      console.log(`Status Code: ${error.statusCode}`);
      console.log(`API Message: ${error.apiMessage}`);
      console.log(`Full Error: ${error.message}\n`);
    }
  }

  console.log('Example 2: Request timeout\n');
  try {
    const client = new Client({
      apiKey: process.env.FREEPROXY_API_KEY || 'your-api-key-here',
      timeout: 1, // 1ms timeout - will always timeout
    });
    await client.query();
  } catch (error) {
    if (error instanceof FreeProxyError) {
      console.log(`Error: ${error.message}`);
      console.log(`Status Code: ${error.statusCode || 'N/A'}\n`);
    }
  }

  console.log('Example 3: Custom error handling\n');
  try {
    const client = new Client({
      apiKey: process.env.FREEPROXY_API_KEY || 'your-api-key-here',
    });
    const proxies = await client.query();
    console.log(`Success: Got ${proxies.length} proxies`);
  } catch (error) {
    if (error instanceof FreeProxyError) {
      // Check for specific errors
      if (error.statusCode === 401) {
        console.error('Authentication failed - invalid API key');
      } else if (error.statusCode === 429) {
        console.error('Rate limit exceeded - too many requests');
      } else if (error.statusCode === 500) {
        console.error('Server error - try again later');
      } else if (!error.statusCode) {
        console.error('Network error - check your connection');
      } else {
        console.error(`API error: ${error.message}`);
      }
    } else if (error instanceof Error) {
      console.error(`Unexpected error: ${error.message}`);
    }
  }
}

main();
