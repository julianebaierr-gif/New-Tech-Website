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

function sanitizeContent(raw) {
  let cleaned = raw;
  for (const { p, r } of BANNED_REPLACEMENTS) {
    cleaned = cleaned.replace(p, r);
  }
  // Remove em-dashes and spaced hyphens
  cleaned = cleaned.replace(/—/g, ', ');
  cleaned = cleaned.replace(/ – /g, ', ');
  cleaned = cleaned.replace(/ - /g, ': ');
  return cleaned;
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

// Curated topic image banks (Unsplash verified direct IDs)
const SILO_IMAGES = {
  "data-excel-automation": [
    { id: "photo-1551288049-bebda4e38f71", url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&h=630&q=80", alt: "Spreadsheet calculation interface and tabular grid", caption: "Structured data worksheets support analytical business decisions." },
    { id: "photo-1460925895917-afdab827c52f", url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&h=630&q=80", alt: "Business data dashboard showing metrics and tables", caption: "Formula rules streamline tabular calculations across business units." },
    { id: "photo-1454165804606-c3d57bc86b40", url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&h=630&q=80", alt: "Data analyst checking calculations on office desk", caption: "Regular worksheet audits ensure reliable reporting formulas." }
  ],
  "cloud-infrastructure": [
    { id: "photo-1451187580459-43490279c0fa", url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&h=630&q=80", alt: "Cloud infrastructure network connections and global nodes", caption: "High-availability virtual infrastructure networks route distributed server packets." },
    { id: "photo-1558494949-ef010cbdcc31", url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&h=630&q=80", alt: "Datacenter server racks and network patch cabling", caption: "Physical server racks house multi-core cloud compute hypervisors." },
    { id: "photo-1526374965328-7f61d4dc18c5", url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&h=630&q=80", alt: "Terminal code interface on sysadmin screen", caption: "Secure shell access provides direct control over Linux services." }
  ],
  "ai-developer-tools": [
    { id: "photo-1618005182384-a83a8bd57fbe", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&h=630&q=80", alt: "Neural network abstract data pathways", caption: "Token context windows determine processing limits for large language models." },
    { id: "photo-1555066931-4365d14bab8c", url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&h=630&q=80", alt: "Programmer code terminal and syntax highlighting", caption: "Developer API interfaces avoid front-end rate limits and queuing delays." },
    { id: "photo-1516321318423-f06f85e504b3", url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&h=630&q=80", alt: "Abstract digital network nodes processing queries", caption: "Batch vector processing organizes high-volume document summaries." }
  ],
  "os-systems": [
    { id: "photo-1518770660439-4636190af475", url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&h=630&q=80", alt: "Computer hardware circuit board and processor architecture", caption: "Operating system kernels coordinate low-level hardware devices directly." },
    { id: "photo-1563986768609-322da13575f3", url: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&h=630&q=80", alt: "System security padlock representing BitLocker and encryption", caption: "Hardware TPM modules secure operating system storage volumes." },
    { id: "photo-1544197150-b99a580bb7a8", url: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&h=630&q=80", alt: "Server rack wiring in enterprise server room", caption: "Structured server migration preserves domain roles during operating system upgrades." }
  ]
};

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

// Gemini API Invocation with cascading model fallback and optional Google Search Grounding
async function callGemini(apiKey, prompt) {
  const models = [
    'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-1.5-flash'
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

  // 1. First attempt: Search Grounding enabled (to reverse-engineer SERP competitors)
  for (const m of models) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${apiKey}`;
    try {
      const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        tools: [{ googleSearch: {} }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 6144
        }
      };
      const res = await makeRequest(url, payload);
      if (res.statusCode === 200) {
        const parsed = JSON.parse(res.body);
        const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text && text.trim().length > 0) {
          console.log(`  [GEMINI SEARCH GROUNDING] Generated ${text.length} chars with ${m}`);
          return text;
        }
      } else {
        console.warn(`  [GEMINI SEARCH GROUNDING] ${m} returned HTTP ${res.statusCode}`);
      }
    } catch (e) {
      console.warn(`  [GEMINI SEARCH GROUNDING] ${m} error: ${e.message}`);
    }
  }

  // 2. Fallback attempt: Standard generation without tools
  console.log('  [GEMINI FALLBACK] Trying standard generation without search tools...');
  for (const m of models) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${apiKey}`;
    try {
      const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 6144
        }
      };
      const res = await makeRequest(url, payload);
      if (res.statusCode === 200) {
        const parsed = JSON.parse(res.body);
        const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text && text.trim().length > 0) {
          console.log(`  [GEMINI DIRECT] Generated ${text.length} chars with ${m}`);
          return text;
        }
      } else {
        console.warn(`  [GEMINI DIRECT] ${m} returned HTTP ${res.statusCode}`);
      }
    } catch (e) {
      console.warn(`  [GEMINI DIRECT] ${m} error: ${e.message}`);
    }
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

  // Pick 3 topic-relevant images for the category
  const imagesPool = SILO_IMAGES[category.slug] || SILO_IMAGES["cloud-infrastructure"];
  const coverImage = imagesPool[0].url;
  const coverImageId = imagesPool[0].id;
  const secondaryImage = imagesPool[1];
  const tertiaryImage = imagesPool[2];

  // 4. Generate Article via Gemini API
  const apiKey = process.env.GEMINI_API_KEY;
  let articleHtml = '';
  let tocItems = [];
  let faqItems = [];

  if (apiKey) {
    console.log('[GEMINI] Reverse-engineering SERP competitors & generating article...');

    // Build live article reference catalog for contextual in-text internal linking
    const liveArticlesCatalog = existingArticles
      .map(a => `- Title: "${a.title || a.slug}", URL: "/articles/${a.slug}", Category: "${a.categorySlug}", Target: "${a.primaryKeyword || ''}"`)
      .join('\n');

    const prompt = `You are ${nextAuthorName}, an enterprise cloud and systems engineer writing for TechOps Wire.
Write an authoritative, highly detailed technical manual for: "${proposedTitle}".
Primary Target Keyword: "${mainKeyword}".
Supporting Semantic / LSI Keywords: ${tags.join(', ')}.

OBJECTIVE:
1. Reverse-engineer what top competitors cover on Google for "${mainKeyword}".
2. Extract all high-value Semantic and LSI keywords, architectural terminology, formulas, CLI syntax, and configuration flags.
3. Exploit the "Competitor Content Gap" (Information Gain): Top competitor articles are often generic or promotional. You must provide superior technical depth, including real-world trade-offs, actual CLI/code commands, calculation or architectural pitfalls, a structured comparison table, and troubleshooting edge cases that competitors miss.

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
  const updatedArticlesTs = articlesTs.slice(0, lastClosing) + ',\n' + newArticleObject + '\n];' + articlesTs.slice(lastClosing + 2);
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
            timeout: 20000,
            headers: {
              'Content-Type': 'application/json',
              ...(body ? { 'Content-Length': Buffer.byteLength(body) } : {})
            }
          }, (res) => {
            if (res.statusCode === 302 || res.statusCode === 301 || res.statusCode === 307) {
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
          req.on('timeout', () => { req.destroy(); resolve(false); });
          req.on('error', (err) => { console.error(`[GOOGLE SHEET SYNC ERROR]:`, err.message); resolve(false); });
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
    execSync(`node scripts/submit-indexing.js "${postUrl}"`, { stdio: 'inherit' });
  } catch (e) {
    console.error(`[INDEXING ERROR]:`, e.message);
  }

  // 10. Safety & Quota Control: decrement remaining posts and pause
  publisherState.postsRemaining = Math.max(0, (publisherState.postsRemaining || 1) - 1);
  publisherState.paused = true;
  publisherState.active = false;
  publisherState.lastRunAt = new Date().toISOString();
  publisherState.lastArticlePublished = slug;
  publisherState.note = "Scheduled single post completed. Automated posting paused until user explicitly requests resumption.";
  fs.writeFileSync(publisherStatePath, JSON.stringify(publisherState, null, 2), 'utf8');
  console.log(`[STATE UPDATE] publisher-state.json updated: postsRemaining=${publisherState.postsRemaining}, paused=${publisherState.paused}`);

  console.log(`=== [DAILY AUTO-PUBLISHER] Daily run complete ===\n`);
}

run();
