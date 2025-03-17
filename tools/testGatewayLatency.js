const axios = require("axios");

const CID = process.argv[2] || "bafybeid3bmwckgydkwf77bqumbmhycs3bbidc6yhnkgwjfgsjf4wfq4hdu"; // Default CID
const gateways = [
  { name: "Lighthouse", url: `https://gateway.lighthouse.storage/ipfs/${CID}` },
  { name: "DWeb", url: `https://${CID}.ipfs.dweb.link/` },
  // { name: "IPFS.io", url: `https://ipfs.io/ipfs/${CID}/` },
  { name: "Pinata", url: `https://gateway.pinata.cloud/ipfs/${CID}` },
];

const requestDelay = 2000; // Delay between requests (2 sec)
const requestCount = 3; // Number of times to hit each gateway

async function measureLatency(url) {
  try {
    const start = Date.now();
    await axios.get(url, { timeout: 10000 }); // 10s timeout
    return Date.now() - start;
  } catch (error) {
    return -1; // -1 indicates failure
  }
}

async function testGatewayLatency() {
  let results = {};

  for (const gateway of gateways) {
    console.log(`Testing ${gateway.name}...`);
    let latencies = [];

    for (let i = 0; i < requestCount; i++) {
      let latency = await measureLatency(gateway.url);
      if (latency !== -1) {
        latencies.push(latency);
      }
      console.log(`  Attempt ${i + 1}: ${latency} ms`);
      await new Promise((resolve) => setTimeout(resolve, requestDelay));
    }

    let avgLatency = latencies.length > 0 ? (latencies.reduce((a, b) => a + b, 0) / latencies.length).toFixed(2) : "Unavailable";
    results[gateway.name] = avgLatency;
  }

  console.log("\n=== Latency Results ===");
  for (const [gateway, latency] of Object.entries(results)) {
    console.log(`${gateway}: ${latency} ms`);
  }
}

testGatewayLatency();
