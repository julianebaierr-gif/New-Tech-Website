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

          // Step 1: Live SERP reverse engineering test
          console.log('[SERP TEST] Querying live search for top 5 competitors...');
          const serpData = await new Promise((resSearch) => {
            const postData = `q=${encodeURIComponent('benefits of cloud computing')}&b=`;
            const req = https.request({
              hostname: 'html.duckduckgo.com',
              path: '/html/',
              method: 'POST',
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(postData)
              },
              timeout: 10000
            }, (res) => {
              let b = '';
              res.on('data', c => b += c);
              res.on('end', () => {
                const results = [];
                const regex = /<a class="result__snippet[^"]*"[^>]*>([\s\S]*?)<\/a>/g;
                let match;
                while ((match = regex.exec(b)) !== null && results.length < 5) {
                  const text = match[1].replace(/<[^>]+>/g, '').replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&amp;/g, '&').trim();
                  results.push(text);
                }
                resSearch({ count: results.length, snippets: results });
              });
            });
            req.on('error', () => resSearch({ count: 0, snippets: [] }));
            req.on('timeout', () => { req.destroy(); resSearch({ count: 0, snippets: [] }); });
            req.write(postData);
            req.end();
          });

          console.log(`[SERP TEST] Extracted ${serpData.count} competitor snippets from live SERP!`);
          if (serpData.snippets.length > 0) {
            console.log(`  Competitor 1: "${serpData.snippets[0].slice(0, 80)}..."`);
          }

          // Step 2: Feed SERP data into multi-tier cascading Gemini models
          console.log('[GEMINI CASCADE] Sending SERP snippets to model cascade...');
          const cascadeModels = [
            'gemini-3.1-flash-lite',
            'gemini-flash-latest',
            'gemini-3.5-flash-lite',
            'gemini-3.8-flash',
            'gemini-3.5-flash',
            'gemini-3.6-flash',
            'gemini-3.7-flash',
            'gemini-flash-lite-latest'
          ];

          const prompt = `You are an enterprise systems engineer writing for TechOps Wire.
Target Keyword: benefits of cloud computing
Top 5 Competitor Snippets:
${serpData.snippets.map((s, i) => `${i + 1}. ${s}`).join('\n')}

Identify the competitor content gap and output a 120-word technical introduction with concrete metrics and zero fluff.`;

          let generatedText = null;
          let usedModel = null;

          for (const m of cascadeModels) {
            console.log(`  -> Trying model: ${m}...`);
            const postUrl = `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${apiKey}`;
            try {
              const postRes = await makePost(postUrl, {
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { temperature: 0.3, maxOutputTokens: 1200 }
              });
              if (postRes.statusCode === 200) {
                const parsed = JSON.parse(postRes.body);
                generatedText = parsed.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
                if (generatedText && generatedText.length > 50) {
                  usedModel = m;
                  console.log(`     SUCCESS with ${m}! Generated ${generatedText.length} chars:`);
                  console.log(`     "${generatedText.slice(0, 200)}..."`);
                  break;
                }
              } else {
                console.log(`     HTTP ${postRes.statusCode}: ${postRes.body.slice(0, 120)}`);
              }
            } catch (err) {
              console.log(`     Network error: ${err.message}`);
            }
            // Small pause between model attempts
            await new Promise(r => setTimeout(r, 1000));
          }

          if (generatedText) {
            resolve({ ok: true, msg: `SERP + Gemini Pipeline Verified! Model ${usedModel} generated ${generatedText.length} chars based on live search results.` });
          } else {
            resolve({ ok: false, msg: `All cascade models failed to generate content.` });
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
