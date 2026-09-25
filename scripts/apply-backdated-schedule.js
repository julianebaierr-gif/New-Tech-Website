const fs = require('fs');
const path = require('path');

const schedule = {
  'windows-11-pro-vs-home': {
    iso: '2026-09-15T09:00:00Z',
    csv: '2026-09-15 09:00:00'
  },
  'aws-ec2-instance-types-explained': {
    iso: '2026-09-16T10:00:00Z',
    csv: '2026-09-16 10:00:00'
  },
  'how-to-remove-duplicates-in-excel': {
    iso: '2026-09-17T08:30:00Z',
    csv: '2026-09-17 08:30:00'
  },
  'why-is-chatgpt-so-slow': {
    iso: '2026-09-18T11:00:00Z',
    csv: '2026-09-18 11:00:00'
  },
  'linux-file-permissions-chmod-chown': {
    iso: '2026-09-19T09:30:00Z',
    csv: '2026-09-19 09:30:00'
  },
  'excel-drop-down-list': {
    iso: '2026-09-20T08:00:00Z',
    csv: '2026-09-20 08:00:00'
  },
  'docker-container-architecture': {
    iso: '2026-09-21T10:15:00Z',
    csv: '2026-09-21 10:15:00'
  },
  'chatgpt-file-upload-limits': {
    iso: '2026-09-22T08:45:00Z',
    csv: '2026-09-22 08:45:00'
  },
  'windows-server-2019-end-of-life': {
    iso: '2026-09-23T11:30:00Z',
    csv: '2026-09-23 11:30:00'
  },
  'how-to-add-bullet-points-in-excel': {
    iso: '2026-09-24T13:00:00Z',
    csv: '2026-09-24 13:00:00'
  },
  'benefits-of-cloud-computing': {
    iso: '2026-09-25T15:16:19Z',
    csv: '2026-09-25 15:16:19'
  }
};

// 1. Update src/data/articles.ts
console.log('=== Step 1: Updating src/data/articles.ts ===');
const articlesTsPath = path.join(__dirname, '..', 'src', 'data', 'articles.ts');
let articlesTs = fs.readFileSync(articlesTsPath, 'utf8');

for (const [slug, dates] of Object.entries(schedule)) {
  const slugMarker = `slug: "${slug}",`;
  const slugIdx = articlesTs.indexOf(slugMarker);
  if (slugIdx === -1) {
    console.error(`ERROR: Slug "${slug}" not found in articles.ts`);
    process.exit(1);
  }

  // Find next publishedAt and updatedAt after slugIdx
  const nextPubIdx = articlesTs.indexOf('publishedAt:', slugIdx);
  const nextUpdIdx = articlesTs.indexOf('updatedAt:', slugIdx);

  if (nextPubIdx === -1 || nextUpdIdx === -1) {
    console.error(`ERROR: publishedAt or updatedAt not found for slug "${slug}"`);
    process.exit(1);
  }

  // Replace publishedAt line
  const pubLineEnd = articlesTs.indexOf('\n', nextPubIdx);
  const oldPubLine = articlesTs.slice(nextPubIdx, pubLineEnd);
  articlesTs = articlesTs.slice(0, nextPubIdx) + `publishedAt: "${dates.iso}",` + articlesTs.slice(pubLineEnd);

  // Recalculate nextUpdIdx since length might have shifted
  const shiftedUpdIdx = articlesTs.indexOf('updatedAt:', slugIdx);
  const updLineEnd = articlesTs.indexOf('\n', shiftedUpdIdx);
  const oldUpdLine = articlesTs.slice(shiftedUpdIdx, updLineEnd);
  articlesTs = articlesTs.slice(0, shiftedUpdIdx) + `updatedAt: "${dates.iso}",` + articlesTs.slice(updLineEnd);

  console.log(`[articles.ts] Updated ${slug} -> ${dates.iso}`);
}

fs.writeFileSync(articlesTsPath, articlesTs, 'utf8');
console.log('Successfully saved src/data/articles.ts\n');

// 2. Update scripts/sheet1_data.csv
console.log('=== Step 2: Updating scripts/sheet1_data.csv ===');
const sheet1Path = path.join(__dirname, 'sheet1_data.csv');
let sheet1Content = fs.readFileSync(sheet1Path, 'utf8');
const sheet1Lines = sheet1Content.split('\n');
const newSheet1Lines = sheet1Lines.map(line => {
  if (!line.trim()) return line;
  for (const [slug, dates] of Object.entries(schedule)) {
    if (line.includes(`articles/${slug}`)) {
      // Split by comma preserving quoted fields or replace the last column
      const lastComma = line.lastIndexOf(',');
      return line.slice(0, lastComma + 1) + dates.csv;
    }
  }
  return line;
});
fs.writeFileSync(sheet1Path, newSheet1Lines.join('\n'), 'utf8');
console.log('Successfully updated scripts/sheet1_data.csv\n');

// 3. Update scripts/sheet2_updated.csv
console.log('=== Step 3: Updating scripts/sheet2_updated.csv ===');
const sheet2UpdatedPath = path.join(__dirname, 'sheet2_updated.csv');
let sheet2Content = fs.readFileSync(sheet2UpdatedPath, 'utf8');
const sheet2Lines = sheet2Content.split('\n');
const newSheet2Lines = sheet2Lines.map(line => {
  if (!line.trim()) return line;
  for (const [slug, dates] of Object.entries(schedule)) {
    if (line.includes(`articles/${slug}`)) {
      const lastComma = line.lastIndexOf(',');
      return line.slice(0, lastComma + 1) + dates.csv;
    }
  }
  return line;
});
fs.writeFileSync(sheet2UpdatedPath, newSheet2Lines.join('\n'), 'utf8');
console.log('Successfully updated scripts/sheet2_updated.csv\n');

// 4. Update scripts/sheet2.csv and scripts/live_sheet2_after.csv if present
console.log('=== Step 4: Updating scripts/sheet2.csv and live_sheet2_after.csv ===');
[path.join(__dirname, 'sheet2.csv'), path.join(__dirname, 'live_sheet2_after.csv')].forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  let lines = content.split('\n');
  lines = lines.map(line => {
    if (!line.trim()) return line;
    for (const [slug, dates] of Object.entries(schedule)) {
      if (line.includes(`articles/${slug}`)) {
        const lastComma = line.lastIndexOf(',');
        return line.slice(0, lastComma + 1) + `"${dates.csv}"`;
      }
    }
    return line;
  });
  fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
  console.log(`Successfully updated ${path.basename(filePath)}`);
});

console.log('\nAll files updated with clean 1-per-day backdated schedule!');
