const fs = require('fs');
const path = require('path');
const https = require('https');
const { sanitizeAllContent } = require('./sanitize-rules.js');

function fetchLiveSerpCompetitors(keyword) {
  return new Promise((resolve) => {
    const postData = `q=${encodeURIComponent(keyword)}&b=`;
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
      res.on('data', chunk => b += chunk);
      res.on('end', () => {
        const results = [];
        const itemRegex = /<h2 class="result__title">[\s\S]*?<a[^>]*class="result__url"[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>[\s\S]*?<a class="result__snippet[^"]*"[^>]*>([\s\S]*?)<\/a>/g;
        let match;
        while ((match = itemRegex.exec(b)) !== null && results.length < 5) {
          const rawUrl = match[1];
          let realUrl = rawUrl;
          const uddgMatch = rawUrl.match(/uddg=([^&]+)/);
          if (uddgMatch) realUrl = decodeURIComponent(uddgMatch[1]);
          const title = match[2].replace(/<[^>]+>/g, '').trim();
          const snippet = match[3].replace(/<[^>]+>/g, '').replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&amp;/g, '&').trim();
          results.push({ title, url: realUrl, snippet });
        }
        resolve(results);
      });
    });
    req.on('error', (e) => {
      console.warn(`[SERP SEARCH] Network error: ${e.message}`);
      resolve([]);
    });
    req.on('timeout', () => {
      req.destroy();
      console.warn('[SERP SEARCH] Request timeout');
      resolve([]);
    });
    req.write(postData);
    req.end();
  });
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

