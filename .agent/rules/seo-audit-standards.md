# TechOps Wire SEO & Editorial Audit Standards

Always enforce these permanent editorial, technical SEO, and content quality standards whenever creating, updating, or optimizing articles on TechOps Wire:

1. **Strict Sequential Heading Hierarchy (`H1 -> H2 -> H3` Only):**
   - Never use `<h4>`, `<h5>`, or `<h6>` inside `contentHtml`.
   - Callout boxes (such as "Quick Architecture Summary" or "Quick Decision Matrix") placed before or between sections MUST use `<p class="...">` or `<div>` for their header label, NEVER `<h4>`.
   - Never include `&` (`&amp;`) or numbered prefixes (`1.`, `Step 1:`) in `<h2>` or `<h3>` headings.

2. **Natural Keyword Integration (No Keyword Trains, Typo Stuffing, or Bolding):**
   - Always retain the article's `primaryKeyword` 2–3 times naturally across the article (e.g., in the lead paragraph, one body section, and one FAQ) so core search rankings are preserved.
   - Never bold (`<strong>`, `<b>`, `**`) injected SEO keywords; reserve `<strong>` strictly for genuine UI ribbon paths, dialog labels, or list item lead-ins ending with a colon (`:`).
   - Never chain multiple synonym/keyword variations or 3+ question phrases (`how to...`, `what is...`, `where is...`) into a single paragraph. Limit keyword integration to 1–2 natural phrases per paragraph, and drop redundant near-duplicate variations that already share the same root stems.
   - Never force raw search typos, shorthand strings, or unrelated scraped competitor brands into `secondaryKeywords` or article prose.
   - Keep platform-specific guides focused on their primary platform (e.g., do not include `"in excel"` keywords in a Google Sheets article's `secondaryKeywords` or body).
   - Cross-check `scripts/sheet1_data.csv` and `scripts/sheet2.csv` before adding keywords to avoid cannibalizing future scheduled posts.

3. **Substantiated Technical Claims & Official vs. Practical Limits:**
   - Clearly distinguish official vendor-documented specifications (e.g., OpenAI's 512 MB file limit / 20 MB image limit) from practical observed runtime behavior (e.g., pandas DataFrame container memory limits or execution timeouts).
   - When troubleshooting SaaS/cloud latency or outages, separate verifiable user-side diagnostics (e.g., checking `status.openai.com`, inspecting browser DevTools/WebSockets, disabling extensions) from general server-side architectural bottlenecks.

4. **Concrete, Reproducible Comparison Matrices:**
   - Comparison tables must use specific, measurable criteria (e.g., latency in ms, context token limits, VRAM/RAM capacity, exact CLI flags, or protocol specifications) rather than vague single-word cells like `"High"`, `"Medium"`, `"Low"`, `"None"`, `"Yes"`, or `"No"`.

5. **Realistic Claims & Safe Security Terminology:**
   - Avoid absolute, unverifiable operational guarantees such as `"zero unplanned downtime"`, `"zero downtime"`, `"100% accuracy"`, or `"guarantee flawless"`; use realistic engineering phrasing like `"minimize service disruption"` or `"high accuracy"`.
   - Avoid grey-hat or circumvention phrasing such as `"bypass login locks"`; use authorized administration phrasing like `"run startup repair"` or `"execute authorized account recovery"`.

6. **Zero Banned AI Buzzwords, Clean Punctuation & Strict Meta Limits:**
   - Never use em-dashes (`—`) anywhere in `contentHtml` or `faqs`, and never use `&` in `title`, `headline`, `<h2>`, or `<h3>`.
   - Ensure `tableOfContents` entries match the exact `<h2>` `id` attributes in `contentHtml` in 1-to-1 order.
   - Always run `node scripts/sanitize-rules.js` (must return **0 audit issues**).
   - Always run `node scripts/scan-user-words.js` (must return **0 matches**).
   - Always run `node scripts/verify-all-meta-limits.js` (must return **100% PASS**: Meta Titles 50–55 chars, Meta Descriptions 150–155 chars).
   - Never alter existing live article URLs/slugs unless explicitly requested.
