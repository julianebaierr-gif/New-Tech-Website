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
    'benefits of cloud computing for business',
    'benefits of cloud computing architecture',
    'benefits of cloud migration cost analysis',
    'capex vs opex cloud computing formula',
    'cloud computing scalability vs elasticity',
    'cloud multi-region disaster recovery rpo rto',
    'cloud zero trust kms iam security',
    'cloud data egress cost optimization',
    'public cloud vs private cloud vs hybrid cloud',
    'cloud computing financial roi modeling',
    'cloud computing high availability sla',
    ...['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'm', 'n', 'p', 's', 't', 'v', 'w'].map(l => `benefits of cloud ${l}`)
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
    { title: "AWS Cloud Value Framework: Quantifying Enterprise Cloud Benefits", url: "https://aws.amazon.com/cloud-value-framework", snippet: "Analysis of staff productivity, cost savings, operational resilience, and business agility metrics." },
    { title: "Google Cloud: Total Cost of Ownership and Infrastructure Modernization", url: "https://cloud.google.com/solutions/tco", snippet: "Evaluating CapEx to OpEx transitions, active-active multi-region resiliency, and managed services ROI." },
    { title: "Microsoft Azure: Cloud Economics and Migration Strategies", url: "https://azure.microsoft.com/cloud-economics", snippet: "Detailed breakdown of amortization schedules, hybrid cloud governance, and reserved instance cost reduction." },
    { title: "IBM: Hybrid Cloud Infrastructure and Financial Modeling", url: "https://ibm.com/topics/cloud-computing-benefits", snippet: "Exploration of regulatory data isolation, zero trust security parameters, and containerized workload mobility." },
    { title: "Cloudflare: Scalability, Edge Latency, and Egress Cost Containment", url: "https://cloudflare.com/learning/cloud/what-is-cloud-computing", snippet: "Examining bandwidth egress traps, distributed object storage, and global CDN caching efficiency." }
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

  const keyword = 'benefits of cloud computing';
  const title = 'Business Benefits of Cloud Computing: Architecture, ROI & Scale';
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
Secondary Target Keywords: benefits of cloud migration, cloud infrastructure scalability, capex vs opex cloud, multi-region disaster recovery.
Supporting Google LSI & Semantic Keywords (Include these naturally across sections):
${lsiContext}

LIVE SERP COMPETITOR AUDIT (Top 5 Competitors on Google):
${competitorContext}

COMPETITOR CONTENT GAP & INFORMATION GAIN OBJECTIVE:
1. Top competitors provide generic, high-level marketing claims ("increase agility", "accelerate innovation", "reduce IT overhead").
2. EXPLOIT THE CONTENT GAP: Provide deep systems engineering substance:
   - Financial Unit Economics: Exact CapEx amortization vs OpEx variable cost modeling, Net Present Value (NPV), and Total Cost of Ownership (TCO) calculation for migration.
   - Elasticity vs Scalability: Clear mechanical differences between vertical scaling (scale-up) and horizontal auto-scaling (scale-out), threshold metrics (P95 latency, queue depth, CPU utilization), and cooling down logic.
   - High Availability & Multi-Region Resiliency: Active-Active vs Active-Passive failover, DNS routing policies (Route 53 / Cloud DNS latency routing), cross-region replication lag, RPO (Recovery Point Objective) and RTO (Recovery Time Objective) SLAs.
   - Zero Trust Security Architecture: Envelope encryption with Key Management Service (AWS KMS / GCP Cloud KMS), least-privilege IAM policies with condition keys, VPC private endpoints (PrivateLink), and mutual TLS (mTLS).
   - 5-Column Decision Matrix: Comparing On-Premises, Public Cloud (IaaS), Managed Platform (PaaS), Serverless (FaaS), and Hybrid Cloud across Latency, Elasticity, FinOps Cost Profile, Disaster Recovery RTO, and Administrative Overhead.
   - Real CLI Verification Runbook: Realistic production terminal commands for AWS CLI (Auto Scaling Group and cost anomaly query), GCP CLI (Managed Instance Group autoscaler), and a modular Terraform configuration snippet for multi-AZ VPC subnets.
   - Operational Edge Cases & FinOps Pitfalls: Real failure modes (cross-AZ and cross-region egress charges, zombie EBS volumes/disks, unattached elastic IPs, orphaned snapshots, idle reserved capacity).

CRITICAL LENGTH & DEPTH MANDATE:
- The article MUST be at least 2,200 words of rich technical instruction.
- Each H2 section MUST contain at least 3 to 4 dense, highly informative paragraphs with code or tabular data.
- Never write brief 1-sentence or 1-paragraph sections.
- NEVER NUMBER HEADINGS! Do NOT prefix headings with "1.", "2.", "Section 1", or any digits.

STRUCTURE REQUIREMENTS:
1. Lead Paragraph:
   <p class="lead text-lg text-slate-700 leading-relaxed mb-6">...</p>
   Direct explanation of current ${keyword}, architectural shift from hardware procurement to software-defined infrastructure, and practical trade-offs.

2. Quick Action Summary Card:
   <div class="my-6 p-5 bg-slate-50 border border-slate-200 rounded-xl">
     <h4 class="text-xs font-bold text-blue-900 uppercase tracking-wider mb-1.5 font-mono">Quick Architecture Decision Matrix</h4>
     <p class="text-slate-700 text-sm">...</p>
   </div>

3. Exactly 7 Major Sections (STRICTLY NO NUMBER PREFIXES IN HEADINGS):
   <h2 id="financial-modeling-capex-to-opex" class="text-2xl font-bold text-slate-900 mt-10 mb-4 scroll-mt-24">Financial Modeling: CapEx Amortization to OpEx Unit Economics</h2>
   <h2 id="elastic-architecture-autoscaling" class="text-2xl font-bold text-slate-900 mt-10 mb-4 scroll-mt-24">Elastic Architecture: Horizontal Autoscaling and Dynamic Workload Sizing</h2>
   <h2 id="high-availability-multi-region" class="text-2xl font-bold text-slate-900 mt-10 mb-4 scroll-mt-24">High Availability Topologies: Multi-AZ Clustering and Cross-Region Failover</h2>
   <h2 id="zero-trust-cloud-security" class="text-2xl font-bold text-slate-900 mt-10 mb-4 scroll-mt-24">Zero Trust Security Architecture and Identity Isolation (KMS and IAM)</h2>
   <h2 id="comparative-deployment-matrix" class="text-2xl font-bold text-slate-900 mt-10 mb-4 scroll-mt-24">Comparative Deployment Matrix: On-Premises, Public Cloud, Private Cloud, and Hybrid</h2>
   <h2 id="production-cli-runbook" class="text-2xl font-bold text-slate-900 mt-10 mb-4 scroll-mt-24">Production Implementation and CLI Verification Runbook (AWS, GCP, Linux)</h2>
   <h2 id="finops-pitfalls-and-troubleshooting" class="text-2xl font-bold text-slate-900 mt-10 mb-4 scroll-mt-24">Operational Edge Cases, Data Egress Traps, and FinOps Troubleshooting</h2>

4. Clean 5-Column HTML Table in Section 5:
   <div class="my-6 overflow-x-auto">
     <table class="min-w-full text-sm text-left border border-slate-200 rounded-lg">
       <thead class="bg-slate-100 text-slate-800 font-semibold border-b border-slate-200">
         <tr><th class="px-4 py-3">Deployment Model</th><th class="px-4 py-3">Capital vs Operating Cost</th><th class="px-4 py-3">Elasticity & Provisioning Speed</th><th class="px-4 py-3">Reliability & Disaster Recovery</th><th class="px-4 py-3">FinOps Governance & Overhead</th></tr>
       </thead>
       <tbody class="divide-y divide-slate-200 text-slate-700">
         ...
       </tbody>
     </table>
   </div>

5. Exact Production CLI and Terraform Code Blocks in Section 6:
   <pre class="bg-slate-900 text-slate-100 p-4 rounded-xl overflow-x-auto text-sm font-mono my-4"><code>...</code></pre>

6. In-Text Internal Links:
   Naturally embed links inside sentences to:
   - <a href="/articles/aws-ec2-instance-types-explained" class="text-blue-600 font-medium hover:underline">AWS EC2 instance types and sizing steps</a>
   - <a href="/articles/docker-container-architecture" class="text-blue-600 font-medium hover:underline">Docker container architecture</a>
   - <a href="/articles/linux-file-permissions-chmod-chown" class="text-blue-600 font-medium hover:underline">Linux chmod and chown file permissions</a>
   - <a href="/articles/ai-chips-news-today" class="text-blue-600 font-medium hover:underline">AI chips architecture and hardware specs</a>

7. FAQs Handling:
   DO NOT create a "Frequently Asked Questions" or "FAQ" H2 heading in the HTML body! Our platform automatically renders the FAQ accordion separately.
   Provide 5 technical FAQs answering deep cloud engineering questions in a \`\`\`json block at the very end of your response:
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
      const parsed = JSON.parse(jsonMatch[1]);
      if (Array.isArray(parsed)) {
        faqs = parsed;
      } else if (parsed && typeof parsed === 'object') {
        const arr = parsed.faqs || parsed.faq || parsed.questions || Object.values(parsed).find(v => Array.isArray(v));
        if (Array.isArray(arr)) {
          faqs = arr;
        }
      }
    } catch (e) {
      console.warn('FAQ JSON parse error:', e.message);
    }
  }

  // Normalize FAQs
  faqs = (Array.isArray(faqs) ? faqs : []).filter(item => item && item.question && item.answer).map(item => ({
    question: String(item.question).trim(),
    answer: String(item.answer).trim()
  }));

  // Fallback high-depth technical FAQs if empty
  if (faqs.length === 0) {
    faqs = [
      {
        question: "How does cloud elasticity differ mechanically from static vertical scaling?",
        answer: "Static vertical scaling increases physical resources (vCPU, RAM) on a single machine, requiring restart latency and hitting hardware limits. Cloud elasticity dynamically adds or terminates stateless application instances horizontally behind a load balancer based on real-time metric thresholds such as P95 request latency or queue depth."
      },
      {
        question: "What are the primary operational causes of unexpected cloud egress charges?",
        answer: "Unexpected egress charges frequently stem from cross-Availability-Zone data transfers between application tiers, public IP routing instead of VPC endpoints for object storage, multi-region database replication traffic, and uncompressed log streaming to third-party monitoring platforms."
      },
      {
        question: "How do active-active multi-region architectures achieve zero-RPO disaster recovery?",
        answer: "Active-active multi-region systems route global user traffic to the nearest regional cluster using Anycast or DNS latency routing while maintaining continuous bidirectional database synchronization. Achieving near-zero RPO requires distributed consensus databases such as Google Cloud Spanner or AWS Aurora Global Database with synchronous storage replication."
      },
      {
        question: "Why does the CapEx to OpEx shift require an active FinOps governance practice?",
        answer: "CapEx requires fixed, pre-approved capital expenditure amortized over multi-year cycles. OpEx allows decentralized engineering teams to provision unconstrained variable resources in seconds, which leads to budget overruns without automated budget alert policies, anomaly detection, and tagged cost attribution."
      },
      {
        question: "How does envelope encryption secure cloud workloads against unauthorized host access?",
        answer: "Envelope encryption encrypts plaintext application data using a fast local Data Encryption Key (DEK). The DEK is then encrypted under a Key Encryption Key (KEK) managed inside a hardware security module (HSM) via AWS KMS or GCP Cloud KMS, ensuring the cloud provider and unauthorized processes cannot read keys in memory."
      }
    ];
  }

  let cleaned = raw
    .replace(/```json[\s\S]*?```/gi, '')
    .replace(/^```html\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  // Strip any leading numbers from H2 and H3 headings: e.g. <h2>1. Heading</h2> -> <h2>Heading</h2>
  cleaned = cleaned.replace(/<h([23])([^>]*)>\s*(?:\d+[\.\)]\s*|Section\s*\d+[:\s]*)([\s\S]*?)<\/h\1>/gi, '<h$1$2>$3</h$1>');

  // Remove any duplicated FAQ section from HTML body
  cleaned = cleaned.replace(/<h2[^>]*>\s*(?:\d+[\.\)]\s*)?(?:Frequently Asked Questions|FAQ)[\s\S]*$/gi, '');

  const finalHtml = sanitizeAllContent(cleaned);

  // Extract TOC
  const tocItems = [];
  const h2Regex = /<h2(?:\s+id="([^"]+)")?[^>]*>([^<]+)<\/h2>/gi;
  let m;
  while ((m = h2Regex.exec(finalHtml)) !== null) {
    let cleanTitle = m[2].replace(/^\s*\d+[\.\)]\s*/, '').trim();
    const id = m[1] || slugify(cleanTitle);
    tocItems.push({ id, title: cleanTitle, level: 2 });
  }

  const wordCount = finalHtml.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  console.log(`[GENERATION SUCCESS] Generated ${finalHtml.length} chars (${wordCount} words) of high-depth HTML!`);
  console.log(`[TOC] Extracted ${tocItems.length} H2 sections:`, tocItems.map(t => t.title));

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

  // Update metadata
  block = block.replace(/authorId:\s*"[^"]+"/, 'authorId: "evan-mitchell"');
  block = block.replace(/difficulty:\s*"[^"]+"/, 'difficulty: "Intermediate"');
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
  console.log('[SUCCESS] Successfully updated benefits-of-cloud-computing in src/data/articles.ts!');
}

run().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