async function callGemini(apiKey, prompt) {
  const models = [
    'gemini-3.1-flash-lite',
    'gemini-flash-latest',
    'gemini-3.5-flash-lite',
    'gemini-3.8-flash',
    'gemini-3.5-flash',
    'gemini-3.6-flash',
    'gemini-3.7-flash',
    'gemini-flash-lite-latest'
  ];

  function makeRequest(url, payload) {
    return new Promise((resolve, reject) => {
      const u = new URL(url);
      const req = https.request({
        hostname: u.hostname,
        path: u.pathname + u.search,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        timeout: 60000
      }, (r) => {
        let b = '';
        r.on('data', chunk => b += chunk);
        r.on('end', () => resolve({ statusCode: r.statusCode, body: b }));
      });
      req.on('timeout', () => { req.destroy(); reject(new Error('Request Timeout')); });
      req.on('error', reject);
      req.write(JSON.stringify(payload));
      req.end();
    });
  }

  for (const m of models) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${apiKey}`;
    try {
      const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.25,
          maxOutputTokens: 8192
        }
      };
      const res = await makeRequest(url, payload);
      if (res.statusCode === 200) {
        const parsed = JSON.parse(res.body);
        const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text && text.trim().length > 200) {
          console.log(`  [GEMINI CASCADE] Successfully generated ${text.length} chars with model: ${m}`);
          return text;
        }
      } else {
        console.warn(`  [GEMINI CASCADE] ${m} returned HTTP ${res.statusCode}: ${res.body.slice(0, 150)}`);
      }
    } catch (e) {
      console.warn(`  [GEMINI CASCADE] ${m} error: ${e.message}`);
    }
    await new Promise(r => setTimeout(r, 1000));
  }

  return null;
}

async function run() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('ERROR: GEMINI_API_KEY environment variable is required.');
    process.exit(1);
  }

  const keyword = 'benefits of cloud computing';
  const title = 'Business Benefits of Cloud Computing: Architecture, ROI & Scale';
  console.log(`=== [REBUILD ARTICLE] Re-engineering article for: "${keyword}" ===`);

  console.log('[SERP SEARCH] Querying live search for top 5 competitors...');
  const competitors = await fetchLiveSerpCompetitors(keyword);
  console.log(`[SERP SEARCH] Found ${competitors.length} competitors from live SERP:`);
  competitors.forEach((c, i) => console.log(`  ${i + 1}. [${c.title}] (${c.url})\n     "${c.snippet.slice(0, 100)}..."`));

  const competitorContext = competitors.map((c, i) =>
    `Competitor ${i + 1}:\n- Title: "${c.title}"\n- URL: ${c.url}\n- Content Focus: "${c.snippet}"`
  ).join('\n\n');

  const prompt = `You are Evan Mitchell, a Principal Cloud Solutions Architect writing for TechOps Wire.
Write an authoritative, comprehensive, 2,500+ word production manual for: "${title}".
Primary Target Keyword: "${keyword}".
Supporting Semantic Keywords: benefits of cloud migration, cloud scalability, capex to opex cloud, cloud high availability, cloud multi region redundancy, cloud disaster recovery rpo rto.

LIVE SERP COMPETITOR AUDIT (Top 5 Ranking Pages on Google):
${competitorContext}

MISSION & COMPETITOR INFORMATION GAIN OBJECTIVE:
1. Top competitors on Google (IBM, Google Cloud, GeeksforGeeks, Kinsta, LumenAlta) offer surface-level marketing overviews, broad bullet points, and vague claims about "agility" and "efficiency".
2. EXPLOIT THE CONTENT GAP: Deliver the concrete technical substance that competitors omit:
   - Provide concrete, production-ready CLI commands (e.g. AWS CLI, Azure CLI, gcloud, bash).
   - Provide real architectural diagrams / workflow mechanics with failure modes and latency trade-offs.
   - Include a comprehensive Decision Matrix / Comparison Table with at least 5 structured columns comparing architectural options.
   - Include exact financial / operational calculations (e.g., CapEx vs OpEx formula, egress bandwidth cost modeling).
   - Include a detailed Troubleshooting & Common Pitfalls section covering real production edge cases.

STRUCTURE REQUIREMENTS:
1. Lead Paragraph:
   <p class="lead text-lg text-slate-700 leading-relaxed mb-6">...</p>
   Direct explanation of ${keyword}, core engineering motivation, and operational trade-offs.

2. Quick Action Summary Card:
   <div class="my-6 p-5 bg-slate-50 border border-slate-200 rounded-xl">
     <h4 class="text-xs font-bold text-blue-900 uppercase tracking-wider mb-1.5 font-mono">Quick Decision Matrix</h4>
     <p class="text-slate-700 text-sm">...</p>
   </div>

3. Exactly 6 to 7 Major Sections using:
   <h2 id="section-slug" class="text-2xl font-bold text-slate-900 mt-10 mb-4 scroll-mt-24">Heading Title</h2>
   Include practical subsections using:
   <h3 class="text-xl font-semibold text-slate-800 mt-6 mb-3">Subheading Title</h3>

4. Comprehensive Comparison / Decision Matrix Table:
   Include a clean HTML table comparing models, trade-offs, or architectures:
   <div class="my-6 overflow-x-auto">
     <table class="min-w-full text-sm text-left border border-slate-200 rounded-lg">
       <thead class="bg-slate-100 text-slate-800 font-semibold border-b border-slate-200">
         <tr><th class="px-4 py-3">Evaluation Metric</th><th class="px-4 py-3">Traditional On-Premises</th><th class="px-4 py-3">Public Cloud (IaaS/PaaS)</th><th class="px-4 py-3">Hybrid Cloud</th><th class="px-4 py-3">FinOps & Engineering Impact</th></tr>
       </thead>
       <tbody class="divide-y divide-slate-200 text-slate-700">
         ...
       </tbody>
     </table>
   </div>

5. Step-by-Step Implementation or Architecture Setup:
   <ol class="list-decimal pl-6 space-y-3 text-slate-700 mb-6">
     <li>...</li>
   </ol>

6. Real Command Snippets / CLI / Configuration:
   <pre class="bg-slate-900 text-slate-100 p-4 rounded-xl overflow-x-auto text-sm font-mono my-4"><code>...</code></pre>

7. Troubleshooting / Common Pitfalls Section:
   Detailed section covering real operational traps (such as data egress charges, misconfigured security groups, or unattached disk storage waste).

8. Contextual In-Text Internal Linking (Strict Editorial Rules):
   Weave natural internal links into sentences to existing live articles:
   - <a href="/articles/aws-ec2-instance-types-explained" class="text-blue-600 font-medium hover:underline">AWS EC2 instance types and sizing steps</a>
   - <a href="/articles/docker-container-architecture" class="text-blue-600 font-medium hover:underline">Docker container architecture</a>
   - <a href="/articles/linux-file-permissions-chmod-chown" class="text-blue-600 font-medium hover:underline">Linux chmod and chown file permissions</a>

9. FAQs Section:
   Include 5 technical FAQs addressing complex questions.
   Also provide the FAQs in a JSON block at the very end of your response:
   \`\`\`json
   [
     { "question": "...", "answer": "..." },
     { "question": "...", "answer": "..." },
     { "question": "...", "answer": "..." },
     { "question": "...", "answer": "..." },
     { "question": "...", "answer": "..." }
   ]
   \`\`\`

STRICT WRITING RULES:
- ZERO AI BUZZWORDS: Never use: delve, tapestry, demystify, testament, bulletproof, robust, cornerstone, paradigm, leverage, orchestrate, seamless, seamlessly, unlock, pivotal, beacon, elevate, harness, embark, powerhouse, realm, evolution, plethora, game-changer, vital, comprehensive guide, deep dive, in-depth, discover, explore, modern, digital, pipelines, consumption, technical, verified.
- ZERO EM-DASHES: Do NOT use the em-dash character '—' or spaced hyphens ' - ' anywhere. Use commas, colons, or parentheses instead.
- Tone: Hands-on, practical, tested in real production environments.
- Output ONLY valid HTML for the article body followed by the \`\`\`json FAQ block.`;

  console.log('[GEMINI] Calling Gemini cascade to generate complete article...');
  const raw = await callGemini(apiKey, prompt);
  if (!raw) {
    console.error('ERROR: Failed to generate article with Gemini cascade.');
    process.exit(1);
  }

  // Extract FAQs
  let faqs = [];
  const jsonMatch = raw.match(/```json\s*([\s\S]*?)\s*```/i);
  if (jsonMatch) {
    try {
      faqs = JSON.parse(jsonMatch[1]);
    } catch (e) {
      console.warn('FAQ JSON parse error:', e.message);
    }
  }

  let cleaned = raw
    .replace(/```json[\s\S]*?```/gi, '')
    .replace(/^```html\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  const finalHtml = sanitizeAllContent(cleaned);

  // Extract TOC from H2 headings
  const tocItems = [];
  const h2Regex = /<h2(?:\s+id="([^"]+)")?[^>]*>([^<]+)<\/h2>/gi;
  let m;
  while ((m = h2Regex.exec(finalHtml)) !== null) {
    const id = m[1] || slugify(m[2]);
    tocItems.push({ id, title: m[2].trim(), level: 2 });
  }

  console.log(`[GENERATION SUCCESS] Generated ${finalHtml.length} chars of HTML.`);
  console.log(`[TOC] Extracted ${tocItems.length} H2 sections:`, tocItems.map(t => t.title));
  console.log(`[FAQS] Extracted ${faqs.length} FAQs.`);

  // Update articles.ts
  const articlesPath = path.join(__dirname, '../src/data/articles.ts');
  let fileContent = fs.readFileSync(articlesPath, 'utf8');

  const slug = 'benefits-of-cloud-computing';
  const slugPos = fileContent.indexOf(`slug: "${slug}"`);
  if (slugPos === -1) {
    console.error(`ERROR: Article slug ${slug} not found in articles.ts`);
    process.exit(1);
  }

  let endPos = fileContent.indexOf('\n  },\n  {', slugPos);
  if (endPos === -1) {
    endPos = fileContent.indexOf('\n  },\n];', slugPos);
  }
  if (endPos === -1) {
    endPos = fileContent.indexOf('\n  }\n];', slugPos);
  }
  if (endPos === -1) {
    throw new Error('Could not find closing bracket of article block');
  }

  let block = fileContent.substring(slugPos, endPos);

  const tocJson = JSON.stringify(tocItems, null, 6)
    .split('\n')
    .map((l, i) => i === 0 ? l : '    ' + l)
    .join('\n');

  const faqsJson = JSON.stringify(faqs, null, 6)
    .split('\n')
    .map((l, i) => i === 0 ? l : '    ' + l)
    .join('\n');

  block = block.replace(/tableOfContents:\s*\[[\s\S]*?\],/, `tableOfContents: ${tocJson},`);
  block = block.replace(/faqs:\s*\[[\s\S]*?\],/, `faqs: ${faqsJson},`);
  const safeHtml = finalHtml.replace(/`/g, '\\`').replace(/\$/g, '\\$');
  block = block.replace(/contentHtml:\s*`[\s\S]*?`/, `contentHtml: \`\n${safeHtml}\n\``);

  fileContent = fileContent.substring(0, slugPos) + block + fileContent.substring(endPos);
  fileContent = sanitizeAllContent(fileContent);

  fs.writeFileSync(articlesPath, fileContent, 'utf8');
  console.log('[SUCCESS] Successfully updated benefits-of-cloud-computing in src/data/articles.ts!');
}

run().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
