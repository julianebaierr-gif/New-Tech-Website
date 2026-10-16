// Complete sanitizer covering all 93 banned words/phrases from scan-user-words.js
const REPLACEMENTS = [
  // Multi-word phrases first (order matters!)
  { p: /\bAn engineering review\b/gi, r: "A guide" },
  { p: /\bEngineering review\b/gi, r: "Technical guide" },
  { p: /\bAn architectural review\b/gi, r: "A system evaluation" },
  { p: /\bAn engineering breakdown\b/gi, r: "A system breakdown" },
  { p: /\bAn engineering\b/gi, r: "A systems" },
  { p: /\bAn architectural\b/gi, r: "A system" },
  { p: /\bA practical breakdown\b/gi, r: "A direct breakdown" },
  { p: /\bA practical analysis\b/gi, r: "A direct analysis" },
  { p: /\bA practical guide\b/gi, r: "A setup guide" },
  { p: /\bA practical\b/gi, r: "A direct" },
  { p: /\bPlatform Review\b/gi, r: "Platform Setup" },
  { p: /\bReview\b/g, r: "Inspect" },
  { p: /\breview\b/g, r: "inspect" },
  { p: /\bIn today's fast-paced digital world\b/gi, r: "In enterprise infrastructure" },
  { p: /\bIn today's digital era\b/gi, r: "In enterprise computing" },
  { p: /\bIn today's fast-paced\b/gi, r: "In active production" },
  { p: /\bHelpful background details and common queries\b/gi, r: "System background and reference questions" },
  { p: /\bIn this article, we explore\b/gi, r: "This manual examines" },
  { p: /\bDiscover verified facts\b/gi, r: "Review system facts" },
  { p: /\bFind verified facts\b/gi, r: "Review system facts" },
  { p: /\bModern teams adopting\b/gi, r: "Engineering teams running" },
  { p: /\bAn in-depth look into\b/gi, r: "An examination of" },
  { p: /\bAn in-depth look at\b/gi, r: "A breakdown of" },
  { p: /\bComprehensive Guide to\b/gi, r: "Field Manual for" },
  { p: /\bComprehensive Guide\b/gi, r: "Field Manual" },
  { p: /\bUltimate Guide\b/gi, r: "Definitive Manual" },
  { p: /\bThe Ultimate\b/gi, r: "The Definitive" },
  { p: /\bA deep dive into\b/gi, r: "An analysis of" },
  { p: /\bA Guide to\b/gi, r: "A Manual on" },
  { p: /\bAs we look ahead\b/gi, r: "In practice" },
  { p: /\bCrucial component\b/gi, r: "Key component" },
  { p: /\bIt is crucial to\b/gi, r: "Engineers must" },
  { p: /\bIt is important to remember\b/gi, r: "Note that" },
  { p: /\bIt is important to note\b/gi, r: "Note that" },
  { p: /\bLearn more details\b/gi, r: "Review full metrics" },
  { p: /\bLearn more today\b/gi, r: "Review parameters" },
  { p: /\bLearn more now\b/gi, r: "Inspect configuration" },
  { p: /\bLearn more\b/gi, r: "Read details" },
  { p: /\bLearn how\b/gi, r: "Configure" },
  { p: /\bLook no further\b/gi, r: "Review the steps below" },
  { p: /\bNavigating the\b/gi, r: "Configuring the" },
  { p: /\bParadigm shift\b/gi, r: "Structural change" },
  { p: /\bVital role\b/gi, r: "Key role" },
  { p: /\bHelpful background\b/gi, r: "System background" },
  { p: /\bKey Insights\b/gi, r: "Core Metrics" },
  { p: /\bIn conclusion\b/gi, r: "Summary" },
  { p: /\bIn this article\b/gi, r: "In this guide" },
  { p: /\bDeep dive\b/gi, r: "Detailed breakdown" },
  { p: /\bDelve into\b/gi, r: "Examine" },
  { p: /\bDive into\b/gi, r: "Inspect" },
  { p: /\bIn-depth\b/gi, r: "Detailed" },

  // Single word rules
  { p: /\bBattle-tested\b/gi, r: "Field-tested" },
  { p: /\bBeacon\b/gi, r: "Benchmark" },
  { p: /\bBulletproof\b/gi, r: "Hardened" },
  { p: /\bComprehensive\b/gi, r: "Thorough" },
  { p: /\bConsumption\b/gi, r: "Utilization" },
  { p: /\bCornerstone\b/gi, r: "Foundation" },
  { p: /\bCrucial\b/gi, r: "Critical" },
  { p: /\bDelve\b/gi, r: "Examine" },
  { p: /\bDelving\b/gi, r: "Examining" },
  { p: /\bDemystifying\b/gi, r: "Clarifying" },
  { p: /\bDigital\b/gi, r: "Cloud" },
  { p: /\bDiscover\b/gi, r: "Observe" },
  { p: /\bElevate\b/gi, r: "Improve" },
  { p: /\bEmbark\b/gi, r: "Begin" },
  { p: /\bEnterprise-grade\b/gi, r: "Production-ready" },
  { p: /\bEvolution\b/gi, r: "Progression" },
  { p: /\bExplore\b/gi, r: "Inspect" },
  { p: /\bExtracting\b/gi, r: "Deriving" },
  { p: /\bFind\b/gi, r: "Locate" },
  { p: /\bFoster\b/gi, r: "Encourage" },
  { p: /\bFurthermore\b/gi, r: "Additionally" },
  { p: /\bGame-changer\b/gi, r: "Fundamental shift" },
  { p: /\bGuide\b/gi, r: "Manual" },
  { p: /\bHarness\b/gi, r: "Utilize" },
  { p: /\bHigh-Fidelity\b/gi, r: "Accurate" },
  { p: /\bLandscape\b/gi, r: "Environment" },
  { p: /\bLearn\b/gi, r: "Review" },
  { p: /\bLeverage\b/gi, r: "Use" },
  { p: /\bMedia\b/gi, r: "Assets" },
  { p: /\bModern\b/gi, r: "Standard" },
  { p: /\bMoreover\b/gi, r: "Additionally" },
  { p: /\bNavigating\b/gi, r: "Operating" },
  { p: /\bOrchestrate\b/gi, r: "Coordinate" },
  { p: /\bPivotal\b/gi, r: "Significant" },
  { p: /\bPlethora\b/gi, r: "Collection" },
  { p: /\bPowerhouse\b/gi, r: "High-throughput platform" },
  { p: /\bRealm\b/gi, r: "Domain" },
  { p: /\bRobust\b/gi, r: "Resilient" },
  { p: /\bSeamlessly\b/gi, r: "Directly" },
  { p: /\bSeamless\b/gi, r: "Direct" },
  { p: /\bTapestry\b/gi, r: "Architecture" },
  { p: /\bTechnical\b/gi, r: "Engineering" },
  { p: /\bTestament\b/gi, r: "Proof" },
  { p: /\bUltimate\b/gi, r: "Definitive" },
  { p: /\bUltra-High\b/gi, r: "Extreme" },
  { p: /\bUncover\b/gi, r: "Identify" },
  { p: /\bUnleash\b/gi, r: "Enable" },
  { p: /\bUnlock\b/gi, r: "Access" },
  { p: /\bUnpacking\b/gi, r: "Analyzing" },
  { p: /\bVerified\b/gi, r: "Validated" },
  { p: /\bVital\b/gi, r: "Essential" },
  { p: /\bAdopt\b/gi, r: "Apply" },
  { p: /\bAdopting\b/gi, r: "Implementing" },
  { p: /\bPipelines\b/gi, r: "Workflows" },
  { p: /\bComplete\b/gi, r: "Full" },
  { p: /\bbypass login locks\b/gi, r: "run startup repair" },
  { p: /\bbypass login\b/gi, r: "execute account recovery" },
  { p: /\bzero unplanned downtime\b/gi, r: "minimal unplanned downtime" },
  { p: /\bzero downtime\b/gi, r: "minimal service disruption" },
  { p: /\b100% accuracy\b/gi, r: "high accuracy" },
  { p: /\bguarantee flawless\b/gi, r: "maximize reliable" }
];

function sanitizeAllContent(raw) {
  if (!raw) return raw;
  let text = raw;

  // Enforce strict heading hierarchy: convert any <h4 ...>...</h4> to <p ...>...</p>
  text = text.replace(/<h4\b([^>]*)>([\s\S]*?)<\/h4>/gi, (match, attrs, inner) => {
    const cleanInner = inner.replace(/&amp;/g, 'and').replace(/&/g, 'and');
    return `<p${attrs}>${cleanInner}</p>`;
  });

  // Unbold inline SEO question keywords (keep UI labels and colon-terminated list labels intact)
  text = text.replace(/<strong[^>]*>((?:how to|what is|what does|where is|why is|#spill|excel |find |replace |substitute |change |merge |spill )[^<]*?)<\/strong>/gi, (match, inner) => {
    if (inner.trim().endsWith(':') || inner.includes('&gt;') || inner.includes('>')) return match;
    return inner;
  });

  // Run replacements
  for (const { p, r } of REPLACEMENTS) {
    text = text.replace(p, r);
  }

  // Eliminate em-dashes and en-dashes
  text = text.replace(/—/g, ', ');
  text = text.replace(/ – /g, ', ');

  return text;
}

if (require.main === module) {
  const fs = require('fs');
  const path = require('path');
  const articlesPath = path.join(__dirname, '..', 'src', 'data', 'articles.ts');
  const content = fs.readFileSync(articlesPath, 'utf8');
  const m = content.match(/export const articles: Article\[\] = (\[[\s\S]*?\n\]);/);
  if (!m) {
    console.error('Could not parse articles array');
    process.exit(1);
  }
  const articles = eval(m[1]);
  console.log(`Auditing ${articles.length} articles in src/data/articles.ts...`);

  let issues = 0;
  for (const a of articles) {
    if (a.title.includes('&') || a.headline.includes('&')) {
      console.log(`[ISSUE] ${a.slug}: '&' in title/headline`);
      issues++;
    }
    if (a.contentHtml.includes('\u2014') || JSON.stringify(a.faqs).includes('\u2014')) {
      console.log(`[ISSUE] ${a.slug}: em-dash found`);
      issues++;
    }
    const bolds = [...a.contentHtml.matchAll(/<strong[^>]*>(.*?)<\/strong>/gi)].map(x => x[1]);
    const uiButtons = ['Find &amp; Select', 'Find what', 'Replace with', 'Replace All', 'Find All', 'Merge &amp; Center', 'Excel Workbooks'];
    const badBolds = bolds.filter(b => /^(how to|what is|what does|where is|why is|#spill|excel |find |replace |substitute |change |merge |spill )/i.test(b.trim()) && !b.trim().endsWith(':') && !b.includes('&gt;') && !uiButtons.includes(b.trim()));
    if (badBolds.length > 0) {
      console.log(`[ISSUE] ${a.slug}: inline bolded SEO keywords:`, badBolds);
      issues++;
    }
    const h2s = [...a.contentHtml.matchAll(/<h2[^>]*id="([^"]+)"/g)].map(x => x[1]);
    const tocIds = a.tableOfContents.filter(t => t.level === 2).map(t => t.id);
    if (JSON.stringify(h2s) !== JSON.stringify(tocIds)) {
      console.log(`[ISSUE] ${a.slug}: TOC mismatch`, { h2s, tocIds });
      issues++;
    }
    const tds = [...a.contentHtml.matchAll(/<td[^>]*>(.*?)<\/td>/gi)].map(x => x[1].replace(/<[^>]+>/g, '').trim());
    const vagueTds = tds.filter(t => ['High', 'Medium', 'Low', 'None', 'Yes', 'No'].includes(t));
    if (vagueTds.length > 0) {
      console.log(`[ISSUE] ${a.slug}: vague single-word table cells:`, vagueTds);
      issues++;
    }
    const ps = [...a.contentHtml.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)].map(x => x[1].replace(/<[^>]+>/g, ''));
    ps.forEach((p, idx) => {
      const qMatches = p.match(/\b(how to|what is|what does|where is|why is|how do|can i)\b/gi) || [];
      if (qMatches.length >= 3) {
        console.log(`[ISSUE] ${a.slug}: P#${idx + 1} has ${qMatches.length} question phrases: ${p.slice(0, 100)}...`);
        issues++;
      }
    });
  }

  const bv = articles.find(a => a.slug === 'bvostfus-python-issue-fix');
  if (bv) {
    const bvText = (bv.contentHtml + ' ' + JSON.stringify(bv.faqs)).toLowerCase();
    const bvCount = (bvText.match(/bvostfus python issue fix/g) || []).length;
    console.log(`[CHECK] bvostfus-python-issue-fix keyword count (content + FAQs): ${bvCount} | primaryKeyword: "${bv.primaryKeyword}"`);
  }

  console.log(`Total audit issues found: ${issues}`);
  if (issues > 0) process.exit(1);
}

module.exports = { sanitizeAllContent, REPLACEMENTS };
