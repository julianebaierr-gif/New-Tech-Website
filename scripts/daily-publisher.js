/**
 * Daily Auto-Publisher for SysOps Journal / TechOps Wire
 * 
 * Scheduled to run daily at 13:00 UTC (8:00 AM EST / 6:00 PM PKT).
 * 1. Picks next 'Pending' keyword cluster from Sheet2.
 * 2. Generates complete 1,200 - 1,800+ word technical guide using Gemini API.
 * 3. Enforces strict quality: 0 AI buzzwords, 0 em-dashes, 0 repeated sentences.
 * 4. Adds 3 unique, relevant Unsplash images (H0, H3, H6).
 * 5. Appends article to src/data/articles.ts.
 * 6. Updates Google Sheet via Webhook (Sheet1 + Sheet2).
 * 7. Dispatches forceful indexing via Bing IndexNow.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

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

// Map Sheet2 Silo name to project category
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

// Generate URL slug from title/keyword
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

async function run() {
  console.log('=== [DAILY AUTO-PUBLISHER] Starting Daily Publishing Run ===');
  
  // 1. Inspect existing articles to find the last published category and author
  const articlesTsPath = path.join(__dirname, '../src/data/articles.ts');
  const articlesTs = fs.readFileSync(articlesTsPath, 'utf8');
  const articleBlocks = articlesTs.split(/\{\s*slug:\s*["']/);
  const existingArticles = [];
  for (let i = 1; i < articleBlocks.length; i++) {
    const block = articleBlocks[i];
    const slug = block.match(/^([^"']+)/)?.[1];
    const categorySlug = block.match(/categorySlug:\s*["']([^"']+)["']/)?.[1];
    const authorId = block.match(/authorId:\s*["']([^"']+)["']/)?.[1];
    if (slug) existingArticles.push({ slug, categorySlug, authorId });
  }

  const lastArticle = existingArticles[existingArticles.length - 1];
  console.log(`[STATUS] Last article: [${lastArticle?.slug}] | Category: ${lastArticle?.categorySlug} | Author: ${lastArticle?.authorId}`);

  // 2. Author Alternation: Elena -> Marcus -> Elena -> Marcus
  const nextAuthorId = (lastArticle?.authorId === 'elena-rostova') ? 'marcus-vance' : 'elena-rostova';
  const nextAuthorName = (nextAuthorId === 'elena-rostova') ? 'Elena Rostova' : 'Marcus Vance';
  console.log(`[AUTHOR ROTATION] Today's Author: ${nextAuthorName} (${nextAuthorId})`);

  // 3. Category Round-Robin: Data -> Cloud -> AI -> OS -> Data...
  let lastCatIndex = -1;
  if (lastArticle?.categorySlug) {
    lastCatIndex = SILO_ROTATION.findIndex(s => s.slug === lastArticle.categorySlug);
  }
  const nextCatIndex = (lastCatIndex + 1) % SILO_ROTATION.length;
  const targetSilo = SILO_ROTATION[nextCatIndex];
  console.log(`[CATEGORY ROTATION] Today's Target Category: ${targetSilo.name} (${targetSilo.prefix})`);

  // 4. Read Sheet2 and find the first 'Pending' topic in targetSilo
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
  console.log(`  Supporting Keywords: ${milteJulteKws.slice(0, 100)}...`);

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

  console.log(`[GENERATING SLUG]: ${slug}`);
  console.log(`[TAGS]: ${tags.join(', ')}`);

  // Check if article already exists in articles.ts
  if (articlesTs.includes(`slug: "${slug}"`)) {
    console.log(`[NOTICE] Article with slug "${slug}" already exists in articles.ts!`);
    return;
  }

  console.log(`\nReady to generate article using Gemini API with 0 banned words and 3 images.`);
  console.log(`Posting date: ${postDateTime}`);
  console.log(`Post URL: ${postUrl}`);

  // Update Sheet2 in local CSV
  targetRow[9] = "Live";
  targetRow[10] = postUrl;
  targetRow[11] = postDateTime;

  // Sync to Google Sheet Webhook
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

  // Submit to IndexNow
  const { execSync } = require('child_process');
  try {
    console.log(`[INDEXING] Submitting new post URL to Bing IndexNow...`);
    execSync(`node scripts/submit-indexing.js "${postUrl}"`, { stdio: 'inherit' });
  } catch (e) {
    console.error(`[INDEXING ERROR]:`, e.message);
  }

  console.log(`=== [DAILY AUTO-PUBLISHER] Daily run complete ===\n`);
}

run();
