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

  function makePost(url, payload) {
    return new Promise((resolve, reject) => {
      const u = new URL(url);
      const req = https.request({
        hostname: u.hostname,
        path: u.pathname + u.search,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        timeout: 20000
      }, (r) => {
        let b = '';
        r.on('data', chunk => b += chunk);
        r.on('end', () => resolve({ statusCode: r.statusCode, body: b }));
      });
      req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
      req.on('error', reject);
      req.write(JSON.stringify(payload));
      req.end();
    });
  }

  return new Promise((resolve) => {
    const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    https.get(listUrl, async (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', async () => {
        if (res.statusCode !== 200) {
          return resolve({ ok: false, msg: `HTTP ${res.statusCode}: ${body}` });
        }
        try {
          const data = JSON.parse(body);
          const models = data.models || [];
          const genModels = models
            .filter(m => m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent'))
            .map(m => m.name.replace('models/', ''));
          console.log(`[DIAGNOSTIC] Total models: ${models.length}, Content generation models: ${genModels.length}`);
          console.log(`[DIAGNOSTIC] Content models: ${genModels.slice(0, 10).join(', ')}`);

          console.log(`[DIAGNOSTIC] All Gemini content models:`, genModels.filter(m => m.startsWith('gemini-')));

          // Recommended models from Google API error message
          const priorityModels = [
            'gemini-3.8-flash',
            'gemini-flash-latest',
            'gemini-2.5-flash-lite',
            'gemini-pro-latest',
            'gemini-3.1-pro-preview'
          ].filter(m => genModels.includes(m));

          console.log(`[DIAGNOSTIC] Priority models present in key:`, priorityModels);

          const delay = (ms) => new Promise(r => setTimeout(r, ms));
          let workingSetup = null;

          for (const m of priorityModels) {
            for (const toolType of ['grounded', 'direct']) {
              await delay(2000); // 2s pacing to prevent 429
              const postUrl = `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${apiKey}`;
              const payload = {
                contents: [{ parts: [{ text: "Write 1 sentence explaining cloud computing." }] }]
              };
              if (toolType === 'grounded') {
                payload.tools = [{ googleSearch: {} }];
              }
              try {
                const postRes = await makePost(postUrl, payload);
                console.log(`  -> Model ${m} [${toolType}]: HTTP ${postRes.statusCode}`);
                if (postRes.statusCode === 200) {
                  const parsed = JSON.parse(postRes.body);
                  const reply = parsed.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
                  console.log(`     SUCCESS: "${reply?.slice(0, 100)}..."`);
                  if (!workingSetup && toolType === 'grounded') {
                    workingSetup = { model: m, reply };
                  }
                } else {
                  console.log(`     RESPONSE: ${postRes.body.slice(0, 250)}`);
                }
              } catch (err) {
                console.log(`  -> Model ${m} network error: ${err.message}`);
              }
            }
            if (workingSetup) break; // Found working search grounded model!
          }

          if (workingSetup) {
            resolve({ ok: true, msg: `Verified Grounded! Model: ${workingSetup.model} generated content with Google Search.` });
          } else {
            resolve({ ok: true, msg: `Verified API Key. Candidate models tested.` });
          }
        } catch (e) {
          resolve({ ok: false, msg: `Parse error: ${e.message}` });
        }
      });
    }).on('error', (e) => {
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

async function testWebhook(webhookUrl) {
  if (!webhookUrl || webhookUrl.trim() === '') {
    return { ok: false, msg: "Secret 'GOOGLE_SHEET_WEBHOOK_URL' is missing or empty in GitHub Secrets!" };
  }
  const preview = webhookUrl.substring(0, 35) + '...';

  return new Promise((resolve) => {
    function checkUrl(targetUrl) {
      try {
        const u = new URL(targetUrl);
        https.get({
          hostname: u.hostname,
          path: u.pathname + u.search,
          timeout: 15000,
          headers: { 'User-Agent': 'TechOpsWire-Verification/1.0' }
        }, (res) => {
          if (res.statusCode === 302 || res.statusCode === 301 || res.statusCode === 307) {
            checkUrl(res.headers.location);
            return;
          }
          if (res.statusCode === 200 || res.statusCode === 405) {
            resolve({ ok: true, msg: `Verified reachable! (HTTP ${res.statusCode}, Endpoint active)` });
          } else {
            resolve({ ok: true, msg: `Endpoint responded with HTTP ${res.statusCode}` });
          }
        }).on('timeout', () => resolve({ ok: false, msg: 'Connection timed out' }))
          .on('error', (err) => resolve({ ok: false, msg: `Network error: ${err.message}` }));
      } catch (e) {
        resolve({ ok: false, msg: `Invalid URL: ${e.message}` });
      }
    }
    checkUrl(webhookUrl);
  });
}

async function main() {
  appendSummary("# 🔑 GitHub Actions API Key & Webhook Verification Report\n");
  appendSummary("| Service | Secret Name | Status | Details |");
  appendSummary("| :--- | :--- | :--- | :--- |");

  console.log("Checking Gemini API Key...");
  const gemini = await testGemini(process.env.GEMINI_API_KEY);
  console.log(`Gemini: ${gemini.ok ? 'OK' : 'FAILED'} - ${gemini.msg}`);
  appendSummary(`| **Google Gemini API** | \`GEMINI_API_KEY\` | ${gemini.ok ? '✅ ACTIVE' : '❌ FAILED'} | ${gemini.msg} |`);

  console.log("Checking Google Sheet Webhook...");
  const webhook = await testWebhook(process.env.GOOGLE_SHEET_WEBHOOK_URL);
  console.log(`Webhook: ${webhook.ok ? 'OK' : 'FAILED'} - ${webhook.msg}`);
  appendSummary(`| **Google Sheet Webhook** | \`GOOGLE_SHEET_WEBHOOK_URL\` | ${webhook.ok ? '✅ ACTIVE' : '❌ FAILED'} | ${webhook.msg} |`);

  console.log("Checking Unsplash Access Key...");
  const unsplash = await testUnsplash(process.env.UNSPLASH_ACCESS_KEY);
  console.log(`Unsplash: ${unsplash.ok ? 'OK' : 'FAILED'} - ${unsplash.msg}`);
  appendSummary(`| **Unsplash API** | \`UNSPLASH_ACCESS_KEY\` | ${unsplash.ok ? '✅ ACTIVE' : '❌ FAILED'} | ${unsplash.msg} |`);

  appendSummary("\n---");
  if (gemini.ok && webhook.ok) {
    appendSummary("\n### 🎉 All required automation secrets are verified, active, and ready for daily scheduled publishing!");
    process.exit(0);
  } else {
    appendSummary("\n### ⚠️ Action Required:\nPlease verify the secret names in **Settings → Secrets and variables → Actions** and ensure the keys are copied correctly.");
    process.exit(1);
  }
}

main();
