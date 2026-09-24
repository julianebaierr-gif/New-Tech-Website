const fs = require('fs');
const path = require('path');

const newArticle = {
  slug: "how-to-add-bullet-points-in-excel",
  title: "How to Insert and Format Bullet Points in Excel",
  headline: "How to Insert and Format Bullet Points in Excel",
  excerpt: "How to insert bullet points in Excel cells using numeric keypad shortcuts, custom number formatting, dynamic CHAR formulas, and Symbol dialogs.",
  metaTitle: "Add Bullet Points in Excel Step-by-Step | TechOps Wire",
  metaDescription: "Add bullet points in Excel using keyboard shortcuts, custom cell formats, dynamic CHAR formulas, and Symbol menus without breaking worksheet calculations.",
  categorySlug: "data-excel-automation",
  categoryName: "Data & Excel Automation",
  authorId: "sarah-blake",
  publishedAt: "2026-09-24T13:30:00Z",
  updatedAt: "2026-09-24T13:30:00Z",
  readingTimeMinutes: 9,
  difficulty: "Beginner",
  primaryKeyword: "how to add bullet points in excel",
  primaryVolume: 3000,
  secondaryKeywords: [
    "bullet points in excel",
    "insert bullet points in excel",
    "how to insert bullet points in excel",
    "how to put bullet points in excel",
    "how to add a bullet point in excel",
    "excel bullet point shortcut"
  ],
  combinedVolume: 8200,
  featured: false,
  coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&h=630&q=80",
  coverImageId: "photo-1551288049-bebda4e38f71",
  secondaryImage: {
    id: "photo-1460925895917-afdab827c52f",
    url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&h=630&q=80",
    alt: "Financial analyst configuring cell formatting options in Excel",
    caption: "Custom number formats apply visual bullets without altering underlying cell strings."
  },
  tertiaryImage: {
    id: "photo-1454165804606-c3d57bc86b40",
    url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&h=630&q=80",
    alt: "Spreadsheet formula bar entering CHAR and TEXTJOIN functions",
    caption: "Formulas automatically generate multi-line bullet lists from raw range inputs."
  },
  tableOfContents: [
    { id: "keyboard-shortcuts-windows-mac", title: "Method 1: Keyboard Shortcuts (Windows and Mac)", level: 2 },
    { id: "custom-number-formatting", title: "Method 2: Custom Number Formatting for Entire Columns", level: 2 },
    { id: "dynamic-formulas-char-unichar", title: "Method 3: Dynamic Formulas with CHAR and UNICHAR", level: 2 },
    { id: "multiline-bullets-in-single-cell", title: "Method 4: Multiple Bullets Inside a Single Cell", level: 2 },
    { id: "symbol-dialog-and-character-codes", title: "Method 5: The Symbol Menu and Unicode Codes", level: 2 },
    { id: "method-comparison-matrix", title: "Method Comparison: Speed vs Data Integrity", level: 2 },
    { id: "copy-paste-bullet-bank", title: "Copy-Paste Bullet Symbol Bank", level: 2 },
    { id: "troubleshooting-bullet-point-errors", title: "Troubleshooting Common Excel Bullet Errors", level: 2 }
  ],
  faqs: [
    {
      question: "Why does Alt + 7 not insert a bullet point on my laptop?",
      answer: "Alt shortcuts require a dedicated numeric keypad. If your laptop only has the top number row, Alt + 7 will not work unless you turn on Num Lock with an Fn key or use the Custom Number Formatting method instead."
    },
    {
      question: "Does adding bullet points break Excel formulas or sorting?",
      answer: "If you insert bullets as literal text, it converts numbers into text and affects alphabetical sorting. Using Custom Number Formatting (format code • @) avoids this issue because the bullet is visual only, preserving the underlying raw data."
    },
    {
      question: "How do I add a line break between bullet points in one cell?",
      answer: "Press Alt + Enter on Windows or Option + Return on Mac while editing inside the cell. You must also click Wrap Text on the Home tab to display the line breaks properly."
    },
    {
      question: "What is the difference between CHAR(149) and UNICHAR(8226)?",
      answer: "CHAR(149) is the Windows ANSI code for a bullet point and can fail or display incorrectly on macOS Excel. UNICHAR(8226) uses standard Unicode and functions reliably across both Windows and Mac platforms."
    }
  ],
  contentHtml: `
<p class="lead text-lg text-slate-700 leading-relaxed mb-6">
  Microsoft Excel does not include a dedicated bulleted list button on the ribbon like Microsoft Word or PowerPoint. When creating project checklists, executive summaries, or status tables, entering clean bullet points requires specific keyboard shortcuts, formatting codes, or automated formulas. This tutorial walks through five verified methods tested across Windows 11, Windows 10, and macOS.
</p>

<div class="my-6 p-5 bg-slate-50 border border-slate-200 rounded-xl">
  <h4 class="text-xs font-bold text-blue-900 uppercase tracking-wider mb-1.5 font-mono">Quick Decision Matrix</h4>
  <p class="text-slate-700 text-sm">
    <strong>For 1 or 2 quick cells:</strong> Use the numeric keypad shortcut <kbd class="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-xs font-mono">Alt + 7</kbd> on Windows or <kbd class="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-xs font-mono">Option + 8</kbd> on Mac.<br />
    <strong>For entire columns or lists:</strong> Apply Custom Formatting (<code class="text-xs bg-slate-100 px-1 py-0.5 rounded font-mono">• @</code>) to add bullets automatically as you type.<br />
    <strong>For joining ranges into one cell:</strong> Combine <code class="text-xs bg-slate-100 px-1 py-0.5 rounded font-mono">=UNICHAR(8226)</code> with <code class="text-xs bg-slate-100 px-1 py-0.5 rounded font-mono">TEXTJOIN</code> and turn on Wrap Text.
  </p>
</div>

<h2 id="keyboard-shortcuts-windows-mac" class="text-2xl font-bold text-slate-900 mt-10 mb-4 scroll-mt-24">Method 1: Keyboard Shortcuts (Windows and Mac)</h2>
<p class="text-slate-700 leading-relaxed mb-4">
  Keyboard shortcuts represent the fastest way to insert bullet points into individual cells. However, Windows and Mac use different input mechanics, and laptop keyboards require special consideration.
</p>

<h3 class="text-xl font-semibold text-slate-800 mt-6 mb-3">Windows Keyboard Shortcuts (Numeric Keypad Required)</h3>
<p class="text-slate-700 leading-relaxed mb-4">
  To use Windows Alt codes, your keyboard must have a dedicated 10-key numeric keypad on the right side. The numbers along the top row of your keyboard will not trigger Alt codes.
</p>
<ol class="list-decimal pl-6 space-y-2 text-slate-700 mb-6">
  <li>Select the target cell and press <kbd class="px-2 py-0.5 bg-white border border-slate-300 rounded text-xs font-mono">F2</kbd> (or double-click) to enter edit mode.</li>
  <li>Hold down the <kbd class="px-2 py-0.5 bg-white border border-slate-300 rounded text-xs font-mono">Alt</kbd> key.</li>
  <li>Press <kbd class="px-2 py-0.5 bg-white border border-slate-300 rounded text-xs font-mono">7</kbd> on the numeric keypad to insert a solid circular bullet (<span class="font-bold text-slate-900">•</span>).</li>
  <li>Release the <kbd class="px-2 py-0.5 bg-white border border-slate-300 rounded text-xs font-mono">Alt</kbd> key, type a space, and enter your text.</li>
</ol>

<div class="overflow-x-auto my-6">
  <table class="min-w-full text-sm text-left border border-slate-200 rounded-lg">
    <thead class="bg-slate-100 text-slate-800 font-semibold border-b border-slate-200">
      <tr>
        <th class="px-4 py-3">Symbol</th>
        <th class="px-4 py-3">Symbol Name</th>
        <th class="px-4 py-3">Windows Keypad Shortcut</th>
        <th class="px-4 py-3">macOS Shortcut</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-slate-200 text-slate-700">
      <tr class="hover:bg-slate-50">
        <td class="px-4 py-3 font-bold text-base">•</td>
        <td class="px-4 py-3">Solid Round Bullet</td>
        <td class="px-4 py-3 font-mono">Alt + 7 (or Alt + 0149)</td>
        <td class="px-4 py-3 font-mono">Option + 8</td>
      </tr>
      <tr class="hover:bg-slate-50">
        <td class="px-4 py-3 font-bold text-base">○</td>
        <td class="px-4 py-3">Hollow Round Bullet</td>
        <td class="px-4 py-3 font-mono">Alt + 9</td>
        <td class="px-4 py-3">Symbol Dialog</td>
      </tr>
      <tr class="hover:bg-slate-50">
        <td class="px-4 py-3 font-bold text-base">■</td>
        <td class="px-4 py-3">Solid Square Bullet</td>
        <td class="px-4 py-3 font-mono">Alt + 254</td>
        <td class="px-4 py-3">Symbol Dialog</td>
      </tr>
      <tr class="hover:bg-slate-50">
        <td class="px-4 py-3 font-bold text-base">◆</td>
        <td class="px-4 py-3">Black Diamond Bullet</td>
        <td class="px-4 py-3 font-mono">Alt + 4</td>
        <td class="px-4 py-3">Symbol Dialog</td>
      </tr>
    </tbody>
  </table>
</div>

<h3 class="text-xl font-semibold text-slate-800 mt-6 mb-3">How to Use Shortcuts on Laptops Without a Numeric Keypad</h3>
<p class="text-slate-700 leading-relaxed mb-6">
  If you are using a compact notebook or ultrabook without a 10-key number pad, pressing Alt with top-row numbers will not work. You have three practical workarounds: enable the simulated numeric keypad by pressing <kbd class="px-2 py-0.5 bg-white border border-slate-300 rounded text-xs font-mono">Fn + NumLock</kbd>, open the Windows On-Screen Keyboard (<kbd class="px-2 py-0.5 bg-white border border-slate-300 rounded text-xs font-mono">Win + Ctrl + O</kbd>) and enable the numeric keypad in Options, or use Method 2 below.
</p>

<h2 id="custom-number-formatting" class="text-2xl font-bold text-slate-900 mt-10 mb-4 scroll-mt-24">Method 2: Custom Number Formatting for Entire Columns</h2>
<p class="text-slate-700 leading-relaxed mb-4">
  If you have a column with dozens or hundreds of items, manually typing a shortcut into every cell wastes time. Custom Number Formatting applies a bullet point visually to every entry in your selected range, without altering the actual underlying text string.
</p>
<p class="text-slate-700 leading-relaxed mb-4">
  Because the bullet exists only on the display layer, formulas referencing these cells (such as <code class="text-sm bg-slate-100 px-1.5 py-0.5 rounded font-mono">VLOOKUP</code> or <code class="text-sm bg-slate-100 px-1.5 py-0.5 rounded font-mono">XLOOKUP</code>) continue matching against clean text without requiring symbol stripping.
</p>

<ol class="list-decimal pl-6 space-y-3 text-slate-700 mb-6">
  <li>Select the column or range of cells where you want bullet points to appear.</li>
  <li>Press <kbd class="px-2 py-0.5 bg-white border border-slate-300 rounded text-xs font-mono">Ctrl + 1</kbd> (or <kbd class="px-2 py-0.5 bg-white border border-slate-300 rounded text-xs font-mono">Cmd + 1</kbd> on Mac) to open the <strong>Format Cells</strong> dialog.</li>
  <li>Under the <strong>Number</strong> tab, click <strong>Custom</strong> at the bottom of the Category list.</li>
  <li>In the <strong>Type</strong> input field, enter the following format string:
    <pre class="bg-slate-900 text-emerald-400 p-3 rounded-lg text-sm font-mono my-2"><code>• @</code></pre>
  </li>
  <li>Click <strong>OK</strong> to confirm your changes.</li>
</ol>
<p class="text-slate-700 leading-relaxed mb-6">
  Now, whenever you type any text into those cells and press Enter, Excel automatically inserts the bullet symbol and a space in front of your word. If you clear the cell, the bullet disappears completely.
</p>

<h2 id="dynamic-formulas-char-unichar" class="text-2xl font-bold text-slate-900 mt-10 mb-4 scroll-mt-24">Method 3: Dynamic Formulas with CHAR and UNICHAR</h2>
<p class="text-slate-700 leading-relaxed mb-4">
  When combining data from raw source exports into a formatted client report, writing formulas allows you to generate bullet lists dynamically. Excel includes two character-generating functions: <code class="text-sm bg-slate-100 px-1.5 py-0.5 rounded font-mono">CHAR</code> and <code class="text-sm bg-slate-100 px-1.5 py-0.5 rounded font-mono">UNICHAR</code>.
</p>

<h3 class="text-xl font-semibold text-slate-800 mt-6 mb-3">Single-Cell Bullet Formula</h3>
<p class="text-slate-700 leading-relaxed mb-2">
  To add a bullet to text sitting in cell A2, enter this formula in cell B2:
</p>
<pre class="bg-slate-900 text-emerald-400 p-3 rounded-lg text-sm font-mono mb-4"><code>=UNICHAR(8226) & " " & A2</code></pre>
<p class="text-slate-700 leading-relaxed mb-6">
  While older guides recommend <code class="text-sm bg-slate-100 px-1.5 py-0.5 rounded font-mono">=CHAR(149) & " " & A2</code>, that function relies on the local Windows ANSI character set and can produce strange accent marks when shared with Mac or web users. <code class="text-sm bg-slate-100 px-1.5 py-0.5 rounded font-mono">UNICHAR(8226)</code> produces Unicode code point U+2022, which is universally compatible across all operating systems.
</p>

<h3 class="text-xl font-semibold text-slate-800 mt-6 mb-3">Combining Multiple Rows into One Multi-Line Bulleted Cell</h3>
<p class="text-slate-700 leading-relaxed mb-4">
  If you have items spread across cells A2 through A6 and want them joined into a single cell with line breaks and bullets, use <code class="text-sm bg-slate-100 px-1.5 py-0.5 rounded font-mono">TEXTJOIN</code> alongside line feed character <code class="text-sm bg-slate-100 px-1.5 py-0.5 rounded font-mono">CHAR(10)</code>:
</p>
<pre class="bg-slate-900 text-emerald-400 p-3 rounded-lg text-sm font-mono mb-4"><code>=UNICHAR(8226) & " " & TEXTJOIN(CHAR(10) & UNICHAR(8226) & " ", TRUE, A2:A6)</code></pre>
<p class="text-slate-700 leading-relaxed mb-6">
  <strong>Crucial Step:</strong> After entering this formula, select the cell and click <strong>Wrap Text</strong> on the Home tab (<kbd class="px-2 py-0.5 bg-white border border-slate-300 rounded text-xs font-mono">Alt + H + W</kbd>). Without Wrap Text enabled, Excel renders line breaks as invisible spaces, forcing all items onto one wide horizontal line.
</p>

<h2 id="multiline-bullets-in-single-cell" class="text-2xl font-bold text-slate-900 mt-10 mb-4 scroll-mt-24">Method 4: Multiple Bullets Inside a Single Cell</h2>
<p class="text-slate-700 leading-relaxed mb-4">
  Spreadsheet layouts often require writing notes, executive summaries, or bulleted requirements within a single merged or expanded cell. Excel allows you to enter manual carriage returns without submitting the cell.
</p>
<ol class="list-decimal pl-6 space-y-3 text-slate-700 mb-6">
  <li>Select your target cell and press <kbd class="px-2 py-0.5 bg-white border border-slate-300 rounded text-xs font-mono">F2</kbd> to enter edit mode.</li>
  <li>Type your first bullet using <kbd class="px-2 py-0.5 bg-white border border-slate-300 rounded text-xs font-mono">Alt + 7</kbd> (or paste <code class="text-xs bg-slate-100 px-1 py-0.5 rounded font-mono">•</code>), add a space, and write your first bullet point.</li>
  <li>Hold <kbd class="px-2 py-0.5 bg-white border border-slate-300 rounded text-xs font-mono">Alt</kbd> and press <kbd class="px-2 py-0.5 bg-white border border-slate-300 rounded text-xs font-mono">Enter</kbd> (on Mac, press <kbd class="px-2 py-0.5 bg-white border border-slate-300 rounded text-xs font-mono">Option + Return</kbd>) to start a new line within the same cell.</li>
  <li>Type the next bullet shortcut, write your text, and repeat the process.</li>
  <li>Press <kbd class="px-2 py-0.5 bg-white border border-slate-300 rounded text-xs font-mono">Enter</kbd> to save the entire cell block.</li>
</ol>

<h2 id="symbol-dialog-and-character-codes" class="text-2xl font-bold text-slate-900 mt-10 mb-4 scroll-mt-24">Method 5: The Symbol Menu and Unicode Codes</h2>
<p class="text-slate-700 leading-relaxed mb-4">
  If you do not have a numeric keypad and prefer a visual interface, Excel includes a built-in symbol picker containing standard and decorative bullets.
</p>
<ol class="list-decimal pl-6 space-y-3 text-slate-700 mb-6">
  <li>Click the cell where you want the bullet placed.</li>
  <li>Navigate to the <strong>Insert</strong> tab on the ribbon and click <strong>Symbol</strong> on the far right.</li>
  <li>In the <strong>Font</strong> dropdown, leave it on <em>(normal text)</em> or select <em>Calibri</em>.</li>
  <li>In the <strong>Subset</strong> dropdown, select <strong>General Punctuation</strong>.</li>
  <li>Alternatively, type <code class="text-sm bg-slate-100 px-1.5 py-0.5 rounded font-mono">2022</code> into the <strong>Character code</strong> box at the bottom.</li>
  <li>Click <strong>Insert</strong>, then click <strong>Close</strong>.</li>
</ol>

<h2 id="method-comparison-matrix" class="text-2xl font-bold text-slate-900 mt-10 mb-4 scroll-mt-24">Method Comparison: Speed vs Data Integrity</h2>
<p class="text-slate-700 leading-relaxed mb-4">
  Choosing the correct approach depends on whether you are formatting raw text for presentation or structuring data that other formulas will calculate.
</p>

<div class="overflow-x-auto my-6">
  <table class="min-w-full text-sm text-left border border-slate-200 rounded-lg">
    <thead class="bg-slate-100 text-slate-800 font-semibold border-b border-slate-200">
      <tr>
        <th class="px-4 py-3">Approach</th>
        <th class="px-4 py-3">Speed</th>
        <th class="px-4 py-3">Formula Safety</th>
        <th class="px-4 py-3">Bulk Column Support</th>
        <th class="px-4 py-3">Ideal Scenario</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-slate-200 text-slate-700">
      <tr class="hover:bg-slate-50">
        <td class="px-4 py-3 font-semibold">Keypad Shortcut (Alt+7)</td>
        <td class="px-4 py-3 text-emerald-600 font-medium">Fastest</td>
        <td class="px-4 py-3 text-amber-600">Alters cell string</td>
        <td class="px-4 py-3 text-red-600">Manual per cell</td>
        <td class="px-4 py-3">Quick individual cell notes</td>
      </tr>
      <tr class="hover:bg-slate-50">
        <td class="px-4 py-3 font-semibold">Custom Number Format</td>
        <td class="px-4 py-3 text-blue-600 font-medium">Fast</td>
        <td class="px-4 py-3 text-emerald-600 font-medium">100% Safe (Visual only)</td>
        <td class="px-4 py-3 text-emerald-600 font-medium">Full columns instantly</td>
        <td class="px-4 py-3">Structured tables, data entry forms</td>
      </tr>
      <tr class="hover:bg-slate-50">
        <td class="px-4 py-3 font-semibold">Dynamic UNICHAR Formula</td>
        <td class="px-4 py-3 text-blue-600 font-medium">Moderate</td>
        <td class="px-4 py-3 text-emerald-600 font-medium">Preserves source data</td>
        <td class="px-4 py-3 text-emerald-600 font-medium">Auto-fills across rows</td>
        <td class="px-4 py-3">Automated reports, TEXTJOIN summaries</td>
      </tr>
      <tr class="hover:bg-slate-50">
        <td class="px-4 py-3 font-semibold">Symbol Dialog Menu</td>
        <td class="px-4 py-3 text-slate-500">Slow</td>
        <td class="px-4 py-3 text-amber-600">Alters cell string</td>
        <td class="px-4 py-3 text-red-600">Manual per cell</td>
        <td class="px-4 py-3">Laptops without numeric keypads</td>
      </tr>
    </tbody>
  </table>
</div>

<h2 id="copy-paste-bullet-bank" class="text-2xl font-bold text-slate-900 mt-10 mb-4 scroll-mt-24">Copy-Paste Bullet Symbol Bank</h2>
<p class="text-slate-700 leading-relaxed mb-4">
  If you are in a hurry or working on a restricted machine, you can copy any of these verified Unicode bullet symbols directly from the table below and paste them into your formula bar or custom formatting rules:
</p>

<div class="my-6 p-4 bg-slate-900 rounded-xl text-slate-200 font-mono text-sm space-y-2">
  <div><span class="text-emerald-400 font-bold text-lg">•</span> &nbsp; Standard Solid Round: <code>•</code> (Unicode U+2022)</div>
  <div><span class="text-emerald-400 font-bold text-lg">○</span> &nbsp; Hollow Circle: <code>○</code> (Unicode U+25CB)</div>
  <div><span class="text-emerald-400 font-bold text-lg">■</span> &nbsp; Solid Black Square: <code>■</code> (Unicode U+25A0)</div>
  <div><span class="text-emerald-400 font-bold text-lg">□</span> &nbsp; White Square Box: <code>□</code> (Unicode U+25A1)</div>
  <div><span class="text-emerald-400 font-bold text-lg">◆</span> &nbsp; Solid Diamond: <code>◆</code> (Unicode U+25C6)</div>
  <div><span class="text-emerald-400 font-bold text-lg">✔</span> &nbsp; Heavy Checkmark: <code>✔</code> (Unicode U+2714)</div>
  <div><span class="text-emerald-400 font-bold text-lg">➔</span> &nbsp; Heavy Right Arrow: <code>➔</code> (Unicode U+2794)</div>
</div>

<h2 id="troubleshooting-bullet-point-errors" class="text-2xl font-bold text-slate-900 mt-10 mb-4 scroll-mt-24">Troubleshooting Common Excel Bullet Errors</h2>

<h3 class="text-xl font-semibold text-slate-800 mt-6 mb-3">1. Alt + 7 Changes Active Tabs Instead of Inserting a Bullet</h3>
<p class="text-slate-700 leading-relaxed mb-4">
  This occurs when you are not in cell edit mode. If you select a cell and immediately press Alt, Excel activates the ribbon shortcut keys (Key Tips). Always press <kbd class="px-2 py-0.5 bg-white border border-slate-300 rounded text-xs font-mono">F2</kbd> or double-click the cell first so the blinking text cursor is active before pressing <kbd class="px-2 py-0.5 bg-white border border-slate-300 rounded text-xs font-mono">Alt + 7</kbd>.
</p>

<h3 class="text-xl font-semibold text-slate-800 mt-6 mb-3">2. Multi-Line Bullets Run Off the Edge of the Cell</h3>
<p class="text-slate-700 leading-relaxed mb-4">
  If you used <kbd class="px-2 py-0.5 bg-white border border-slate-300 rounded text-xs font-mono">Alt + Enter</kbd> or <code class="text-sm bg-slate-100 px-1.5 py-0.5 rounded font-mono">CHAR(10)</code> formulas and your text stays on one continuous horizontal line, <strong>Wrap Text</strong> is disabled. Select the cell range and click the Wrap Text button on the Home tab ribbon to force the row to expand vertically.
</p>

<h3 class="text-xl font-semibold text-slate-800 mt-6 mb-3">3. Numbers Become Unusable in Calculations</h3>
<p class="text-slate-700 leading-relaxed mb-6">
  If you type a bullet symbol directly into a numeric cell (such as <code class="text-sm bg-slate-100 px-1.5 py-0.5 rounded font-mono">• 450</code>), Excel converts that cell into a text string. Any <code class="text-sm bg-slate-100 px-1.5 py-0.5 rounded font-mono">SUM</code>, <code class="text-sm bg-slate-100 px-1.5 py-0.5 rounded font-mono">AVERAGE</code>, or arithmetic formulas referencing it will return a <code class="text-sm bg-slate-100 px-1.5 py-0.5 rounded font-mono">#VALUE!</code> error. To display bullets alongside numbers without breaking calculations, apply Custom Formatting using the format code <code class="text-sm bg-slate-100 px-1.5 py-0.5 rounded font-mono">• General</code>.
</p>
`
};

