/**
 * Advanced filtering example
 * Query proxies with multiple filters
 */

import { Client, FreeProxyError } from '../src/index';

async function main() {
  const client = new Client({
    apiKey: process.env.FREEPROXY_API_KEY || 'your-api-key-here',
  });

  try {
    console.log('Example 1: Get US proxies\n');
    const usProxies = await client.queryCountry('US');
    console.log(`Got ${usProxies.length} US proxies\n`);

    console.log('Example 2: Get HTTPS proxies\n');
    const httpsProxies = await client.queryProtocol('https');
    console.log(`Got ${httpsProxies.length} HTTPS proxies\n`);

    console.log('Example 3: Get proxies from page 2\n');
    const page2Proxies = await client.queryPage(2);
    console.log(`Got ${page2Proxies.length} proxies from page 2\n`);

    console.log('Example 4: Combine multiple filters\n');
    const filtered = await client.query({
      country: 'US',
      protocol: 'https',
      page: 1,
    });
    console.log(`Got ${filtered.length} US HTTPS proxies\n`);

    console.log('Example 5: Filter for high-uptime proxies\n');
    const allProxies = await client.query();
    const reliable = allProxies.filter((p) => p.uptime >= 95);
    console.log(
      `Got ${reliable.length} proxies with 95%+ uptime out of ${allProxies.length}\n`
    );

    if (reliable.length > 0) {
      console.log('Top 3 most reliable proxies:');
      reliable
        .sort((a, b) => b.uptime - a.uptime)
        .slice(0, 3)
        .forEach((p, i) => {
          console.log(`  ${i + 1}. ${p.proxyUrl} (${p.uptime}% uptime)`);
        });
    }
  } catch (error) {
    if (error instanceof FreeProxyError) {
      console.error(`Error: ${error.message}`);
    } else {
      console.error('Unknown error:', error);
    }
    process.exit(1);
  }
}

main();
