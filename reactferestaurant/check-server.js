/**
 * Script to check if JSON Server is running and accessible
 * Usage: node check-server.js
 */

const http = require('http');

const PORT = 3001;
const ENDPOINTS = ['/users', '/restaurants', '/tables'];

console.log(`\n🔍 Checking JSON Server on http://localhost:${PORT}...\n`);

let checksPassed = 0;
let checksFailed = 0;

function checkEndpoint(endpoint) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: PORT,
      path: endpoint,
      method: 'GET',
      timeout: 2000
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const jsonData = JSON.parse(data);
            const isArray = Array.isArray(jsonData);
            const count = isArray ? jsonData.length : 'N/A';
            console.log(`✅ ${endpoint}: OK (Status: ${res.statusCode}, Items: ${count})`);
            checksPassed++;
            resolve(true);
          } catch (e) {
            console.log(`⚠️  ${endpoint}: Invalid JSON response`);
            checksFailed++;
            resolve(false);
          }
        } else {
          console.log(`❌ ${endpoint}: Failed (Status: ${res.statusCode})`);
          checksFailed++;
          resolve(false);
        }
      });
    });

    req.on('error', (error) => {
      console.log(`❌ ${endpoint}: Error - ${error.message}`);
      checksFailed++;
      resolve(false);
    });

    req.on('timeout', () => {
      console.log(`❌ ${endpoint}: Timeout - Server not responding`);
      req.destroy();
      checksFailed++;
      resolve(false);
    });

    req.end();
  });
}

async function checkAll() {
  for (const endpoint of ENDPOINTS) {
    await checkEndpoint(endpoint);
  }

  console.log(`\n📊 Results: ${checksPassed} passed, ${checksFailed} failed\n`);

  if (checksFailed === 0) {
    console.log('✅ All checks passed! JSON Server is running correctly.\n');
    process.exit(0);
  } else {
    console.log('❌ Some checks failed. Please ensure:');
    console.log('   1. JSON Server is running: npm run server');
    console.log('   2. Server is running on port 3001');
    console.log('   3. File db.json exists and is valid\n');
    process.exit(1);
  }
}

checkAll();

