const fs = require('fs');
const path = require('path');

function parseCSV(text) {
  const rows = [];
  let cur = [];
  let field = '';
  let inQ = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQ) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQ = false;
        }
      } else {
        field += c;
      }
    } else {
      if (c === '"') {
        inQ = true;
      } else if (c === ',') {
        cur.push(field);
        field = '';
      } else if (c === '\n' || c === '\r') {
        if (c === '\r' && text[i + 1] === '\n') i++;
        cur.push(field);
        field = '';
        if (cur.length > 1 || cur[0] !== '') rows.push(cur);
        cur = [];
      } else {
        field += c;
      }
    }
  }
  if (field || cur.length) {
    cur.push(field);
    rows.push(cur);
  }
  return rows;
}

const csvPath = path.join(__dirname, 'sheet2_updated.csv');
const rows = parseCSV(fs.readFileSync(csvPath, 'utf8'));

const articlesPath = path.join(__dirname, '..', 'src', 'data', 'articles.ts');
const articlesText = fs.readFileSync(articlesPath, 'utf8');

const articleMatches = [...articlesText.matchAll(/slug:\s*["']([^"']+)["'][\s\S]*?title:\s*["']([^"']+)["'][\s\S]*?primaryKeyword:\s*["']([^"']+)["']/g)];
const existingArticles = articleMatches.map(m => ({
  slug: m[1],
  title: m[2],
  keyword: m[3].toLowerCase()
}));

const silos = {};

for (let i = 1; i < rows.length; i++) {
  const r = rows[i];
  const silo = (r[0] || '').trim();
  const title = (r[1] || '').trim();
  const kw = (r[2] || '').trim().toLowerCase();
  const status = (r[9] || '').trim();

  if (!silos[silo]) silos[silo] = [];

  const covered = existingArticles.find(a => 
    a.keyword === kw || 
    kw.includes(a.keyword) || 
    a.keyword.includes(kw) ||
    a.slug.includes(kw.replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))
  );

  const isLive = status.toLowerCase() === 'live' || !!covered;
  silos[silo].push({
    rowIdx: i + 1,
    title,
    kw,
    isLive,
    slug: covered?.slug || (isLive ? 'marked live' : null)
  });
}

for (const [silo, list] of Object.entries(silos)) {
  console.log(`\n======================================================`);
  console.log(`SILO: ${silo} (Total: ${list.length}, Live: ${list.filter(x => x.isLive).length}, Pending: ${list.filter(x => !x.isLive).length})`);
  console.log(`======================================================`);
  list.forEach(item => {
    const statusTag = item.isLive ? `[LIVE: ${item.slug}]` : `[PENDING]`;
    console.log(`  Row ${item.rowIdx} | ${statusTag} | "${item.kw}" -> ${item.title}`);
  });
}
