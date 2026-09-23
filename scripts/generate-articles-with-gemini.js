const fs = require('fs');
const path = require('path');

function appendSummary(text) {
  console.log(text);
  if (process.env.GITHUB_STEP_SUMMARY) {
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, text + '\n');
  }
}

// Read API key from env or .env.local
let apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  const envLocalPath = path.join(__dirname, '..', '.env.local');
  if (fs.existsSync(envLocalPath)) {
    const lines = fs.readFileSync(envLocalPath, 'utf8').split('\n');
    for (const line of lines) {
      if (line.startsWith('GEMINI_API_KEY=')) {
        apiKey = line.split('=')[1].trim().replace(/^["']|["']$/g, '');
        break;
      }
    }
  }
}

if (!apiKey) {
  console.error("ERROR: GEMINI_API_KEY not found in process.env or .env.local!");
  process.exit(1);
}

// Banned AI words and their human replacements
const BANNED_WORDS = [
  { pattern: /\bdemystif\w*\b/gi, replacement: "explaining" },
  { pattern: /\bdelve into\b/gi, replacement: "look at" },
  { pattern: /\bdelve\b/gi, replacement: "examine" },
  { pattern: /\bdelving\b/gi, replacement: "examining" },
  { pattern: /\btapestry\b/gi, replacement: "system" },
  { pattern: /\btestament to\b/gi, replacement: "proof of" },
  { pattern: /\bbattle-tested\b/gi, replacement: "thoroughly tested" },
  { pattern: /\bbulletproof\b/gi, replacement: "reliable" },
  { pattern: /\brobust\b/gi, replacement: "stable" },
  { pattern: /\bcornerstone\b/gi, replacement: "foundation" },
  { pattern: /\bparadigm shift\b/gi, replacement: "major change" },
  { pattern: /\bleverage\b/gi, replacement: "use" },
  { pattern: /\bleveraging\b/gi, replacement: "using" },
  { pattern: /\borchestrat\w*\b/gi, replacement: "manage" },
  { pattern: /\bseamless\b/gi, replacement: "smooth" },
  { pattern: /\bseamlessly\b/gi, replacement: "smoothly" },
  { pattern: /\bunlock\b/gi, replacement: "enable" },
  { pattern: /\bpeer-reviewed\b/gi, replacement: "practically verified" },
  { pattern: /\berrata\b/gi, replacement: "corrections" },
  { pattern: /\benterprise-grade\b/gi, replacement: "high-reliability" },
  { pattern: /\bin today's fast-paced digital world\b/gi, replacement: "today" },
  { pattern: /\bin today's digital landscape\b/gi, replacement: "today" },
  { pattern: /\bfurthermore\b/gi, replacement: "also" },
  { pattern: /\bmoreover\b/gi, replacement: "in addition" },
  { pattern: /\bcrucial\b/gi, replacement: "essential" },
  { pattern: /\bvital\b/gi, replacement: "important" }
];

function sanitizeContent(html) {
  let cleaned = html;
  for (const { pattern, replacement } of BANNED_WORDS) {
    cleaned = cleaned.replace(pattern, replacement);
  }
  return cleaned;
}

async function getBestModel() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Failed to list models: HTTP ${res.status} - ${txt}`);
  }
  const data = await res.json();
  const models = data.models || [];
  
  const preferred = [
    'models/gemini-2.0-flash',
    'models/gemini-1.5-flash',
    'models/gemini-2.5-flash',
    'models/gemini-1.5-pro'
  ];

  for (const p of preferred) {
    const match = models.find(m => m.name === p && m.supportedGenerationMethods?.includes('generateContent'));
    if (match) return match.name;
  }

  const anyFlash = models.find(m => m.supportedGenerationMethods?.includes('generateContent') && m.name.includes('flash'));
  if (anyFlash) return anyFlash.name;

  return 'models/gemini-1.5-flash';
}

async function callGemini(modelName, prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/${modelName}:generateContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ]
    })
  });

  const body = await res.text();
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${body.substring(0, 300)}`);
  }

  const parsed = JSON.parse(body);
  return parsed.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

function cleanHtmlOutput(raw) {
  let cleaned = raw.trim();
  cleaned = cleaned.replace(/^```html\s*/i, '');
  cleaned = cleaned.replace(/^```\s*/i, '');
  cleaned = cleaned.replace(/\s*```$/i, '');
  return sanitizeContent(cleaned);
}

// Articles and sections to enrich with high-value technical content
const TASKS = [
  {
    slug: "excel-drop-down-list",
    sectionId: "troubleshooting-drop-down-glitches",
    sectionTitle: "Troubleshooting Blank Entries and Error Alerts",
    prompt: `You are a senior data analyst writing for TechOps Wire.
Write an in-depth, practical troubleshooting section in valid HTML for an Excel guide about drop-down lists.
Section heading: <h2 id="troubleshooting-drop-down-glitches" class="text-2xl font-bold text-slate-900 mt-10 mb-4 scroll-mt-24">Troubleshooting Blank Entries and Error Alerts</h2>
Cover:
1. Why blank cells or unexpected spaces show up in drop-downs (and how checking 'Ignore blank' helps).
2. Fixing the '#VALUE!' or 'The value does not match the data validation restrictions' error alert.
3. How to allow users to type custom entries while keeping the drop-down (changing error alert from 'Stop' to 'Warning' or 'Information').
4. How to quickly locate and remove broken data validation rules across the whole worksheet.

STRICT WRITING RULES:
- ZERO AI BUZZWORDS. Never use: delve, demystify, tapestry, testament, bulletproof, robust, cornerstone, paradigm, leverage, orchestrate, seamless, unlock.
- Write in direct, friendly, senior-technician tone.
- Output ONLY pure HTML (<p>, <ul>, <ol>, <code>, <pre><code>). No markdown code blocks, no <html> or <body> tags.`
  },
  {
    slug: "docker-container-architecture",
    sectionId: "storage-volumes-vs-bind-mounts",
    sectionTitle: "Storage Drivers: Named Volumes vs Host Bind Mounts",
    prompt: `You are a senior DevOps systems engineer writing for TechOps Wire.
Write two complete, in-depth sections in valid HTML for a Docker Architecture guide.
Include these exact two headings:
<h2 id="storage-volumes-vs-bind-mounts" class="text-2xl font-bold text-slate-900 mt-10 mb-4 scroll-mt-24">Storage Drivers: Named Volumes vs Host Bind Mounts</h2>
and
<h2 id="networking-bridge-host-overlay" class="text-2xl font-bold text-slate-900 mt-10 mb-4 scroll-mt-24">Container Networking: Bridge, Host and Overlay</h2>

Cover:
1. Difference between named volumes (stored in /var/lib/docker/volumes) and bind mounts (absolute host paths like -v /opt/app:/app). Performance and permission differences on Linux.
2. Production best practice: why databases must use named volumes.
3. Docker networking modes: Default bridge (docker0 veth pairs), host networking (port binding bypass and security risk), and overlay networking (multi-host VXLAN encapsulation across nodes).
4. Concrete CLI examples: docker volume create, docker run with -v, inspect network.

STRICT WRITING RULES:
- ZERO AI BUZZWORDS. Never use: delve, demystify, tapestry, testament, bulletproof, robust, cornerstone, paradigm, leverage, orchestrate, seamless, unlock.
- Write like a real Linux systems engineer explaining to colleagues.
- Output ONLY pure HTML with proper Tailwind-friendly tags (<p>, <ul>, <ol>, <code>, <pre><code>). No markdown code blocks.`
  },
  {
    slug: "chatgpt-file-upload-limits",
    sectionId: "context-window-vs-file-storage",
    sectionTitle: "Context Window Limits vs File Storage",
    prompt: `You are a software engineer specializing in LLM tools writing for TechOps Wire.
Write two complete sections in valid HTML for an article on ChatGPT File Upload Limits.
Include these exact two headings:
<h2 id="context-window-vs-file-storage" class="text-2xl font-bold text-slate-900 mt-10 mb-4 scroll-mt-24">Context Window Limits vs File Storage</h2>
and
<h2 id="handling-large-documents" class="text-2xl font-bold text-slate-900 mt-10 mb-4 scroll-mt-24">Preprocessing Strategies for Large PDFs &amp; Spreadsheets</h2>

Cover:
1. Difference between file storage (ChatGPT storing the raw file in the Python runtime sandbox) and the active attention context window. Why uploading a 50MB PDF doesn't mean all 50MB is read into tokens at once.
2. How the Code Interpreter environment parses files with Python (pandas, pdfplumber, pypdf) and when it hits execution timeouts.
3. Practical preprocessing strategies for large PDFs: splitting pages with pdf-lib / pypdf, extracting raw text with pdftotext, and summarizing in batches.
4. CSV & Excel strategies: removing empty rows, filtering down to relevant columns before uploading, compressing with gzip/zip.

STRICT WRITING RULES:
- ZERO AI BUZZWORDS. Never use: delve, demystify, tapestry, testament, bulletproof, robust, cornerstone, paradigm, leverage, orchestrate, seamless, unlock.
- Write clearly, practically, and directly.
- Output ONLY pure HTML. No markdown code blocks.`
  },
  {
    slug: "windows-server-2019-end-of-life",
    sectionId: "in-place-upgrade-vs-clean-migration",
    sectionTitle: "In-Place Upgrade vs Clean Side-by-Side Migration",
    prompt: `You are a senior Windows Server administrator writing for TechOps Wire.
Write two complete sections in valid HTML for an article on Windows Server 2019 End of Life.
Include these exact two headings:
<h2 id="in-place-upgrade-vs-clean-migration" class="text-2xl font-bold text-slate-900 mt-10 mb-4 scroll-mt-24">In-Place Upgrade vs Clean Side-by-Side Migration</h2>
and
<h2 id="pre-upgrade-checklist" class="text-2xl font-bold text-slate-900 mt-10 mb-4 scroll-mt-24">Pre-Upgrade System Readiness Checklist</h2>

Cover:
1. Detailed comparison between in-place upgrade (running setup.exe on running Server 2019 to go to 2022) vs side-by-side clean migration (deploying fresh Server 2022 VM and transferring roles).
2. Why Active Directory Domain Controllers and high-availability clusters should NEVER be in-place upgraded.
3. Pre-upgrade verification checklist: System state backup (VSS), hypervisor snapshot, antivirus uninstallation, checking driver compatibility, and verifying C: drive free space (at least 32GB free).
4. Step-by-step role migration tips using Storage Migration Service (SMS).

STRICT WRITING RULES:
- ZERO AI BUZZWORDS. Never use: delve, demystify, tapestry, testament, bulletproof, robust, cornerstone, paradigm, leverage, orchestrate, seamless, unlock.
- Write with practical sysadmin rigor.
- Output ONLY pure HTML. No markdown code blocks.`
  }
];

async function main() {
  appendSummary("## TechOps Wire Content Generator (Gemini API)");
  appendSummary(`- Started at: ${new Date().toISOString()}`);

  const activeModel = await getBestModel();
  appendSummary(`- Selected Active Model: **${activeModel}**`);

  const articlesFilePath = path.join(__dirname, '..', 'src', 'data', 'articles.ts');
  let articlesSource = fs.readFileSync(articlesFilePath, 'utf8');

  for (const task of TASKS) {
    appendSummary(`\n### Article [${task.slug}]`);
    try {
      appendSummary(`- Calling Gemini API (${activeModel}) for section: ${task.sectionId}...`);
      const rawHtml = await callGemini(activeModel, task.prompt);
      const cleanedHtml = cleanHtmlOutput(rawHtml);
      appendSummary(`- Received ${cleanedHtml.length} characters of HTML`);

      // Find the article block
      const slugIndex = articlesSource.indexOf(`slug: "${task.slug}"`);
      if (slugIndex === -1) {
        appendSummary(`⚠️ Slug ${task.slug} not found in articles.ts`);
        continue;
      }

      // Find the next contentHtml closing backtick
      const contentHtmlPrefix = 'contentHtml: `';
      const contentHtmlIndex = articlesSource.indexOf(contentHtmlPrefix, slugIndex);
      if (contentHtmlIndex === -1) {
        appendSummary(`⚠️ contentHtml not found for ${task.slug}`);
        continue;
      }

      const startIndex = contentHtmlIndex + contentHtmlPrefix.length;
      const searchSub = articlesSource.substring(startIndex);
      const match = searchSub.match(/`\s*\}\s*(?:,|\])/);
      if (!match) {
        appendSummary(`⚠️ Closing backtick not found for ${task.slug}`);
        continue;
      }

      const closingBacktickIndex = startIndex + match.index;

      // Insert the new HTML content
      const before = articlesSource.substring(0, closingBacktickIndex);
      const after = articlesSource.substring(closingBacktickIndex);

      articlesSource = before + "\n\n" + cleanedHtml + "\n    " + after;
      appendSummary(`✅ Successfully merged new content into ${task.slug}`);
    } catch (err) {
      appendSummary(`❌ Error generating for ${task.slug}: ${err.message}`);
      throw err;
    }
  }

  // Final check: sanitize the whole file to be 100% sure
  articlesSource = sanitizeContent(articlesSource);

  fs.writeFileSync(articlesFilePath, articlesSource, 'utf8');
  appendSummary("\n🎉 **All articles successfully written and updated in src/data/articles.ts!**");
}

main().catch(err => {
  appendSummary(`\n🚨 **FATAL ERROR:** ${err.message}`);
  console.error("Fatal error:", err);
  process.exit(1);
});
