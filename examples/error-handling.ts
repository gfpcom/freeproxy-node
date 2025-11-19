/**
 * Error handling example
 * Demonstrates various error scenarios
 */

import { Client } from '../src/index';

async function main() {
  console.log('Example 1: Invalid API key\n');
  try {
    const client = new Client({ apiKey: 'invalid-key' });
    await client.query();
  } catch (error) {
    console.log(`Error: ${error instanceof Error ? error.message : 'Unknown error'}\n`);
  }

  console.log('Example 2: Request timeout\n');
  try {
    const client = new Client({
      apiKey: process.env.FREEPROXY_API_KEY || 'your-api-key-here',
      timeout: 1, // 1ms timeout - will always timeout
    });
    await client.query();
  } catch (error) {
    console.log(`Error: ${error instanceof Error ? error.message : 'Unknown error'}\n`);
  }

  console.log('Example 3: Custom error handling\n');
  try {
    const client = new Client({
      apiKey: process.env.FREEPROXY_API_KEY || 'your-api-key-here',
    });
    const proxies = await client.query();
    console.log(`Success: Got ${proxies.length} proxies`);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    // Check for specific errors in the message
    if (message.includes('401')) {
      console.error('Authentication failed - invalid API key');
    } else if (message.includes('429')) {
      console.error('Rate limit exceeded - too many requests');
    } else if (message.includes('500')) {
      console.error('Server error - try again later');
    } else if (message.includes('timeout')) {
      console.error('Request timeout - connection took too long');
    } else {
      console.error(`Error: ${message}`);
    }
  }
}

main();

main();
