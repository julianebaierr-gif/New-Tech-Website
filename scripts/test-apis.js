const https = require('https');

async function testGemini(apiKey) {
  if (!apiKey || apiKey.trim() === '') {
    console.error("❌ GEMINI_API_KEY is missing or empty in GitHub Secrets!");
    return false;
  }
  console.log(`✓ GEMINI_API_KEY found (length: ${apiKey.length} characters)`);

  return new Promise((resolve) => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const data = JSON.stringify({
      contents: [{ parts: [{ text: "Respond with the word: SUCCESS" }] }]
    });

    const req = https.request(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log("✅ Gemini API connected and verified successfully!");
          resolve(true);
        } else {
          console.error(`❌ Gemini API verification failed (HTTP Status ${res.statusCode}):`, body);
          resolve(false);
        }
      });
    });

    req.on('error', (e) => {
      console.error("❌ Gemini request error:", e.message);
      resolve(false);
    });

    req.write(data);
    req.end();
  });
}

async function testUnsplash(accessKey) {
  if (!accessKey || accessKey.trim() === '') {
    console.error("❌ UNSPLASH_ACCESS_KEY is missing or empty in GitHub Secrets!");
    return false;
  }
  console.log(`✓ UNSPLASH_ACCESS_KEY found (length: ${accessKey.length} characters)`);

  return new Promise((resolve) => {
    const url = `https://api.unsplash.com/photos/random?query=technology&orientation=landscape`;
    const req = https.get(url, {
      headers: {
        'Authorization': `Client-ID ${accessKey}`,
        'User-Agent': 'TechOpsWire/1.0'
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log("✅ Unsplash API connected and verified successfully!");
          resolve(true);
        } else {
          console.error(`❌ Unsplash API verification failed (HTTP Status ${res.statusCode}):`, body);
          resolve(false);
        }
      });
    });

    req.on('error', (e) => {
      console.error("❌ Unsplash request error:", e.message);
      resolve(false);
    });
  });
}

async function main() {
  console.log("=========================================");
  console.log("   Testing GitHub Actions API Secrets    ");
  console.log("=========================================\n");

  const geminiOk = await testGemini(process.env.GEMINI_API_KEY);
  console.log("");
  const unsplashOk = await testUnsplash(process.env.UNSPLASH_ACCESS_KEY);

  console.log("\n=========================================");
  console.log("         VERIFICATION SUMMARY            ");
  console.log("=========================================");
  console.log(`Gemini API:   ${geminiOk ? "✅ WORKING" : "❌ FAILED"}`);
  console.log(`Unsplash API: ${unsplashOk ? "✅ WORKING" : "❌ FAILED"}`);

  if (geminiOk && unsplashOk) {
    console.log("\n🎉 ALL API KEYS ARE ACTIVE AND READY FOR AUTOMATION!");
    process.exit(0);
  } else {
    console.log("\n⚠️ Please check the failed key in GitHub Repository Settings -> Secrets.");
    process.exit(1);
  }
}

main();
