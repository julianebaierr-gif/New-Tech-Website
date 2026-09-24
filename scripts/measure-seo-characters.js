const fs = require('fs');
const path = require('path');

console.log('================================================================');
console.log('   TECH OPS WIRE - COMPLETE METADATA & CHARACTER LENGTH AUDIT   ');
console.log('================================================================\n');

const siteConfig = {
  name: "TechOps Wire",
  tagline: "Practical Guides for Cloud, Spreadsheets & Operating Systems",
  description: "Clear tutorials, spreadsheet formulas, cloud comparisons, and operating system guides written and tested by working technicians."
};

// 1. Homepage
const homeTitle = `${siteConfig.name} | ${siteConfig.tagline}`;
console.log(`[HOMEPAGE]`);
console.log(`  Full Title: "${homeTitle}"`);
console.log(`  Length: ${homeTitle.length} chars (Recommended: 50-60 chars)`);
console.log(`  Meta Description: "${siteConfig.description}"`);
console.log(`  Length: ${siteConfig.description.length} chars (Recommended: 140-160 chars)`);
console.log('----------------------------------------------------------------\n');

// 2. Static Pages
const staticPages = [
  {
    name: "About Us (/about)",
    title: "About TechOps Wire | Editorial Team, Testing Standards & Mission | TechOps Wire",
    rawTitle: "About TechOps Wire | Editorial Team, Testing Standards & Mission",
    desc: "Read about TechOps Wire, our editorial background, and why we test every spreadsheet formula, cloud configuration, and operating system tutorial on real machines before publishing."
  },
  {
    name: "Editorial Policy (/editorial-policy)",
    title: "Editorial Policy & Testing Standards | TechOps Wire",
    rawTitle: "Editorial Policy & Testing Standards | TechOps Wire",
    desc: "See how we test code on real systems, keep tutorials up to date, verify command safety, and handle reader corrections."
  },
  {
    name: "Contact (/contact)",
    title: "Contact Editorial Support | TechOps Wire",
    rawTitle: "Contact Editorial Support",
    desc: "Get in touch with our editorial team for technical suggestions, factual corrections, and infrastructure guide requests."
  },
  {
    name: "Privacy Policy (/privacy)",
    title: "Privacy Policy | TechOps Wire",
    rawTitle: "Privacy Policy",
    desc: "Read our transparent privacy policies, data handling standards, and cookie practices."
  },
  {
    name: "Terms of Service (/terms)",
    title: "Terms of Service | TechOps Wire",
    rawTitle: "Terms of Service",
    desc: "Review the terms and conditions for using TechOps Wire code snippets, guides, and tutorials."
  }
];

console.log(`[STATIC PAGES]`);
staticPages.forEach(p => {
  console.log(`• ${p.name}`);
  console.log(`  Meta Title: "${p.title}" (${p.title.length} chars)`);
  console.log(`  Meta Desc:  "${p.desc}" (${p.desc.length} chars)`);
});
console.log('----------------------------------------------------------------\n');

// 3. Authors
const authors = [
  {
    id: "evan-mitchell",
    name: "Evan Mitchell",
    role: "Cloud Infrastructure Specialist & Systems Administrator",
    bio: "Systems administrator with 3+ years managing enterprise Linux servers, AWS EC2 instances, and Docker containers. Evan focuses on practical bash scripting and secure network configurations."
  },
  {
    id: "sarah-blake",
    name: "Sarah Blake",
    role: "Senior Data Operations & Spreadsheet Analyst",
    bio: "Data analyst with 3+ years designing automated reporting engines, dynamic financial spreadsheets, and clean data workflows in Microsoft Excel and Google Sheets."
  }
];

console.log(`[AUTHOR PROFILES (/authors/[id])]`);
authors.forEach(a => {
  const authorTitle = `${a.name} - ${a.role} | TechOps Wire`;
  console.log(`• ${a.name} (/authors/${a.id})`);
  console.log(`  Meta Title: "${authorTitle}" (${authorTitle.length} chars)`);
  console.log(`  Meta Desc:  "${a.bio}" (${a.bio.length} chars)`);
});
console.log('----------------------------------------------------------------\n');

// 4. Categories
const categories = [
  { name: "Data & Excel Automation", slug: "data-excel-automation", desc: "Excel formulas, drop-down lists, formatting tricks, and practical data cleaning steps." },
  { name: "Cloud & Infrastructure", slug: "cloud-infrastructure", desc: "Linux commands, AWS server setups, Docker tips, and network troubleshooting." },
  { name: "AI & Developer Tools", slug: "ai-developer-tools", desc: "Token limits, API pricing comparisons, developer tool workflows, and prompt mechanics." },
  { name: "OS & Systems", slug: "os-systems", desc: "Windows 11 settings, Linux file permissions, server migration roadmaps, and maintenance tips." }
];

console.log(`[CATEGORY ARCHIVES (/category/[slug])]`);
categories.forEach(c => {
  const catTitle = `${c.name} Articles | TechOps Wire`;
  console.log(`• ${c.name} (/category/${c.slug})`);
  console.log(`  Meta Title: "${catTitle}" (${catTitle.length} chars)`);
  console.log(`  Meta Desc:  "${c.desc}" (${c.desc.length} chars)`);
});
console.log('----------------------------------------------------------------\n');

// 5. Articles
const articlesPath = path.join(__dirname, '../src/data/articles.ts');
const articlesContent = fs.readFileSync(articlesPath, 'utf8');

// Parse articles
const articleBlocks = articlesContent.split(/\{\s*slug:\s*"/g).slice(1);

console.log(`[ARTICLES (${articleBlocks.length} TOTAL)]`);

const articleReport = [];

articleBlocks.forEach((block, idx) => {
  const slug = (block.match(/^([^"]+)"/) || [])[1];
  const title = (block.match(/title:\s*"([^"]+)"/) || [])[1];
  const excerpt = (block.match(/excerpt:\s*"([^"]+)"/) || [])[1];

  // In Next.js layout template: title is `${title} | TechOps Wire`
  const metaTitle = `${title} | TechOps Wire`;
  const metaDesc = excerpt;

  articleReport.push({
    num: idx + 1,
    slug,
    h1Title: title,
    h1Length: title.length,
    metaTitle: metaTitle,
    metaTitleLength: metaTitle.length,
    metaDesc: metaDesc,
    metaDescLength: metaDesc.length
  });

  console.log(`[#${idx+1}] /articles/${slug}`);
  console.log(`  H1 Title:         "${title}" (${title.length} chars)`);
  console.log(`  Full Meta Title:  "${metaTitle}" (${metaTitle.length} chars)`);
  console.log(`  Meta Description: "${metaDesc}" (${metaDesc.length} chars)`);
  console.log('');
});

// Summary table
console.log('================================================================');
console.log('SUMMARY TABLE: ARTICLE META TITLE & DESCRIPTION LENGTHS');
console.log('================================================================');
console.log('Slug | Meta Title (chars) | Meta Description (chars)');
articleReport.forEach(r => {
  console.log(`${r.slug} | ${r.metaTitleLength} chars | ${r.metaDescLength} chars`);
});
