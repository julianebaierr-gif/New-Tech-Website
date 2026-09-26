const fs = require('fs');
const path = require('path');
const https = require('https');
const { sanitizeAllContent } = require('./sanitize-rules.js');

// 1. Google Suggest LSI Extractor (50+ Keywords)
async function fetchGoogleLsiKeywords(keyword) {
  const getSuggest = (query) => new Promise((resolve) => {
    https.get('https://suggestqueries.google.com/complete/search?client=firefox&q=' + encodeURIComponent(query), (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed[1] || []);
        } catch {
          resolve([]);
        }
      });
    }).on('error', () => resolve([]));
  });

  const querySeeds = [
    keyword,
    'ai chips architecture',
    'ai accelerator chip architecture',
    'nvidia ai chips architecture',
    'tpu vs gpu benchmarks',
    'ai inference chip architecture',
    'ai chips cost',
    'ai chips comparison',
    'ai chips hardware specs',
    ...['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'm', 'n', 'p', 's', 't', 'v', 'w'].map(l => `ai chips ${l}`)
  ];

  const lsiSet = new Set();
  for (const seed of querySeeds) {
    const results = await getSuggest(seed);
    results.forEach(kw => {
      if (kw && kw.toLowerCase() !== keyword.toLowerCase()) {
        lsiSet.add(kw.trim());
      }
    });
    if (lsiSet.size >= 65) break;
  }

  return Array.from(lsiSet);
}

// 2. Multi-Source Competitor Scraper
async function fetchCompetitors(keyword) {
  const fetchGoogleRss = () => new Promise((resolve) => {
    https.get('https://news.google.com/rss/search?q=' + encodeURIComponent(keyword) + '&hl=en-US&gl=US&ceid=US:en', {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const items = data.match(/<item>[\s\S]*?<\/item>/g) || [];
        const competitors = [];
        for (const it of items) {
          const title = it.match(/<title>([^<]+)<\/title>/)?.[1] || '';
          const link = it.match(/<link>([^<]+)<\/link>/)?.[1] || '';
          if (title && link) {
            competitors.push({
              title: title.replace(/&quot;/g, '"').replace(/&amp;/g, '&'),
              url: link,
              snippet: `Published analysis covering ${title}`
            });
          }
          if (competitors.length >= 5) break;
        }
        resolve(competitors);
      });
    }).on('error', () => resolve([]));
  });

  const res = await fetchGoogleRss();
  return res.length > 0 ? res : [
    { title: "Nvidia Blackwell and Rubin Architecture Technical Overview", url: "https://anandtech.com/nvidia-blackwell", snippet: "Analysis of B200 dual-die package, NVLink 5 1.8TB/s bandwidth, and FP4 precision tensor engines." },
    { title: "Google Cloud TPU v5p and v6 Trillium Scaling", url: "https://cloud.google.com/tpu", snippet: "Evaluating TPU Matrix Multiply Units (MXUs), optical circuit switches, and pod interconnect topology." },
    { title: "Custom AI Accelerators: AWS Trainium2 and Meta MTIA", url: "https://semianalysis.com/custom-silicon-ai", snippet: "Comparing total cost of ownership for custom ASIC hardware versus commodity GPUs for distributed transformer training." },
    { title: "Memory Wall in AI Inference: HBM3e vs LPUs", url: "https://tomshardware.com/ai-memory-wall", snippet: "Examining memory bandwidth constraints, KV-cache offloading, and SRAM latency." },
    { title: "Edge NPU Architecture and On-Device Model Sizing", url: "https://eetimes.com/edge-ai-npus", snippet: "Quantization workflows from FP16 to INT8/INT4 on consumer neural processing units." }
  ];
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
    'gemini-flash-lite-latest',
    'gemini-pro-latest'
  ];

  function makeRequest(url, payload) {
    return new Promise((resolve, reject) => {
      const u = new URL(url);
      const req = https.request({
        hostname: u.hostname,
        path: u.pathname + u.search,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        timeout: 90000
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
          temperature: 0.3,
          maxOutputTokens: 8192
        }
      };
      const res = await makeRequest(url, payload);
      if (res.statusCode === 200) {
        const parsed = JSON.parse(res.body);
        const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text && text.trim().length > 3000) {
          console.log(`  [GEMINI CASCADE] Successfully generated ${text.length} chars with model: ${m}`);
          return text;
        }
      }
    } catch (e) {
      console.warn(`  [GEMINI CASCADE] Model ${m} failed: ${e.message}, trying next...`);
    }
  }
  return null;
}

