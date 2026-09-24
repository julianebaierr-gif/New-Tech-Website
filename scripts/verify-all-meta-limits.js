const fs = require('fs');
const path = require('path');

// Extract all articles directly from src/data/articles.ts
const articlesContent = fs.readFileSync(path.join(__dirname, '../src/data/articles.ts'), 'utf8');

// Regex match for articles
const articleMatches = [];
const articleRegex = /slug:\s*"([^"]+)",[\s\S]*?metaTitle:\s*"([^"]+)",[\s\S]*?metaDescription:\s*"([^"]+)"/g;
let match;
while ((match = articleRegex.exec(articlesContent)) !== null) {
  articleMatches.push({
    slug: match[1],
    title: match[2],
    desc: match[3]
  });
}

// Extract static pages
const termsContent = fs.readFileSync(path.join(__dirname, '../src/app/terms/page.tsx'), 'utf8');
const aboutContent = fs.readFileSync(path.join(__dirname, '../src/app/about/page.tsx'), 'utf8');
const contactContent = fs.readFileSync(path.join(__dirname, '../src/app/contact/page.tsx'), 'utf8');
const privacyContent = fs.readFileSync(path.join(__dirname, '../src/app/privacy/page.tsx'), 'utf8');
const editorialContent = fs.readFileSync(path.join(__dirname, '../src/app/editorial-policy/page.tsx'), 'utf8');
const siteConfigContent = fs.readFileSync(path.join(__dirname, '../src/lib/siteConfig.ts'), 'utf8');
const categoryContent = fs.readFileSync(path.join(__dirname, '../src/app/category/[slug]/page.tsx'), 'utf8');
const authorContent = fs.readFileSync(path.join(__dirname, '../src/app/authors/[id]/page.tsx'), 'utf8');

function extractMeta(content) {
  const titleM = content.match(/absolute:\s*"([^"]+)"/);
  const descM = content.match(/description:\s*"([^"]+)"/);
  return {
    title: titleM ? titleM[1] : null,
    desc: descM ? descM[1] : null
  };
}

// Homepage title is siteConfig.name + " | " + siteConfig.tagline
const nameM = siteConfigContent.match(/name:\s*"([^"]+)"/);
const taglineM = siteConfigContent.match(/tagline:\s*"([^"]+)"/);
const homeDescM = siteConfigContent.match(/description:\s*"([^"]+)"/);

const homeTitle = `${nameM[1]} | ${taglineM[1]}`;
const homeDesc = homeDescM[1];

// Extract categories from categoryContent
const catMap = [];
const catRegex = /"([^"]+)":\s*\{[\s\S]*?title:\s*"([^"]+)",[\s\S]*?desc:\s*"([^"]+)"/g;
let cm;
while ((cm = catRegex.exec(categoryContent)) !== null) {
  catMap.push({
    slug: cm[1],
    title: cm[2],
    desc: cm[3]
  });
}

// Extract authors from authorContent
const authMap = [];
const authRegex = /"([^"]+)":\s*\{[\s\S]*?title:\s*"([^"]+)",[\s\S]*?desc:\s*"([^"]+)"/g;
let am;
while ((am = authRegex.exec(authorContent)) !== null) {
  authMap.push({
    slug: am[1],
    title: am[2],
    desc: am[3]
  });
}

const allPages = [
  { name: "Homepage (/)", title: homeTitle, desc: homeDesc },
  { name: "About (/about)", ...extractMeta(aboutContent) },
  { name: "Editorial Policy (/editorial-policy)", ...extractMeta(editorialContent) },
  { name: "Contact (/contact)", ...extractMeta(contactContent) },
  { name: "Privacy Policy (/privacy)", ...extractMeta(privacyContent) },
  { name: "Terms of Service (/terms)", ...extractMeta(termsContent) },
  ...catMap.map(c => ({ name: `Category: ${c.slug} (/category/${c.slug})`, title: c.title, desc: c.desc })),
  ...authMap.map(a => ({ name: `Author: ${a.slug} (/authors/${a.slug})`, title: a.title, desc: a.desc })),
  ...articleMatches.map(ar => ({ name: `Article: ${ar.slug} (/articles/${ar.slug})`, title: ar.title, desc: ar.desc }))
];

console.log(`\nAuditing ${allPages.length} Pages Across Entire Website:\n`);

let passCount = 0;
let failCount = 0;

allPages.forEach((p, index) => {
  const tLen = p.title ? p.title.length : 0;
  const dLen = p.desc ? p.desc.length : 0;
  const tOk = tLen >= 50 && tLen <= 55;
  const dOk = dLen >= 150 && dLen <= 155;

  const hasEmDash = (p.title && p.title.includes('—')) || (p.desc && p.desc.includes('—'));
  const hasSpacedHyphen = (p.title && p.title.includes(' - ')) || (p.desc && p.desc.includes(' - '));

  const passed = tOk && dOk && !hasEmDash && !hasSpacedHyphen;

  if (passed) {
    passCount++;
  } else {
    failCount++;
  }

  console.log(`[${index + 1}] ${p.name}`);
  console.log(`    Title (${tLen} chars) [${tOk ? 'PASS' : 'FAIL'}]: "${p.title}"`);
  console.log(`    Desc  (${dLen} chars) [${dOk ? 'PASS' : 'FAIL'}]: "${p.desc}"`);
  if (hasEmDash) console.log(`    [ERROR] Contains em-dash!`);
  if (hasSpacedHyphen) console.log(`    [ERROR] Contains spaced hyphen!`);
  console.log('');
});

console.log("===============================================================================");
console.log(`TOTAL AUDITED: ${allPages.length} pages`);
console.log(`PASSED: ${passCount} | FAILED: ${failCount}`);
console.log(`PERFECT COMPLIANCE (50-55 Chars Title & 150-155 Chars Desc): ${failCount === 0 ? 'YES - 100%' : 'NO'}`);
console.log("===============================================================================");

if (failCount > 0) {
  process.exit(1);
}
