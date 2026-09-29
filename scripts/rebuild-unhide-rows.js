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
    'how to unhide rows in excel shortcut',
    'how to unhide rows in excel all at once',
    'how to unhide row 1 in excel',
    'how to unhide rows in excel on mac',
    'how to unhide rows in excel when row 1 is hidden',
    'excel unhide rows not working',
    'how to unhide filtered rows in excel',
    'excel unhide rows vba macro',
    'excel show hidden rows and columns',
    'excel inspect document hidden rows',
    ...['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'm', 'n', 'p', 's', 't', 'v', 'w'].map(l => `unhide rows in excel ${l}`)
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
    { title: "Microsoft Support: Hide or show rows or columns in Excel", url: "https://support.microsoft.com/en-us/office/hide-or-show-rows-or-columns-in-excel-659c2cad-802e-44ee-a614-dde8443579f8", snippet: "Select adjacent rows, right-click, and choose Unhide. Explains how to select all cells to unhide the first row or column." },
    { title: "Exceljet: How to unhide all rows in Excel", url: "https://exceljet.net/lessons/how-to-unhide-all-rows", snippet: "Step-by-step shortcuts using Ctrl + Shift + 9 and selecting the entire sheet using the Select All button." },
    { title: "Ablebits: How to unhide rows in Excel (all rows, row 1, filtered rows)", url: "https://www.ablebits.com/office-addins-blog/unhide-rows-excel/", snippet: "Detailed breakdown of unhiding row 1 using the Name box, unhiding filtered rows vs hidden rows, and troubleshooting locked sheets." },
    { title: "SpreadsheetClass: How to Unhide Rows in Excel (Multiple Methods)", url: "https://spreadsheetclass.com/how-to-unhide-rows-in-excel/", snippet: "Shows how to hover between row headers until the double-line expand cursor appears, and unhiding specific ranges." },
    { title: "TrumpExcel: How to Unhide Row 1 in Excel (The Quickest Ways)", url: "https://trumpexcel.com/unhide-row-1-excel/", snippet: "Focuses on the common problem where row 1 is hidden and standard right-click cannot select the row above it." }
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
    'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-1.5-flash',
    'gemini-1.5-pro',
    'gemini-2.5-pro',
    'gemini-3.1-flash-lite',
    'gemini-flash-latest',
    'gemini-3.5-flash-lite',
    'gemini-3.8-flash',
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
      } else {
        console.warn(`  [GEMINI CASCADE] ${m} returned HTTP ${res.statusCode}: ${res.body.slice(0, 150)}`);
      }
    } catch (e) {
      console.warn(`  [GEMINI CASCADE] Model ${m} failed: ${e.message}, trying next...`);
    }
    await new Promise(r => setTimeout(r, 1000));
  }
  return null;
}

