/**
 * Pagination example
 * Iterate through all pages of proxies
 */

import { Client } from '../src/index';

async function main() {
  const client = new Client({
    apiKey: process.env.FREEPROXY_API_KEY || 'your-api-key-here',
  });

  try {
    console.log('Fetching proxies from all pages...\n');

    let totalProxies = 0;
    let emptyPages = 0;

    for (let page = 1; page <= 10; page++) {
      try {
        const proxies = await client.queryPage(page);

        if (proxies.length === 0) {
          console.log(`Page ${page}: No proxies found (stopping)`);
          break;
        }

        totalProxies += proxies.length;
        console.log(
          `Page ${page}: ${proxies.length} proxies (Total: ${totalProxies})`
        );

        // Print first proxy from this page
        if (proxies.length > 0) {
          const p = proxies[0];
          console.log(`  Sample: ${p.proxyUrl}`);
        }
      } catch (error) {
        console.error(`Page ${page} error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        emptyPages++;
        if (emptyPages >= 3) {
          console.log('Too many consecutive errors, stopping...');
          break;
        }
      }
    }

    console.log(`\nTotal proxies fetched: ${totalProxies}`);
  } catch (error) {
    console.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    process.exit(1);
  }
}

main();
