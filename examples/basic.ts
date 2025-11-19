/**
 * Basic usage example
 * Get proxies and print their details
 */

import { Client } from 'getfreeproxy';

async function main() {
  const client = new Client({
    apiKey: process.env.FREEPROXY_API_KEY || 'your-api-key-here',
  });

  try {
    console.log('Fetching proxies...\n');

    // Get proxies from first page
    const proxies = await client.query();

    console.log(`Got ${proxies.length} proxies\n`);

    // Print first 5 proxies
    for (let i = 0; i < Math.min(5, proxies.length); i++) {
      const proxy = proxies[i];
      console.log(`Proxy ${i + 1}:`);
      console.log(`  URL: ${proxy.proxyUrl}`);
      console.log(`  Protocol: ${proxy.protocol}`);
      console.log(`  Country: ${proxy.countryCode}`);
      console.log(`  Uptime: ${proxy.uptime}%`);
      console.log(`  Response Time: ${proxy.responseTime}s`);
      console.log(`  Anonymity: ${proxy.anonymity}`);
      console.log(`  HTTPS: ${proxy.https ? 'Yes' : 'No'}`);
      console.log(`  Google: ${proxy.google ? 'Yes' : 'No'}`);
      console.log();
    }
  } catch (error) {
    console.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    process.exit(1);
  }
}

main();