async function run() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('ERROR: GEMINI_API_KEY is required');
    process.exit(1);
  }

  const keyword = 'how to unhide rows in excel';
  const title = 'How to Hide, Unhide, and View Hidden Rows in Excel';
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

  const prompt = `You are Sarah Blake, Senior Data Operations Analyst & Spreadsheet Automation Specialist writing for TechOps Wire.
Write an authoritative, exhaustive, publication-grade 2,200+ word technical manual for: "${title}".
Primary Target Keyword: "${keyword}".
Secondary Target Keywords: how to hide rows in excel, how do you unhide rows in excel, unhide all rows in excel, how to unhide row 1 in excel, excel unhide rows not working.
Supporting Google LSI & Semantic Keywords (Include these naturally across sections):
${lsiContext}

LIVE SERP COMPETITOR AUDIT (Top 5 Competitors on Google):
${competitorContext}

COMPETITOR CONTENT GAP & INFORMATION GAIN OBJECTIVE:
1. Top competitors provide brief 200-500 word surface-level instructions with only 1 basic mouse click method. They fail to explain edge cases, keyboard conflicts, or programmatic automation.
2. EXPLOIT THE CONTENT GAP: Deliver deep spreadsheet engineering substance:
   - Object Model Mechanics: Explain how Excel manages row visibility (Hidden property boolean vs RowHeight = 0 vs Filter criteria vs Grouping/Outline levels).
   - Mouse & Visual Indicators: Detail the subtle visual double-line indicator between row headers, mouse hover icon changes (double-sided split arrow), and boundary drag techniques.
   - Comprehensive Keyboard Shortcuts: Document Windows shortcut (Ctrl + Shift + 9) and macOS shortcut (Cmd + Shift + 9). Address the notorious Windows keyboard language hotkey conflict where Windows 10/11 intercepts Ctrl + Shift + 9 for input language switching, and how to resolve it.
   - Unhiding Row 1 Edge Case: Thoroughly explain why right-clicking row 2 fails to unhide row 1 (no upper bounding header). Provide the 3 proven workarounds: (1) Select All corner button / Ctrl + A, (2) Name Box trick (typing 'A1' and pressing Enter), (3) Go To Special dialog box.
   - Filtered vs Hidden Rows: Explicitly distinguish between manually hidden rows (standard gray numbers with double-line divider) and AutoFiltered hidden rows (blue row numbers with filter funnel in column headers), and explain why right-click Unhide does NOT work on filtered rows.
   - 5-Column Technical Comparison Matrix: Compare Hide Rows, AutoFilter, Data Grouping (Outline), Zero Row Height, and VBA Hidden across Trigger Mechanism, Visual Header State, Formula Inclusion (SUBTOTAL/AGGREGATE behavior), Copy-Paste Behavior, and Restoration Speed.
   - Programmatic Automation (VBA & Office Scripts): Provide copy-paste ready, production-tested VBA macros to unhide rows across all worksheets in a workbook, and an Office Script snippet for Excel Online.
   - Advanced Troubleshooting: Resolve frozen panes trapping row 1, protected sheets disabling unhide options, and how to copy only visible cells using Alt + ; (Semicolon) without pulling hidden rows.

CRITICAL LENGTH & DEPTH MANDATE:
- The article MUST be at least 2,200 words of rich, practical spreadsheet instruction.
- Each H2 section MUST contain at least 3 to 4 dense, highly informative paragraphs with structured steps, tips, and edge cases.
- Never write brief 1-sentence or 1-paragraph sections.
- NEVER NUMBER HEADINGS! Do NOT prefix headings with "1.", "2.", "Section 1", or any digits.

STRUCTURE REQUIREMENTS:
1. Lead Paragraph:
   <p class="lead text-lg text-slate-700 leading-relaxed mb-6">...</p>
   Direct explanation of ${keyword}, row visibility mechanics in financial and operational workbooks, and common workflow friction points.

2. Quick Action Summary Card:
   <div class="my-6 p-5 bg-slate-50 border border-slate-200 rounded-xl">
     <h4 class="text-xs font-bold text-blue-900 uppercase tracking-wider mb-1.5 font-mono">Quick Keyboard & Action Summary</h4>
     <p class="text-slate-700 text-sm">...</p>
   </div>

3. Exactly 7 Major Sections (STRICTLY NO NUMBER PREFIXES IN HEADINGS):
   <h2 id="row-visibility-mechanics" class="text-2xl font-bold text-slate-900 mt-10 mb-4 scroll-mt-24">Row Visibility Mechanics in Modern Spreadsheet Engines</h2>
   <h2 id="primary-mouse-and-context-menu-methods" class="text-2xl font-bold text-slate-900 mt-10 mb-4 scroll-mt-24">Primary Mouse and Context Menu Methods for Unhiding Rows</h2>
   <h2 id="keyboard-shortcuts-windows-and-macos" class="text-2xl font-bold text-slate-900 mt-10 mb-4 scroll-mt-24">Keyboard Shortcuts and Navigation Workflows (Windows and macOS)</h2>
   <h2 id="unhiding-row-1-edge-cases" class="text-2xl font-bold text-slate-900 mt-10 mb-4 scroll-mt-24">Unhiding Row 1 and Column A Edge Cases (Name Box and Go To Special)</h2>
   <h2 id="comparative-feature-matrix" class="text-2xl font-bold text-slate-900 mt-10 mb-4 scroll-mt-24">Comparative Feature Matrix: Hide vs Filter vs Group vs Zero Row Height</h2>
   <h2 id="automating-bulk-unhide-vba" class="text-2xl font-bold text-slate-900 mt-10 mb-4 scroll-mt-24">Automating Bulk Row Visibility with VBA and Office Scripts</h2>
   <h2 id="troubleshooting-unhide-not-working" class="text-2xl font-bold text-slate-900 mt-10 mb-4 scroll-mt-24">Comprehensive Troubleshooting: Why Hidden Rows Will Not Unhide</h2>

4. Clean 5-Column HTML Table in Section 5:
   <div class="my-6 overflow-x-auto">
     <table class="min-w-full text-sm text-left border border-slate-200 rounded-lg">
       <thead class="bg-slate-100 text-slate-800 font-semibold border-b border-slate-200">
         <tr><th class="px-4 py-3">Visibility Feature</th><th class="px-4 py-3">Trigger Method</th><th class="px-4 py-3">Header Visual Indicator</th><th class="px-4 py-3">Formula Behavior (SUBTOTAL)</th><th class="px-4 py-3">Recommended Use Case</th></tr>
       </thead>
       <tbody class="divide-y divide-slate-200 text-slate-700">
         ...
       </tbody>
     </table>
   </div>

5. Exact VBA & Script Code Blocks in Section 6:
   <pre class="bg-slate-900 text-slate-100 p-4 rounded-xl overflow-x-auto text-sm font-mono my-4"><code>...</code></pre>

6. In-Text Internal Links:
   Naturally embed links inside sentences to:
   - <a href="/articles/how-to-remove-duplicates-in-excel" class="text-blue-600 font-medium hover:underline">remove duplicates in Excel</a>
   - <a href="/articles/excel-drop-down-list" class="text-blue-600 font-medium hover:underline">Excel drop-down list</a>
   - <a href="/articles/how-to-add-bullet-points-in-excel" class="text-blue-600 font-medium hover:underline">add bullet points in Excel</a>

7. FAQs Handling:
   DO NOT create a "Frequently Asked Questions" or "FAQ" H2 heading in the HTML body! Our platform automatically renders the FAQ accordion separately.
   Provide 5 technical FAQs answering deep spreadsheet questions in a \`\`\`json block at the very end of your response:
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
        question: "Why does pressing Ctrl + Shift + 9 fail to unhide rows on Windows 11?",
        answer: "Windows 10 and Windows 11 often assign Ctrl + Shift to keyboard language switching. When this hotkey collision occurs, Windows intercepts the keystroke before Excel receives it. You can resolve this by changing the Advanced Key Settings in Windows Settings or by using the ribbon sequence Alt, H, O, U, R."
      },
      {
        question: "How do you unhide Row 1 when there is no row above it to select?",
        answer: "Because you cannot click-and-drag across an upper boundary for Row 1, click into the Name Box to the left of the formula bar, type A1, press Enter, and then select Home > Format > Hide & Unhide > Unhide Rows. Alternatively, click the triangle button in the top-left corner above Row 1 to select all cells, then right-click any row header and choose Unhide."
      },
      {
        question: "What is the operational difference between a hidden row and a filtered row?",
        answer: "Manually hidden rows display standard gray row numbers with a subtle double-line header boundary and can be unhidden via right-click. Filtered rows display blue row numbers with a funnel icon in the column header and can only be restored by clearing the filter via Data > Clear Filter."
      },
      {
        question: "Why are my rows still invisible after selecting Unhide?",
        answer: "Rows remain invisible after an unhide command if their row height was manually configured to 0 or 0.1 points instead of using the native Hide command. To fix this, select the surrounding rows, right-click, choose Row Height, and enter a standard value like 15 or 20 points."
      },
      {
        question: "How can I copy data without including hidden rows in the clipboard?",
        answer: "By default, copying a range copies hidden cells within that boundary. Select your range, press Alt + ; (or go to Find & Select > Go To Special > Visible Cells Only), and then press Ctrl + C. Only visible rows will be copied to your clipboard."
      }
    ];
  }

  let cleaned = raw
    .replace(/```json[\s\S]*?```/gi, '')
    .replace(/^```html\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  // Strip any leading numbers from H2 and H3 headings
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

  if (wordCount < 1500) {
    console.error(`ERROR: Generated word count (${wordCount}) is below the required 1,500 threshold!`);
    process.exit(1);
  }

  // Update articles.ts
  const articlesPath = path.join(__dirname, '../src/data/articles.ts');
  let fileContent = fs.readFileSync(articlesPath, 'utf8');

  const slug = 'how-to-unhide-rows-in-excel';
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
  block = block.replace(/authorId:\s*"[^"]+"/, 'authorId: "sarah-blake"');
  block = block.replace(/readingTimeMinutes:\s*\d+/, 'readingTimeMinutes: 11');
  block = block.replace(/metaTitle:\s*"[^"]+"/, 'metaTitle: "How to Unhide Rows in Excel Steps | TechOps Wire"');
  block = block.replace(/metaDescription:\s*"[^"]+"/, 'metaDescription: "Unhide rows in Excel across Windows and Mac. Master mouse shortcuts, Name Box tricks for hidden row 1, VBA macros, and fix unhide not working issues."');

  // Update images to our generated 100% relevant local visuals
  block = block.replace(/coverImage:\s*"[^"]+"/, 'coverImage: "/images/articles/excel-unhide-rows-cover.jpg"');
  block = block.replace(/coverImageId:\s*"[^"]+"/, 'coverImageId: "excel-unhide-rows-cover"');
  
  const secImg = JSON.stringify({
    id: "excel-unhide-row-1-select-all",
    url: "/images/articles/excel-unhide-row-1-select-all.jpg",
    alt: "Selecting corner button and Name Box to unhide row 1 in Excel",
    caption: "Selecting the top-left intersection button allows instant unhiding of the first worksheet row."
  }, null, 6).split('\n').map((l, i) => i === 0 ? l : '    ' + l).join('\n');
  block = block.replace(/secondaryImage:\s*\{[\s\S]*?\},/, `secondaryImage: ${secImg},`);

  const tertImg = JSON.stringify({
    id: "excel-unhide-troubleshooting-filters",
    url: "/images/articles/excel-unhide-troubleshooting-filters.jpg",
    alt: "Troubleshooting hidden vs filtered rows in Excel with data filter icons",
    caption: "Distinguishing between filtered rows and manually hidden rows prevents accidental data omission."
  }, null, 6).split('\n').map((l, i) => i === 0 ? l : '    ' + l).join('\n');
  block = block.replace(/tertiaryImage:\s*\{[\s\S]*?\},/, `tertiaryImage: ${tertImg},`);

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
  console.log('[SUCCESS] Successfully updated how-to-unhide-rows-in-excel in src/data/articles.ts!');
}

run().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
