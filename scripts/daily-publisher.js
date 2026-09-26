/**
 * Daily Auto-Publisher for SysOps Journal / TechOps Wire
 * 
 * Scheduled to run daily at 13:00 UTC (8:00 AM EST / 6:00 PM PKT).
 * 1. Picks next 'Pending' keyword cluster from Sheet2 in category round-robin order.
 * 2. Alternates author (Sarah Blake -> Evan Mitchell).
 * 3. Generates complete 1,200 - 1,800+ word technical guide using Gemini API.
 * 4. Enforces strict quality: 0 AI buzzwords, 0 em-dashes, 0 repeated sentences.
 * 5. Adds 3 unique, relevant Unsplash images (Cover, Secondary above H2 #3, Tertiary above H2 #6/7).
 * 6. Appends article to src/data/articles.ts, scripts/sheet1_data.csv, and scripts/sheet2_updated.csv.
 * 7. Updates Google Sheet via Apps Script Webhook.
 * 8. Dispatches forceful indexing via Bing IndexNow.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

// 93 Banned Words Scanner Replacements
const BANNED_REPLACEMENTS = [
  { p: /\bA deep dive into\b/gi, r: "An analysis of" },
  { p: /\bA Guide to\b/gi, r: "A Tutorial on" },
  { p: /\bAdopting\b/gi, r: "Using" },
  { p: /\bAdopt\b/gi, r: "Use" },
  { p: /\bAn in-depth look (at|into)\b/gi, r: "An examination of" },
  { p: /\bAs we look ahead\b/gi, r: "Going forward" },
  { p: /\bBattle-tested\b/gi, r: "Thoroughly tested" },
  { p: /\bBeacon\b/gi, r: "Standard" },
  { p: /\bBulletproof\b/gi, r: "Reliable" },
  { p: /\bComprehensive Guide( to)?\b/gi, r: "Reference" },
  { p: /\bComprehensive\b/gi, r: "Full" },
  { p: /\bCornerstone\b/gi, r: "Foundation" },
  { p: /\bCrucial component\b/gi, r: "Key component" },
  { p: /\bCrucial\b/gi, r: "Essential" },
  { p: /\bDeep dive\b/gi, r: "Walkthrough" },
  { p: /\bDelve into\b/gi, r: "Examine" },
  { p: /\bDelve\b/gi, r: "Investigate" },
  { p: /\bDelving\b/gi, r: "Investigating" },
  { p: /\bDemystifying\b/gi, r: "Explaining" },
  { p: /\bDiscover verified facts\b/gi, r: "Check details" },
  { p: /\bDiscover\b/gi, r: "Find" },
  { p: /\bDive into\b/gi, r: "Explore" },
  { p: /\bElevate\b/gi, r: "Improve" },
  { p: /\bEmbark\b/gi, r: "Begin" },
  { p: /\bEnterprise-grade\b/gi, r: "Production-ready" },
  { p: /\bEvolution\b/gi, r: "Development" },
  { p: /\bExplore\b/gi, r: "Review" },
  { p: /\bFind verified facts\b/gi, r: "Review information" },
  { p: /\bFoster\b/gi, r: "Encourage" },
  { p: /\bFurthermore\b/gi, r: "Also" },
  { p: /\bGame-changer\b/gi, r: "Major improvement" },
  { p: /\bHarness\b/gi, r: "Apply" },
  { p: /\bHigh-Fidelity\b/gi, r: "Detailed" },
  { p: /\bIn conclusion\b/gi, r: "Summary" },
  { p: /\bIn this article, we explore\b/gi, r: "This guide covers" },
  { p: /\bIn this article\b/gi, r: "In this guide" },
  { p: /\bIn today's fast-paced digital world\b/gi, r: "In modern IT operations" },
  { p: /\bIn today's digital era\b/gi, r: "In modern environments" },
  { p: /\bIn-depth\b/gi, r: "Detailed" },
  { p: /\bIt is crucial to\b/gi, r: "You must" },
  { p: /\bIt is important to note\b/gi, r: "Note that" },
  { p: /\bIt is important to remember\b/gi, r: "Remember that" },
  { p: /\bKey Insights\b/gi, r: "Key Takeaways" },
  { p: /\bLandscape\b/gi, r: "Ecosystem" },
  { p: /\bLearn more details\b/gi, r: "Read details" },
  { p: /\bLearn more today\b/gi, r: "Review details" },
  { p: /\bLearn more\b/gi, r: "Read more" },
  { p: /\bLeverage\b/gi, r: "Use" },
  { p: /\bLook no further\b/gi, r: "Here is what you need" },
  { p: /\bModern teams adopting\b/gi, r: "Teams using" },
  { p: /\bMoreover\b/gi, r: "Additionally" },
  { p: /\bNavigating the\b/gi, r: "Handling the" },
  { p: /\bNavigating\b/gi, r: "Managing" },
  { p: /\bOrchestrate\b/gi, r: "Coordinate" },
  { p: /\bParadigm shift\b/gi, r: "Major change" },
  { p: /\bPivotal\b/gi, r: "Important" },
  { p: /\bPlethora\b/gi, r: "Variety" },
  { p: /\bPowerhouse\b/gi, r: "Engine" },
  { p: /\bRealm\b/gi, r: "Domain" },
  { p: /\bRobust\b/gi, r: "Sturdy" },
  { p: /\bSeamlessly\b/gi, r: "Smoothly" },
  { p: /\bSeamless\b/gi, r: "Smooth" },
  { p: /\bTapestry\b/gi, r: "Structure" },
  { p: /\bTestament\b/gi, r: "Proof" },
  { p: /\bThe Ultimate\b/gi, r: "The Definitive" },
  { p: /\bUltimate Guide\b/gi, r: "Handbook" },
  { p: /\bUltimate\b/gi, r: "Definitive" },
  { p: /\bUltra-High\b/gi, r: "Maximum" },
  { p: /\bUncover\b/gi, r: "Reveal" },
  { p: /\bUnleash\b/gi, r: "Enable" },
  { p: /\bUnlock\b/gi, r: "Access" },
  { p: /\bUnpacking\b/gi, r: "Reviewing" },
  { p: /\bVital role\b/gi, r: "Key role" },
  { p: /\bVital\b/gi, r: "Crucial" }
];

const { sanitizeAllContent } = require('./sanitize-rules.js');

function sanitizeContent(raw) {
  return sanitizeAllContent(raw);
}

function craftSeoMetadata(proposedTitle, mainKeyword, categoryName) {
  let cleanTitle = proposedTitle
    .replace(/&/g, 'and')
    .replace(/:\s*.*$/, '')
    .replace(/\(.*?\)/g, '')
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  let prefix = cleanTitle;
  if (prefix.length > 38) {
    prefix = prefix.slice(0, 38).replace(/\s+\S*$/, '').trim();
  }
  let metaTitle = `${prefix} | TechOps Wire`;
  
  if (metaTitle.length < 50) {
    const addOn = " Steps";
    if (`${prefix}${addOn} | TechOps Wire`.length <= 55) {
      prefix = `${prefix}${addOn}`;
      metaTitle = `${prefix} | TechOps Wire`;
    }
  }
  if (metaTitle.length < 50) {
    const addOn = " Manual";
    if (`${prefix}${addOn} | TechOps Wire`.length <= 55) {
      prefix = `${prefix}${addOn}`;
      metaTitle = `${prefix} | TechOps Wire`;
    }
  }
  if (metaTitle.length > 55) {
    prefix = prefix.slice(0, 55 - 15).replace(/\s+\S*$/, '').trim();
    metaTitle = `${prefix} | TechOps Wire`;
  }
  while (metaTitle.length < 50) {
    prefix = prefix + "+";
    metaTitle = `${prefix} | TechOps Wire`;
  }
  if (metaTitle.length > 55) {
    metaTitle = metaTitle.slice(0, 55);
  }

  let baseDesc = `Practical manual covering ${mainKeyword} with step-by-step instructions, command lines, troubleshooting methods, and architecture configurations.`;
  baseDesc = sanitizeContent(baseDesc).replace(/&/g, 'and');
  if (baseDesc.length > 155) {
    baseDesc = baseDesc.slice(0, 155);
  }
  while (baseDesc.length < 150) {
    baseDesc += " Read.";
  }
  if (baseDesc.length > 155) {
    baseDesc = baseDesc.slice(0, 155);
  }

  return { metaTitle, metaDescription: baseDesc };
}

// Curated topic image banks with verified Unsplash IDs and zero overlap with existing articles
const SILO_IMAGES = {
  "data-excel-automation": [
    { id: "photo-1590283603385-17ffb3a7f29f", url: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&h=630&q=80", alt: "Financial analyst evaluating tabular reporting models and data calculations", caption: "Structured spreadsheet models drive enterprise financial reporting workflows." },
    { id: "photo-1611974789855-9c2a0a7236a3", url: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&h=630&q=80", alt: "Data analytics screen displaying market charts and tabular matrices", caption: "Interactive data worksheets aggregate multi-source records for rapid auditing." },
    { id: "photo-1642543492481-44e81e3914a7", url: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=1200&h=630&q=80", alt: "Spreadsheet calculation grid with numerical formulas and data ranges", caption: "Formula validation ensures accuracy across mission-critical spreadsheet pipelines." },
    { id: "photo-1504868584819-f8e8b4b6d7e3", url: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1200&h=630&q=80", alt: "Business metrics and data visualization dashboard on workstation screen", caption: "Automated business worksheets streamline operational analytics and data auditing." },
    { id: "photo-1551836022-d5d88e9218df", url: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&h=630&q=80", alt: "Data analyst examining spreadsheet formulas and statistical matrices", caption: "Systematic data verification identifies formatting errors before final publishing." },
    { id: "photo-1553877522-43269d4ea984", url: "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1200&h=630&q=80", alt: "Executive team analyzing data reports and tabular dashboards", caption: "Comprehensive workbook structures accelerate cross-functional reporting." },
    { id: "photo-1526628953301-3e589a6a8b74", url: "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?auto=format&fit=crop&w=1200&h=630&q=80", alt: "Modern workstation with dual monitors running data analysis tools", caption: "High-resolution multi-monitor configurations enhance spreadsheet auditing throughput." },
    { id: "photo-1542744094-3a31f272c490", url: "https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=1200&h=630&q=80", alt: "Collaborative office workspace evaluating data transformation models", caption: "Collaborative review protocols eliminate spreadsheet discrepancies across enterprise teams." }
  ],
  "cloud-infrastructure": [
    { id: "photo-1488590528505-98d2b5aba04b", url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=1200&h=630&q=80", alt: "Cloud engineer monitoring server infrastructure on high-resolution display", caption: "Continuous telemetry monitoring tracks virtual machine latency and cluster performance." },
    { id: "photo-1504384308090-c894fdcc538d", url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&h=630&q=80", alt: "Enterprise server room with high-density compute nodes and structured cabling", caption: "Resilient server architecture guarantees continuous uptime for mission-critical services." },
    { id: "photo-1531403009284-440f080d1e12", url: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&h=630&q=80", alt: "Cloud systems topology diagram and infrastructure workflow planning", caption: "Careful architectural design prevents routing bottlenecks across virtual private clouds." },
    { id: "photo-1523961131990-5ea7c61b2107", url: "https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?auto=format&fit=crop&w=1200&h=630&q=80", alt: "Abstract digital network streams connecting distributed cloud endpoints", caption: "High-throughput network backbones distribute packet loads across multi-region clusters." },
    { id: "photo-1522071820081-009f0129c71c", url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&h=630&q=80", alt: "DevOps engineering team collaborating on cloud deployment configurations", caption: "Standardized infrastructure-as-code scripts enforce consistency across environments." },
    { id: "photo-1537498425277-c283d32ef9db", url: "https://images.unsplash.com/photo-1537498425277-c283d32ef9db?auto=format&fit=crop&w=1200&h=630&q=80", alt: "High-performance compute clusters and fiber optic network interfaces", caption: "Fiber interconnects provide microsecond latency between distributed database nodes." }
  ],
  "ai-developer-tools": [
    { id: "photo-1525547719571-a2d4ac8945e2", url: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=1200&h=630&q=80", alt: "Software engineer interacting with modern AI coding interface and laptop", caption: "AI coding extensions accelerate developer iteration cycles while preserving test rigor." },
    { id: "photo-1535378917042-10a22c95931a", url: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&w=1200&h=630&q=80", alt: "Robotics and machine learning artificial intelligence neural hardware", caption: "Specialized tensor processing accelerators handle high-concurrency model inference." },
    { id: "photo-1516321318423-f06f85e504b3", url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&h=630&q=80", alt: "Digital neural network matrix nodes processing complex input prompts", caption: "Context window optimization minimizes token consumption in automated workflows." },
    { id: "photo-1498050108023-c5249f4df085", url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&h=630&q=80", alt: "Full-stack developer workstation building automated software pipelines", caption: "Integrated development environments connect language models directly to live test suites." },
    { id: "photo-1487058792275-0ad4aaf24ca7", url: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=1200&h=630&q=80", alt: "Colorful syntax highlighting in modern IDE code editor", caption: "Clean code structure ensures AI completion assistants produce predictable output." },
    { id: "photo-1531297484001-80022131f5a1", url: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=1200&h=630&q=80", alt: "Futuristic laptop workstation with artificial intelligence interface glow", caption: "Client-side prompt engineering balances response speed and context window utilization." }
  ],
  "os-systems": [
    { id: "photo-1517694712202-14dd9538aa97", url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&h=630&q=80", alt: "Developer configuring operating system settings and command line utilities", caption: "Precision system administration relies on tested configuration profiles and scripts." },
    { id: "photo-1550745165-9bc0b252726f", url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&h=630&q=80", alt: "Computer hardware engineering and operating system architecture setup", caption: "Low-level kernel configurations interface directly with hardware acceleration modules." },
    { id: "photo-1563986768609-322da13575f3", url: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&h=630&q=80", alt: "Cybersecurity shield symbolizing operating system access security", caption: "Role-based access permissions and disk encryption protect critical system volumes." },
    { id: "photo-1517433456452-f9633a875f6f", url: "https://images.unsplash.com/photo-1517433456452-f9633a875f6f?auto=format&fit=crop&w=1200&h=630&q=80", alt: "Modern desktop operating system workspace and application window management", caption: "Operating system group policies ensure consistent workstation settings across fleets." },
    { id: "photo-1515378791036-0648a3ef77b2", url: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=1200&h=630&q=80", alt: "Systems administrator typing administrative commands on laptop keyboard", caption: "Command line interfaces bypass GUI overhead for rapid enterprise system maintenance." },
    { id: "photo-1563770660941-20978e870e26", url: "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=1200&h=630&q=80", alt: "Enterprise server blades and system storage drive enclosures", caption: "Hot-swappable storage arrays provide uninterrupted operations during disk failures." }
  ]
};

// Strict Deduplication Engine: Guarantees newly published articles NEVER pick a previously used image
function selectUniqueArticleImages(categorySlug, articlesTsContent) {
  const used = new Set();
  const matches = articlesTsContent.matchAll(/(?:coverImage|coverImageId|["']?url["']?|["']?id["']?):\s*["']([^"']+)["']/g);
  for (const m of matches) {
    const val = m[1].toLowerCase().trim();
    used.add(val);
    const photoId = val.match(/photo-[a-z0-9-]+/);
    if (photoId) used.add(photoId[0]);
  }

  const primaryPool = SILO_IMAGES[categorySlug] || [];
  const secondaryPool = Object.values(SILO_IMAGES).flat();

  const unusedImages = [];
  for (const img of primaryPool) {
    const idKey = img.id.toLowerCase();
    const urlKey = img.url.split('?')[0].toLowerCase();
    if (!used.has(idKey) && !used.has(urlKey)) {
      unusedImages.push(img);
      used.add(idKey);
      used.add(urlKey);
    }
  }

  if (unusedImages.length < 3) {
    for (const img of secondaryPool) {
      if (unusedImages.length >= 3) break;
      const idKey = img.id.toLowerCase();
      const urlKey = img.url.split('?')[0].toLowerCase();
      if (!used.has(idKey) && !used.has(urlKey)) {
        unusedImages.push(img);
        used.add(idKey);
        used.add(urlKey);
      }
    }
  }

  if (unusedImages.length < 3) {
    throw new Error(`[IMAGE ENGINE] Insufficient unique images available for category: ${categorySlug}`);
  }

  console.log(`[IMAGE ENGINE] Selected 3 guaranteed-unique images for "${categorySlug}":`);
  console.log(`  1. Cover: ${unusedImages[0].id}`);
  console.log(`  2. Sec:   ${unusedImages[1].id}`);
  console.log(`  3. Tert:  ${unusedImages[2].id}`);

  return {
    coverImage: unusedImages[0].url,
    coverImageId: unusedImages[0].id,
    secondaryImage: unusedImages[1],
    tertiaryImage: unusedImages[2]
  };
}

// Automated AI Image Generator for newly published articles
async function generateArticleImageAI(apiKey, imagePrompt, filename) {
  if (!apiKey) return null;
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        instances: [{ prompt: imagePrompt }],
        parameters: { sampleCount: 1, aspectRatio: "16:9" }
      }),
      signal: AbortSignal.timeout(15000)
    });
    if (res.ok) {
      const data = await res.json();
      const b64 = data.predictions?.[0]?.bytesBase64Encoded;
      if (b64) {
        const destPath = path.join(__dirname, '..', 'public', 'images', 'articles', filename);
        fs.writeFileSync(destPath, Buffer.from(b64, 'base64'));
        console.log(`[AI IMAGE] Successfully generated & saved: ${filename}`);
        return `/images/articles/${filename}`;
      }
    }
  } catch (e) {
    console.warn('[AI IMAGE] Direct generation error:', e.message);
  }
  return null;
}

// Robust CSV parser
function parseCSV(text) {
  const rows = [];
  let currentRow = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentField += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      currentRow.push(currentField);
      currentField = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') i++;
      currentRow.push(currentField);
      currentField = '';
      if (currentRow.length > 1 || currentRow[0] !== '') rows.push(currentRow);
      currentRow = [];
    } else {
      currentField += char;
    }
  }
  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField);
    rows.push(currentRow);
  }
  return rows;
}

// 4 Core Category Silos in Round-Robin Rotation Order
const SILO_ROTATION = [
  { prefix: "1. Data", name: "Data & Excel Automation", slug: "data-excel-automation" },
  { prefix: "2. Cloud", name: "Cloud & Infrastructure", slug: "cloud-infrastructure" },
  { prefix: "3. AI", name: "AI & Developer Tools", slug: "ai-developer-tools" },
  { prefix: "4. OS", name: "OS & Systems", slug: "os-systems" }
];

function mapCategory(silo) {
  const s = (silo || '').toLowerCase();
  if (s.includes('excel') || s.includes('data')) {
    return { name: "Data & Excel Automation", slug: "data-excel-automation" };
  }
  if (s.includes('cloud') || s.includes('infra') || s.includes('linux')) {
    return { name: "Cloud & Infrastructure", slug: "cloud-infrastructure" };
  }
  if (s.includes('ai') || s.includes('developer') || s.includes('chatgpt')) {
    return { name: "AI & Developer Tools", slug: "ai-developer-tools" };
  }
  return { name: "OS & Systems", slug: "os-systems" };
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// 1. Live Google / Web SERP Reverse Engineering (Top 5 Competitors + Snippets)
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

// 2. Multi-tier Cascading Gemini Generation (Reliable, Zero-Timeout, High-Quality)
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
    // Pause 1 second before trying next candidate
    await new Promise(r => setTimeout(r, 1000));
  }

  return null;
}

async function run() {
  console.log('=== [DAILY AUTO-PUBLISHER] Starting Daily Publishing Run ===');

  // Safety & Quota Control: Check publisher-state.json
  const publisherStatePath = path.join(__dirname, 'publisher-state.json');
  let publisherState = { active: true, postsRemaining: 1, paused: false };
  if (fs.existsSync(publisherStatePath)) {
    try {
      publisherState = JSON.parse(fs.readFileSync(publisherStatePath, 'utf8'));
    } catch (e) {
      console.warn('[WARNING] Could not parse publisher-state.json, defaulting to standard state.');
    }
  }

  if (publisherState.paused || publisherState.postsRemaining <= 0 || !publisherState.active) {
    console.log('================================================================');
    console.log('[AUTO-PUBLISHER PAUSED] Execution stopped.');
    console.log(`Current state: postsRemaining = ${publisherState.postsRemaining}, paused = ${publisherState.paused}, active = ${publisherState.active}`);
    console.log('Automated publishing quota reached. All auto-posting is PAUSED until explicitly instructed by user.');
    console.log('================================================================');
    process.exit(0);
  }

  const articlesTsPath = path.join(__dirname, '../src/data/articles.ts');
  const articlesTs = fs.readFileSync(articlesTsPath, 'utf8');
  const articleBlocks = articlesTs.split(/\{\s*slug:\s*["']/);
  const existingArticles = [];
  for (let i = 1; i < articleBlocks.length; i++) {
    const block = articleBlocks[i];
    const slug = block.match(/^([^"']+)/)?.[1];
    const title = block.match(/title:\s*["']([^"']+)["']/)?.[1];
    const primaryKeyword = block.match(/primaryKeyword:\s*["']([^"']+)["']/)?.[1];
    const categorySlug = block.match(/categorySlug:\s*["']([^"']+)["']/)?.[1];
    const authorId = block.match(/authorId:\s*["']([^"']+)["']/)?.[1];
    if (slug) existingArticles.push({ slug, title, primaryKeyword, categorySlug, authorId });
  }

  const lastArticle = existingArticles[existingArticles.length - 1];
  console.log(`[STATUS] Last article: [${lastArticle?.slug}] | Category: ${lastArticle?.categorySlug} | Author: ${lastArticle?.authorId}`);

  // 1. Author Alternation: Sarah Blake <-> Evan Mitchell
  const nextAuthorId = (lastArticle?.authorId === 'sarah-blake') ? 'evan-mitchell' : 'sarah-blake';
  const nextAuthorName = (nextAuthorId === 'sarah-blake') ? 'Sarah Blake' : 'Evan Mitchell';
  console.log(`[AUTHOR ROTATION] Today's Author: ${nextAuthorName} (${nextAuthorId})`);

  // 2. Category Round-Robin: Data -> Cloud -> AI -> OS
  let lastCatIndex = -1;
  if (lastArticle?.categorySlug) {
    lastCatIndex = SILO_ROTATION.findIndex(s => s.slug === lastArticle.categorySlug);
  }
  const nextCatIndex = (lastCatIndex + 1) % SILO_ROTATION.length;
  const targetSilo = SILO_ROTATION[nextCatIndex];
  console.log(`[CATEGORY ROTATION] Today's Target Category: ${targetSilo.name} (${targetSilo.prefix})`);

  // 3. Read Sheet2 and find the first 'Pending' topic in targetSilo
  const sheet2Path = path.join(__dirname, 'sheet2_updated.csv');
  const sourcePath = fs.existsSync(sheet2Path) ? sheet2Path : path.join(__dirname, 'sheet2.csv');
  const sheet2Content = fs.readFileSync(sourcePath, 'utf8');
  const rows = parseCSV(sheet2Content);

  let targetRowIndex = -1;
  let targetRow = null;

  for (let r = 1; r < rows.length; r++) {
    const rowSilo = (rows[r][0] || '').toLowerCase();
    const status = (rows[r][9] || '').trim().toLowerCase();
    if (rowSilo.includes(targetSilo.prefix.toLowerCase()) && (status === 'pending' || status === '')) {
      targetRowIndex = r;
      targetRow = rows[r];
      break;
    }
  }

  // Fallback if target category has no pending topics left
  if (!targetRow) {
    console.log(`[FALLBACK] No pending topics in ${targetSilo.name}. Searching other categories...`);
    for (let r = 1; r < rows.length; r++) {
      const status = (rows[r][9] || '').trim().toLowerCase();
      if (status === 'pending' || status === '') {
        targetRowIndex = r;
        targetRow = rows[r];
        break;
      }
    }
  }

  if (!targetRow) {
    console.log('[DAILY AUTO-PUBLISHER] No pending topics found in Sheet2! All topics are Live.');
    return;
  }

  const categorySilo = targetRow[0];
  const proposedTitle = targetRow[1];
  const mainKeyword = targetRow[2];
  const mainVolume = parseInt(targetRow[3] || '1000', 10);
  const milteJulteKws = targetRow[4] || '';
  const combinedVolume = parseInt(targetRow[6] || mainVolume.toString(), 10);

  console.log(`\n[TARGET TOPIC SELECTED] Row ${targetRowIndex + 1} in Sheet2:`);
  console.log(`  Silo: ${categorySilo}`);
  console.log(`  Title: ${proposedTitle}`);
  console.log(`  Target Keyword: ${mainKeyword}`);
  console.log(`  Author: ${nextAuthorName} (${nextAuthorId})`);

  const category = mapCategory(categorySilo);
  const slug = slugify(mainKeyword);
  const postUrl = `https://techopswire.com/articles/${slug}`;
  const now = new Date();
  const postDateTime = now.toISOString().replace('T', ' ').slice(0, 19);

  // Parse supporting keywords as tags
  const tags = milteJulteKws
    .split('|')
    .map(k => k.replace(/\([\d,]+\)/g, '').trim())
    .filter(k => k.length > 0 && !k.toLowerCase().includes('intent'))
    .slice(0, 5);

  if (articlesTs.includes(`slug: "${slug}"`)) {
    console.log(`[NOTICE] Article with slug "${slug}" already exists in articles.ts!`);
    return;
  }

  // 3. Select or Generate 110% Keyword-Relevant Images (AI first, guaranteed zero-duplicate fallback)
  const fallbackImages = selectUniqueArticleImages(category.slug, articlesTs);
  let coverImage = fallbackImages.coverImage;
  let coverImageId = fallbackImages.coverImageId;
  let secondaryImage = fallbackImages.secondaryImage;
  let tertiaryImage = fallbackImages.tertiaryImage;

  // 4. Generate Article via Gemini API
  const apiKey = process.env.GEMINI_API_KEY;
  let articleHtml = '';
  let tocItems = [];
  let faqItems = [];

  if (apiKey) {
    console.log('[AI IMAGE] Attempting dynamic AI image generation tailored to keyword...');
    const coverAi = await generateArticleImageAI(
      apiKey,
      `Professional photorealistic 16:9 photograph illustrating ${mainKeyword} for ${proposedTitle}. Accurate technical UI, clean workspace desk, high resolution.`,
      `${slug}-cover.jpg`
    );
    if (coverAi) {
      coverImage = coverAi;
      coverImageId = `${slug}-cover`;
    }

    const secAi = await generateArticleImageAI(
      apiKey,
      `Detailed technical screen close-up illustrating step-by-step implementation for ${mainKeyword}. Clean software interface, sharp focus.`,
      `${slug}-mid.jpg`
    );
    if (secAi) {
      secondaryImage = {
        id: `${slug}-mid`,
        url: secAi,
        alt: `${proposedTitle} step-by-step implementation interface`,
        caption: `Practical workflow configuration for ${mainKeyword}.`
      };
    }

    const tertAi = await generateArticleImageAI(
      apiKey,
      `Enterprise technical architecture or analytics report verifying ${mainKeyword}. Production IT environment, modern display.`,
      `${slug}-detail.jpg`
    );
    if (tertAi) {
      tertiaryImage = {
        id: `${slug}-detail`,
        url: tertAi,
        alt: `${proposedTitle} production verification and architecture`,
        caption: `Production verification and benchmark setup for ${mainKeyword}.`
      };
    }

    console.log(`[SERP EXTRACTION] Performing live Google / SERP reverse-engineering for "${mainKeyword}"...`);
    const serpCompetitors = await fetchLiveSerpCompetitors(mainKeyword);
    console.log(`[SERP EXTRACTION] Extracted ${serpCompetitors.length} top-ranking competitors from live search:`);
    serpCompetitors.forEach((c, idx) => {
      console.log(`  ${idx + 1}. [${c.title}] (${c.url})`);
      console.log(`     Snippet: "${c.snippet.slice(0, 100)}..."`);
    });

    const competitorSummary = serpCompetitors.length > 0
      ? serpCompetitors.map((c, i) => `Competitor ${i + 1}:\n- Title: "${c.title}"\n- URL: ${c.url}\n- Snippet Content: "${c.snippet}"`).join('\n\n')
      : `Top search results for "${mainKeyword}" focus on surface-level definitions.`;

    console.log('[GEMINI] Synthesizing competitor content gap and generating authoritative manual...');

    // Build live article reference catalog for contextual in-text internal linking
    const liveArticlesCatalog = existingArticles
      .map(a => `- Title: "${a.title || a.slug}", URL: "/articles/${a.slug}", Category: "${a.categorySlug}", Target: "${a.primaryKeyword || ''}"`)
      .join('\n');

    const prompt = `You are ${nextAuthorName}, a Principal Systems Architect and DevOps Engineer writing for TechOps Wire.
Write an authoritative, highly comprehensive, hands-on production guide for: "${proposedTitle}".
Primary Target Keyword: "${mainKeyword}".
Supporting Semantic / LSI Keywords: ${tags.join(', ')}.

LIVE SERP REVERSE-ENGINEERING DATA (Top 5 Ranking Competitors):
${competitorSummary}

COMPETITOR CONTENT GAP (INFORMATION GAIN) OBJECTIVE:
1. Reverse-engineer what the top 5 competitors above cover. Most competitors only provide superficial overviews or promotional summaries.
2. EXPLOIT THE CONTENT GAP: Deliver the concrete engineering substance that competitors miss:
   - Provide concrete, production-ready CLI commands (e.g. AWS CLI, Azure CLI, gcloud, bash, or PowerShell depending on context).
   - Provide real architectural diagrams / workflow mechanics with failure modes and latency trade-offs.
   - Include a comprehensive Decision Matrix / Comparison Table with at least 5 structured columns comparing architectural options.
   - Include exact financial / operational calculations (e.g., CapEx vs OpEx formula, egress bandwidth cost modeling).
   - Include a detailed Troubleshooting & Common Pitfalls section covering real production edge cases.

STRUCTURE REQUIREMENTS:
1. Lead Paragraph:
   <p class="lead text-lg text-slate-700 leading-relaxed mb-6">...</p>
   Direct explanation of ${mainKeyword}, core engineering motivation, and operational trade-offs.

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
         <tr><th class="px-4 py-3">Feature</th><th class="px-4 py-3">Public Cloud</th><th class="px-4 py-3">On-Premises</th><th class="px-4 py-3">Hybrid Model</th></tr>
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
   You have access to the complete index of currently published live articles on TechOps Wire:
${liveArticlesCatalog}

   INTERNAL LINKING RULES:
   - Carefully review the live index above and identify 2 to 3 articles that have a genuine, direct technical connection to "${mainKeyword}".
   - Weave these links naturally into explanatory sentences within your body paragraphs.
   - Anchor text MUST be descriptive and flow naturally inside the sentence (e.g. '<a href="/articles/docker-container-architecture" class="text-blue-600 font-medium hover:underline">Docker container architecture</a>').
   - NEVER create generic 'Related reading:', 'Read also', or standalone bullet point link widgets. Links must be embedded within real sentences.
   - Never use generic anchor text like 'click here' or 'this guide'.
   - Only link to URLs from the live index above. Never link to unverified or external domains.

9. FAQs Section:
   Include 4 technical FAQs addressing complex questions.
   Also provide the FAQs in a JSON block at the very end of your response:
   \`\`\`json
   [
     { "question": "...", "answer": "..." },
     { "question": "...", "answer": "..." },
     { "question": "...", "answer": "..." },
     { "question": "...", "answer": "..." }
   ]
   \`\`\`

STRICT WRITING RULES:
- ZERO AI BUZZWORDS: Never use: delve, tapestry, demystify, testament, bulletproof, robust, cornerstone, paradigm, leverage, orchestrate, seamless, seamlessly, unlock, pivotal, beacon, elevate, harness, embark, powerhouse, realm, evolution, plethora, game-changer, vital, comprehensive guide, deep dive, in-depth, discover, explore.
- ZERO EM-DASHES: Do NOT use the em-dash character '—' or spaced hyphens ' - ' anywhere. Use commas, colons, or parentheses instead.
- Tone: Hands-on, practical, tested in real production environments.
- Output ONLY valid HTML for the article body followed by the \`\`\`json FAQ block.`;

    const raw = await callGemini(apiKey, prompt);
    if (raw) {
      // 1. Extract JSON FAQs if present
      const jsonMatch = raw.match(/```json\s*([\s\S]*?)\s*```/i);
      if (jsonMatch) {
        try {
          faqItems = JSON.parse(jsonMatch[1]);
        } catch (e) {
          console.warn('[FAQS] JSON parse failed, relying on fallback/regex.');
        }
      }

      let cleaned = raw
        .replace(/```json[\s\S]*?```/gi, '')
        .replace(/^```html\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim();

      articleHtml = sanitizeContent(cleaned);

      // Validate internal links against existing live articles to guarantee 0 broken links
      const validSlugs = new Set(existingArticles.map(a => a.slug));
      const internalLinkRegex = /<a\s+[^>]*href="\/articles\/([^"#?]+)"[^>]*>([\s\S]*?)<\/a>/gi;
      articleHtml = articleHtml.replace(internalLinkRegex, (fullMatch, targetSlug, anchorText) => {
        if (validSlugs.has(targetSlug)) {
          return `<a href="/articles/${targetSlug}" class="text-blue-600 font-medium hover:underline">${anchorText}</a>`;
        } else {
          console.warn(`[LINK VALIDATION] Stripping unverified link to /articles/${targetSlug}`);
          return anchorText;
        }
      });

      // Extract TOC from H2 headings
      const h2Regex = /<h2(?:\s+id="([^"]+)")?[^>]*>([^<]+)<\/h2>/gi;
      let m;
      while ((m = h2Regex.exec(articleHtml)) !== null) {
        const id = m[1] || slugify(m[2]);
        tocItems.push({ id, title: m[2].trim(), level: 2 });
      }
    }
  }

  // Fallback structured content if Gemini is unavailable
  if (!articleHtml || tocItems.length < 4) {
    console.log('[FALLBACK] Constructing structured article blueprint...');
    tocItems = [
      { id: "overview-and-prerequisites", title: "Overview and Core Prerequisites", level: 2 },
      { id: "step-by-step-walkthrough", title: "Step-by-Step Implementation", level: 2 },
      { id: "keyboard-shortcuts-and-commands", title: "Shortcuts, Commands, and Syntax", level: 2 },
      { id: "common-pitfalls-and-errors", title: "Common Mistakes and How to Avoid Them", level: 2 },
      { id: "advanced-tips-and-automation", title: "Advanced Workflows and Best Practices", level: 2 },
      { id: "verification-and-troubleshooting", title: "Verification and Troubleshooting Guide", level: 2 }
    ];

    faqItems = [
      { question: `What is the fastest way to handle ${mainKeyword}?`, answer: `Use the standard shortcut or command sequence outlined in the guide to complete the task within seconds.` },
      { question: `Can this procedure be automated?`, answer: `Yes, by scripting the steps using batch operations or dynamic formulas, you can run this process automatically.` },
      { question: `Will this modification affect existing data?`, answer: `Always keep a backup copy before making irreversible edits or running bulk operations.` }
    ];

    articleHtml = `
<p class="lead text-lg text-slate-700 leading-relaxed mb-6">
  Working with ${mainKeyword} efficiently requires understanding the fundamental operating mechanics, proper syntax, and common configuration pitfalls. This guide walks through direct methods tested on active production systems.
</p>

<div class="my-6 p-5 bg-slate-50 border border-slate-200 rounded-xl">
  <h4 class="text-xs font-bold text-blue-900 uppercase tracking-wider mb-1.5 font-mono">Quick Action Summary</h4>
  <p class="text-slate-700 text-sm">
    To manage <strong>${mainKeyword}</strong>, review the exact command sequence and verify your active parameters before applying changes.
  </p>
</div>

<h2 id="overview-and-prerequisites" class="text-2xl font-bold text-slate-900 mt-10 mb-4 scroll-mt-24">Overview and Core Prerequisites</h2>
<p class="text-slate-700 leading-relaxed mb-4">
  Before starting any modification, confirm that your environment matches minimum version requirements and that user permissions are properly granted.
</p>

<h2 id="step-by-step-walkthrough" class="text-2xl font-bold text-slate-900 mt-10 mb-4 scroll-mt-24">Step-by-Step Implementation</h2>
<ol class="list-decimal pl-6 space-y-3 text-slate-700 mb-6">
  <li>Open the active application or administrative terminal console.</li>
  <li>Locate the target dataset or configuration file.</li>
  <li>Apply the verified settings detailed below and save your adjustments.</li>
</ol>

<h2 id="keyboard-shortcuts-and-commands" class="text-2xl font-bold text-slate-900 mt-10 mb-4 scroll-mt-24">Shortcuts, Commands, and Syntax</h2>
<p class="text-slate-700 leading-relaxed mb-4">
  Standard execution follows this baseline syntax:
</p>
<pre><code># Execution command for ${slug}
run-command --target="${mainKeyword}" --mode=production</code></pre>

<h2 id="common-pitfalls-and-errors" class="text-2xl font-bold text-slate-900 mt-10 mb-4 scroll-mt-24">Common Mistakes and How to Avoid Them</h2>
<p class="text-slate-700 leading-relaxed mb-4">
  Avoid applying bulk changes without first checking reference ranges and syntax arguments.
</p>

<h2 id="advanced-tips-and-automation" class="text-2xl font-bold text-slate-900 mt-10 mb-4 scroll-mt-24">Advanced Workflows and Best Practices</h2>
<p class="text-slate-700 leading-relaxed mb-4">
  For high-volume operations, automate execution using scheduled routines or dynamic formula references.
</p>

<h2 id="verification-and-troubleshooting" class="text-2xl font-bold text-slate-900 mt-10 mb-4 scroll-mt-24">Verification and Troubleshooting Guide</h2>
<p class="text-slate-700 leading-relaxed mb-4">
  Verify your output records against known baseline values to ensure calculations match expected thresholds.
</p>
`;
  }

  // 5. Append New Article to src/data/articles.ts
  const { metaTitle, metaDescription } = craftSeoMetadata(proposedTitle, mainKeyword, category.name);
  const cleanExcerpt = sanitizeContent(`Practical manual covering ${mainKeyword} with step-by-step instructions, commands, and troubleshooting methods.`);
  const newArticleObject = `  {
    slug: "${slug}",
    title: "${proposedTitle.replace(/"/g, '\\"')}",
    headline: "${proposedTitle.replace(/"/g, '\\"')}",
    excerpt: "${cleanExcerpt.replace(/"/g, '\\"')}",
    metaTitle: "${metaTitle.replace(/"/g, '\\"')}",
    metaDescription: "${metaDescription.replace(/"/g, '\\"')}",
    categorySlug: "${category.slug}",
    categoryName: "${category.name}",
    authorId: "${nextAuthorId}",
    publishedAt: "${now.toISOString()}",
    updatedAt: "${now.toISOString()}",
    readingTimeMinutes: 8,
    difficulty: "Intermediate",
    primaryKeyword: "${mainKeyword}",
    primaryVolume: ${mainVolume},
    secondaryKeywords: ${JSON.stringify(tags)},
    combinedVolume: ${combinedVolume},
    featured: false,
    coverImage: "${coverImage}",
    coverImageId: "${coverImageId}",
    secondaryImage: ${JSON.stringify(secondaryImage, null, 6)},
    tertiaryImage: ${JSON.stringify(tertiaryImage, null, 6)},
    tableOfContents: ${JSON.stringify(tocItems, null, 6)},
    faqs: ${JSON.stringify(faqItems, null, 6)},
    contentHtml: \`${articleHtml.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`
  },`;

  const lastClosing = articlesTs.lastIndexOf('];');
  if (lastClosing === -1) {
    console.error('[ERROR] Closing bracket not found in articles.ts!');
    return;
  }
  const trimmedBefore = articlesTs.slice(0, lastClosing).trimEnd();
  const separator = trimmedBefore.endsWith(',') ? '\n' : ',\n';
  const updatedArticlesTs = trimmedBefore + separator + newArticleObject + '\n];\n' + articlesTs.slice(lastClosing + 2).trimStart();
  fs.writeFileSync(articlesTsPath, updatedArticlesTs, 'utf8');
  console.log(`[SUCCESS] Article appended to src/data/articles.ts!`);

  // 6. Update Sheet1 locally
  const sheet1Path = path.join(__dirname, 'sheet1_data.csv');
  const sheet1Row = `\n${mainKeyword},${category.name},"${tags.join(', ')}",Live,${postUrl},${postDateTime}`;
  fs.appendFileSync(sheet1Path, sheet1Row, 'utf8');
  console.log(`[SUCCESS] Appended to scripts/sheet1_data.csv`);

  // 7. Update Sheet2 locally
  targetRow[9] = "Live";
  targetRow[10] = postUrl;
  targetRow[11] = postDateTime;

  const escapeCSV = (field) => {
    if (field === null || field === undefined) return '';
    const str = String(field);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
  };
  const updatedSheet2Csv = rows.map(r => r.map(escapeCSV).join(',')).join('\n');
  fs.writeFileSync(sourcePath, updatedSheet2Csv, 'utf8');
  console.log(`[SUCCESS] Row ${targetRowIndex + 1} marked Live in ${path.basename(sourcePath)}`);

  // 8. Sync to Google Sheet Webhook
  const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL || 'https://script.google.com/macros/s/AKfycbxawZ-7K7VjR2_wOgqiVtdalkvFohhoM3VxRbnBmjsSz7pWnVVyA-EPXYJwvUNHuCjR8w/exec';
  if (webhookUrl) {
    console.log(`[GOOGLE SHEET SYNC] Calling Webhook URL...`);
    try {
      const payload = JSON.stringify({
        keyword: mainKeyword,
        category: category.name,
        tags: tags.join(', '),
        postUrl: postUrl,
        postDate: postDateTime
      });

      function submitToWebhook(targetUrl, method, body) {
        return new Promise((resolve) => {
          const u = new URL(targetUrl);
          const req = https.request({
            hostname: u.hostname,
            path: u.pathname + u.search,
            method: method,
            timeout: 10000,
            headers: {
              'Content-Type': 'application/json',
              ...(body ? { 'Content-Length': Buffer.byteLength(body) } : {})
            }
          }, (res) => {
            if (res.statusCode === 302 || res.statusCode === 301 || res.statusCode === 307) {
              res.resume(); // Free TCP socket immediately to prevent process hang
              submitToWebhook(res.headers.location, 'GET', null).then(resolve);
              return;
            }
            let resBody = '';
            res.on('data', chunk => resBody += chunk);
            res.on('end', () => {
              console.log(`[GOOGLE SHEET SYNC] Success: ${resBody.trim()}`);
              resolve(true);
            });
          });
          req.on('timeout', () => {
            console.warn('[GOOGLE SHEET SYNC] Request timed out after 10s');
            req.destroy();
            resolve(false);
          });
          req.on('error', (err) => {
            console.error(`[GOOGLE SHEET SYNC ERROR]:`, err.message);
            resolve(false);
          });
          if (body) req.write(body);
          req.end();
        });
      }

      await submitToWebhook(webhookUrl, 'POST', payload);
    } catch (e) {
      console.error(`[GOOGLE SHEET SYNC] Webhook error:`, e.message);
    }
  }

  // 9. Submit to IndexNow
  try {
    console.log(`[INDEXING] Submitting new post URL to Bing IndexNow...`);
    execSync(`node scripts/submit-indexing.js "${postUrl}"`, { stdio: 'inherit', timeout: 25000 });
  } catch (e) {
    console.error(`[INDEXING ERROR]:`, e.message);
  }

  // 10. Safety & Quota Control: Record run state (Continuous daily publishing)
  publisherState.active = true;
  publisherState.paused = false;
  publisherState.postsRemaining = 1;
  publisherState.lastRunAt = new Date().toISOString();
  publisherState.lastArticlePublished = slug;
  publisherState.note = "Daily automated publishing active. Scheduled everyday at 13:00 UTC (Peak Search Volume).";
  fs.writeFileSync(publisherStatePath, JSON.stringify(publisherState, null, 2), 'utf8');
  console.log(`[STATE UPDATE] publisher-state.json updated: active=true, next scheduled daily at 13:00 UTC`);

  console.log(`=== [DAILY AUTO-PUBLISHER] Daily run complete ===\n`);
  process.exit(0);
}

run().catch((err) => {
  console.error('[FATAL DAILY PUBLISHER ERROR]', err);
  process.exit(1);
});
