# TechOps Wire SEO & Editorial Audit Standards

Always enforce these permanent editorial, technical SEO, and content quality standards whenever creating, updating, or optimizing articles on TechOps Wire:

1. **Strict Sequential Heading Hierarchy (`H1 -> H2 -> H3` Only):**
   - Never use `<h4>`, `<h5>`, or `<h6>` inside `contentHtml`.
   - Callout boxes (such as "Quick Architecture Summary" or "Quick Decision Matrix") placed before or between sections MUST use `<p class="...">` or `<div>` for their header label, NEVER `<h4>`.
   - Never include `&` (`&amp;`) or numbered prefixes (`1.`, `Step 1:`) in `<h2>` or `<h3>` headings.

2. **Natural Keyword Integration (No Keyword Trains, Typo Stuffing, or Bolding):**
   - Never bold (`<strong>`, `<b>`, `**`) injected SEO keywords.
   - Never chain multiple synonym/keyword variations into a single sentence or paragraph (e.g., never write comma-separated trains like *"how to alphabetize in Excel, how to alphabetise in Excel, how to sort Excel alphabetically..."*). Limit keyword integration to 1–2 natural phrases per paragraph, and drop redundant near-duplicate variations that already share the same root stems.
   - Never force raw search typos, shorthand strings, or broken grammar (e.g., `"agen ai"`, `"agentic def"`, `"agentic mean"`, `"bvostfus"`) into article prose. Address the underlying technical intent using clean, natural English.
   - Keep platform-specific guides focused on their primary platform (e.g., do not flood a Google Sheets tutorial with Excel keyword lists).
   - Cross-check `scripts/sheet1_data.csv` and `scripts/sheet2.csv` before adding keywords to avoid cannibalizing future scheduled posts.

3. **Substantiated Technical Claims & Official vs. Practical Limits:**
   - Clearly distinguish official vendor-documented specifications (e.g., OpenAI's 512 MB file limit / 20 MB image limit) from practical observed runtime behavior (e.g., pandas DataFrame container memory limits or execution timeouts).
   - When troubleshooting SaaS/cloud latency or outages, separate verifiable user-side diagnostics (e.g., checking `status.openai.com`, inspecting browser DevTools/WebSockets, disabling extensions) from general server-side architectural bottlenecks.

4. **Concrete, Reproducible Comparison Matrices:**
   - Comparison tables must use specific, measurable criteria (e.g., latency in ms, context token limits, VRAM/RAM capacity, exact CLI flags, or protocol specifications) rather than vague single-word labels like `"Massive"`, `"High (Network)"`, or `"Low (Local)"`.

5. **Realistic Claims & Safe Security Terminology:**
   - Avoid absolute, unverifiable operational guarantees such as `"zero unplanned downtime"` or `"100% immune"`; use realistic engineering phrasing like `"mitigate unplanned downtime risks"`.
   - Avoid grey-hat or circumvention phrasing such as `"bypass login locks"`; use authorized administration phrasing like `"run startup repair"` or `"execute authorized account recovery"`.

6. **Zero Banned AI Buzzwords & Strict Meta Limits:**
   - Always run `node scripts/scan-user-words.js` (must return **0 matches**).
   - Always run `node scripts/verify-all-meta-limits.js` (must return **100% PASS**: Meta Titles 50–55 chars, Meta Descriptions 150–155 chars).
   - Never alter existing live article URLs/slugs unless explicitly requested.
