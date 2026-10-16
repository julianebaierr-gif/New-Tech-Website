# TechOps Wire SEO & Editorial Audit Standards

Always enforce these permanent editorial, technical SEO, and content quality standards whenever creating, updating, or optimizing articles on TechOps Wire:

1. **Strict Sequential Heading Hierarchy (`H1 -> H2 -> H3` Only):**
   - Never use `<h4>`, `<h5>`, or `<h6>` inside `contentHtml`.
   - Callout boxes (such as "Quick Architecture Summary" or "Quick Decision Matrix") placed before or between sections MUST use `<p class="...">` or `<div>` for their header label, NEVER `<h4>`.
   - Never include `&` (`&amp;`) or numbered prefixes (`1.`, `Step 1:`) in `<h2>` or `<h3>` headings.

2. **Natural Keyword Integration (No Typo Stuffing or Bolding):**
   - Never bold (`<strong>`, `<b>`, `**`) injected SEO keywords.
   - Never force raw search typos, shorthand strings, or broken grammar (e.g., `"agen ai"`, `"agentic def"`, `"agentic mean"`, `"bvostfus"`) into article prose. Address the underlying technical intent using clean, natural English.
   - Cross-check `scripts/sheet1_data.csv` and `scripts/sheet2.csv` before adding keywords to avoid cannibalizing future scheduled posts.

3. **Concrete, Reproducible Comparison Matrices:**
   - Comparison tables must use specific, measurable criteria (e.g., latency in ms, context token limits, VRAM/RAM capacity, exact CLI flags, or protocol specifications) rather than vague single-word labels like `"Massive"`, `"High (Network)"`, or `"Low (Local)"`.

4. **Realistic Claims & Safe Security Terminology:**
   - Avoid absolute, unverifiable operational guarantees such as `"zero unplanned downtime"` or `"100% immune"`; use realistic engineering phrasing like `"mitigate unplanned downtime risks"`.
   - Avoid grey-hat or circumvention phrasing such as `"bypass login locks"`; use authorized administration phrasing like `"run startup repair"` or `"execute authorized account recovery"`.

5. **Zero Banned AI Buzzwords & Strict Meta Limits:**
   - Always run `node scripts/scan-user-words.js` (must return **0 matches**).
   - Always run `node scripts/verify-all-meta-limits.js` (must return **100% PASS**: Meta Titles 50–55 chars, Meta Descriptions 150–155 chars).
   - Never alter existing live article URLs/slugs unless explicitly requested.