async function run() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('ERROR: GEMINI_API_KEY is required');
    process.exit(1);
  }

  const keyword = 'ai chips news today';
  const title = 'AI Chips Architecture Guide: GPUs, TPUs, and NPUs';
  console.log(`=== [REBUILD ARTICLE] Re-engineering article for "${keyword}" ===`);

  console.log('[STEP 1] Extracting 50+ Google LSI & Semantic Keywords...');
  const lsiKeywords = await fetchGoogleLsiKeywords(keyword);
  console.log(`✓ Extracted ${lsiKeywords.length} Google LSI keywords.`);

  console.log('[STEP 2] Extracting Top 5 Competitors & Analyzing Content Gap...');
  const competitors = await fetchCompetitors(keyword);
  console.log(`✓ Extracted ${competitors.length} competitors from search.`);
  competitors.forEach((c, i) => console.log(`  ${i+1}. [${c.title}]`));

  const competitorContext = competitors.map((c, i) =>
    `Competitor ${i + 1}:\n- Title: "${c.title}"\n- URL: ${c.url}\n- Focus: "${c.snippet}"`
  ).join('\n\n');

  const lsiContext = lsiKeywords.slice(0, 50).join(', ');

  const prompt = `You are Evan Mitchell, Principal Cloud Infrastructure Specialist & Systems Administrator writing for TechOps Wire.
Write an authoritative, exhaustive, publication-grade 2,200+ word technical manual for: "${title}".
Primary Target Keyword: "${keyword}".
Secondary Target Keyword: "bridgecom semiconductors products and services".
Supporting Google LSI & Semantic Keywords (Include these naturally across sections):
${lsiContext}

LIVE SERP COMPETITOR AUDIT (Top 5 Competitors on Google):
${competitorContext}

COMPETITOR CONTENT GAP & INFORMATION GAIN OBJECTIVE:
1. Top competitors provide surface-level news blurbs, vague corporate press releases, and marketing jargon.
2. EXPLOIT THE CONTENT GAP: Provide deep systems engineering substance:
   - Memory Bandwidth Wall: Contrast High Bandwidth Memory (HBM3e) vs DDR5 vs on-chip SRAM with exact GB/s numbers.
   - Precision Formats: Analyze FP32, FP16, BF16, FP8, and FP4 throughput trade-offs during training vs inference.
   - Interconnect Topologies: Compare NVLink 5 (1.8 TB/s bidirectional), PCIe Gen 5 (128 GB/s), and Google Optical Circuit Switches (OCS).
   - Real CLI Commands: Provide realistic terminal commands for NVIDIA SMI performance queries, Docker GPU passthrough, and Google Cloud TPU provisioning.
   - 5-Column Technical Comparison Table: Compare Nvidia B200/H100, Google TPU v5p/v6, AWS Trainium2, Apple M4 NPU, and Groq LPU.
   - Production TCO Formula: Real equation calculating hourly compute, data egress, storage IOPS, and power efficiency per token.
   - Troubleshooting Section: Cover 4 real failure modes (thermal throttling, memory fragmentation in vLLM KV-cache, PCIe bottlenecking, CUDA driver mismatch).

CRITICAL LENGTH & DEPTH MANDATE:
- The article MUST be at least 2,000 words of rich technical instruction.
- Each H2 section MUST contain at least 3 to 4 dense, highly informative paragraphs with code or tabular data.
- Never write brief 1-sentence or 1-paragraph sections.

STRUCTURE REQUIREMENTS:
1. Lead Paragraph:
   <p class="lead text-lg text-slate-700 leading-relaxed mb-6">...</p>
   Direct explanation of current ${keyword}, architectural shift from monolithic processors to domain-specific silicon accelerators, and practical trade-offs.

2. Quick Action Summary Card:
   <div class="my-6 p-5 bg-slate-50 border border-slate-200 rounded-xl">
     <h4 class="text-xs font-bold text-blue-900 uppercase tracking-wider mb-1.5 font-mono">Quick Hardware Sizing Matrix</h4>
     <p class="text-slate-700 text-sm">...</p>
   </div>

3. Exactly 7 Major Sections:
   <h2 id="silicon-taxonomy" class="text-2xl font-bold text-slate-900 mt-10 mb-4 scroll-mt-24">1. The Silicon Taxonomy: GPUs, TPUs, and NPUs</h2>
   <h2 id="memory-bandwidth-wall" class="text-2xl font-bold text-slate-900 mt-10 mb-4 scroll-mt-24">2. The Memory Bandwidth Wall: HBM3e vs SRAM vs DDR5</h2>
   <h2 id="architectural-comparison-matrix" class="text-2xl font-bold text-slate-900 mt-10 mb-4 scroll-mt-24">3. Architectural Comparison Matrix (5-Column Benchmarks)</h2>
   <h2 id="interconnect-and-networking" class="text-2xl font-bold text-slate-900 mt-10 mb-4 scroll-mt-24">4. Cluster Interconnects: NVLink 5, InfiniBand, and RoCE v2</h2>
   <h2 id="implementation-workflow" class="text-2xl font-bold text-slate-900 mt-10 mb-4 scroll-mt-24">5. Production Deployment Workflow and CLI Verification</h2>
   <h2 id="operational-cost-modeling" class="text-2xl font-bold text-slate-900 mt-10 mb-4 scroll-mt-24">6. Operational TCO and Power Efficiency Calculations</h2>
   <h2 id="troubleshooting-and-pitfalls" class="text-2xl font-bold text-slate-900 mt-10 mb-4 scroll-mt-24">7. Production Failure Modes and Troubleshooting Runbook</h2>

4. Clean 5-Column HTML Table in Section 3:
   <div class="my-6 overflow-x-auto">
     <table class="min-w-full text-sm text-left border border-slate-200 rounded-lg">
       <thead class="bg-slate-100 text-slate-800 font-semibold border-b border-slate-200">
         <tr><th class="px-4 py-3">Silicon Architecture</th><th class="px-4 py-3">Primary Compute Target</th><th class="px-4 py-3">Memory Capacity & Bandwidth</th><th class="px-4 py-3">Interconnect Protocol</th><th class="px-4 py-3">TDP & Operational Profile</th></tr>
       </thead>
       <tbody class="divide-y divide-slate-200 text-slate-700">
         ...
       </tbody>
     </table>
   </div>

5. Exact CLI Code Blocks in Section 5:
   <pre class="bg-slate-900 text-slate-100 p-4 rounded-xl overflow-x-auto text-sm font-mono my-4"><code>...</code></pre>

6. In-Text Internal Links:
   Naturally embed links inside sentences to:
   - <a href="/articles/benefits-of-cloud-computing" class="text-blue-600 font-medium hover:underline">business benefits of cloud computing</a>
   - <a href="/articles/aws-ec2-instance-types-explained" class="text-blue-600 font-medium hover:underline">AWS EC2 instance types and sizing steps</a>
   - <a href="/articles/docker-container-architecture" class="text-blue-600 font-medium hover:underline">Docker container architecture</a>

7. FAQs Section:
   5 technical FAQs answering deep hardware questions.
   Also output them at the very end in a \`\`\`json block.

STRICT WRITING RULES:
- ZERO AI BUZZWORDS: Never use: delve, tapestry, demystify, testament, bulletproof, robust, cornerstone, paradigm, leverage, orchestrate, seamless, seamlessly, unlock, pivotal, beacon, elevate, harness, embark, powerhouse, realm, evolution, plethora, game-changer, vital, comprehensive guide, deep dive, in-depth, discover, explore, modern, digital, pipelines, consumption, technical, verified.
- ZERO EM-DASHES: Do NOT use the em-dash character '—' or spaced hyphens ' - ' anywhere. Use commas, colons, or parentheses.
- Format: Return valid HTML for the article body followed by the \`\`\`json FAQ block.`;

  console.log('[STEP 3] Generating 2,200+ word authoritative manual with Gemini...');
  const raw = await callGemini(apiKey, prompt);
  if (!raw) {
    console.error('ERROR: Gemini generation failed.');
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

  // Extract TOC
  const tocItems = [];
  const h2Regex = /<h2(?:\s+id="([^"]+)")?[^>]*>([^<]+)<\/h2>/gi;
  let m;
  while ((m = h2Regex.exec(finalHtml)) !== null) {
    const id = m[1] || slugify(m[2]);
    tocItems.push({ id, title: m[2].trim(), level: 2 });
  }

  const wordCount = finalHtml.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  console.log(`[GENERATION SUCCESS] Generated ${finalHtml.length} chars (${wordCount} words) of high-depth HTML!`);
  console.log(`[TOC] Extracted ${tocItems.length} H2 sections:`, tocItems.map(t => t.title));

  // Update articles.ts
  const articlesPath = path.join(__dirname, '../src/data/articles.ts');
  let fileContent = fs.readFileSync(articlesPath, 'utf8');

  const slug = 'ai-chips-news-today';
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

  // Update authorId to evan-mitchell
  block = block.replace(/authorId:\s*"[^"]+"/, 'authorId: "evan-mitchell"');
  block = block.replace(/difficulty:\s*"[^"]+"/, 'difficulty: "Advanced"');
  block = block.replace(/readingTimeMinutes:\s*\d+/, 'readingTimeMinutes: 11');

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

  fs.writeFileSync(articlesPath, fileContent, 'utf8');
  console.log('[SUCCESS] Successfully updated ai-chips-news-today in src/data/articles.ts!');
}

run().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
