const https = require('https');
const fs = require('fs');

function appendSummary(text) {
  if (process.env.GITHUB_STEP_SUMMARY) {
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, text + '\n');
  }
}

async function testGemini(apiKey) {
  if (!apiKey || apiKey.trim() === '') {
    return { ok: false, msg: "Secret 'GEMINI_API_KEY' is missing or empty in GitHub Secrets!" };
  }
  const preview = apiKey.substring(0, 4) + '...' + apiKey.substring(apiKey.length - 3);

  return new Promise((resolve) => {
    // Test Gemini API with gemini-2.5-flash or gemini-1.5-flash
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const req = https.get(url, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const data = JSON.parse(body);
            const models = data.models?.map(m => m.name.replace('models/', '')) || [];
            const count = models.length;
            const sample = models.filter(m => m.includes('flash') || m.includes('pro')).slice(0, 4).join(', ');
            resolve({ ok: true, msg: `Verified! (${count} models detected, e.g. ${sample})` });
          } catch {
            resolve({ ok: true, msg: `Verified successfully! (Key preview: ${preview})` });
          }
        } else {
          try {
            const err = JSON.parse(body);
            resolve({ ok: false, msg: `HTTP ${res.statusCode}: ${err.error?.message || body}` });
          } catch {
            resolve({ ok: false, msg: `HTTP ${res.statusCode}: ${body}` });
          }
        }
      });
    });

    req.on('error', (e) => {
      resolve({ ok: false, msg: `Network error: ${e.message}` });
    });
  });
}

async function testUnsplash(accessKey) {
  if (!accessKey || accessKey.trim() === '') {
    return { ok: false, msg: "Secret 'UNSPLASH_ACCESS_KEY' is missing or empty in GitHub Secrets!" };
  }
  const preview = accessKey.substring(0, 4) + '...' + accessKey.substring(accessKey.length - 3);

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
          resolve({ ok: true, msg: `Verified successfully! (Key preview: ${preview})` });
        } else {
          try {
            const err = JSON.parse(body);
            const errDetail = err.errors ? err.errors.join(', ') : body;
            resolve({ ok: false, msg: `HTTP ${res.statusCode}: ${errDetail}` });
          } catch {
            resolve({ ok: false, msg: `HTTP ${res.statusCode}: ${body}` });
          }
        }
      });
    });

    req.on('error', (e) => {
      resolve({ ok: false, msg: `Network error: ${e.message}` });
    });
  });
}

async function main() {
  appendSummary("# 🔑 GitHub Actions API Key Verification Report\n");
  appendSummary("| API Service | Secret Name | Status | Details |");
  appendSummary("| :--- | :--- | :--- | :--- |");

  console.log("Checking Gemini API Key...");
  const gemini = await testGemini(process.env.GEMINI_API_KEY);
  console.log(`Gemini: ${gemini.ok ? 'OK' : 'FAILED'} - ${gemini.msg}`);
  appendSummary(`| **Google Gemini API** | \`GEMINI_API_KEY\` | ${gemini.ok ? '✅ ACTIVE' : '❌ FAILED'} | ${gemini.msg} |`);

  console.log("Checking Unsplash Access Key...");
  const unsplash = await testUnsplash(process.env.UNSPLASH_ACCESS_KEY);
  console.log(`Unsplash: ${unsplash.ok ? 'OK' : 'FAILED'} - ${unsplash.msg}`);
  appendSummary(`| **Unsplash API** | \`UNSPLASH_ACCESS_KEY\` | ${unsplash.ok ? '✅ ACTIVE' : '❌ FAILED'} | ${unsplash.msg} |`);

  appendSummary("\n---");
  if (gemini.ok && unsplash.ok) {
    appendSummary("\n### 🎉 All API keys are verified, active, and ready for automated publishing!");
    process.exit(0);
  } else {
    appendSummary("\n### ⚠️ Action Required:\nPlease verify the secret names in **Settings → Secrets and variables → Actions** and ensure the keys are copied correctly.");
    process.exit(1);
  }
}

main();