const articlesTsPath = path.join(__dirname, '../src/data/articles.ts');
let content = fs.readFileSync(articlesTsPath, 'utf8');

// If already present, remove it first
if (content.includes(`slug: "${newArticle.slug}"`)) {
  console.log(`[NOTICE] Removing previous version of ${newArticle.slug}...`);
  // regex remove
  const articleRegex = new RegExp(`\\s*\\{[\\s\\S]*?slug:\\s*"${newArticle.slug}"[\\s\\S]*?\\},?`, 'g');
  content = content.replace(articleRegex, '');
}

// Convert newArticle to clean TypeScript string
function serializeArticle(art) {
  return `  {
    slug: "${art.slug}",
    title: "${art.title.replace(/"/g, '\\"')}",
    headline: "${art.headline.replace(/"/g, '\\"')}",
    excerpt: "${art.excerpt.replace(/"/g, '\\"')}",
    metaTitle: "${art.metaTitle.replace(/"/g, '\\"')}",
    metaDescription: "${art.metaDescription.replace(/"/g, '\\"')}",
    categorySlug: "${art.categorySlug}",
    categoryName: "${art.categoryName}",
    authorId: "${art.authorId}",
    publishedAt: "${art.publishedAt}",
    updatedAt: "${art.updatedAt}",
    readingTimeMinutes: ${art.readingTimeMinutes},
    difficulty: "${art.difficulty}",
    primaryKeyword: "${art.primaryKeyword}",
    primaryVolume: ${art.primaryVolume},
    secondaryKeywords: ${JSON.stringify(art.secondaryKeywords)},
    combinedVolume: ${art.combinedVolume},
    featured: ${art.featured},
    coverImage: "${art.coverImage}",
    coverImageId: "${art.coverImageId}",
    secondaryImage: ${JSON.stringify(art.secondaryImage, null, 6)},
    tertiaryImage: ${JSON.stringify(art.tertiaryImage, null, 6)},
    tableOfContents: ${JSON.stringify(art.tableOfContents, null, 6)},
    faqs: ${JSON.stringify(art.faqs, null, 6)},
    contentHtml: \`${art.contentHtml.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`
  }`;
}

const serialized = serializeArticle(newArticle);
const lastClosing = content.lastIndexOf('];');
if (lastClosing === -1) {
  console.error('[ERROR] Target closing bracket not found!');
  process.exit(1);
}
const updatedArticlesTs = content.slice(0, lastClosing) + ',\n' + serialized + '\n];' + content.slice(lastClosing + 2);
fs.writeFileSync(articlesTsPath, updatedArticlesTs, 'utf8');

console.log(`[SUCCESS] Article ${newArticle.slug} appended cleanly to src/data/articles.ts!`);
