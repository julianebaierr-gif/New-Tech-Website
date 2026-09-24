const fs = require('fs');
const path = require('path');

const userList = [
  'A deep dive into', 'A Guide to', 'Adopt', 'Adopting', 'An in-depth look at',
  'An in-depth look into', 'As we look ahead', 'Battle-tested', 'Beacon',
  'Bulletproof', 'Complete', 'Comprehensive', 'Comprehensive Guide',
  'Comprehensive Guide to', 'Consumption', 'Cornerstone', 'Crucial',
  'Crucial component', 'Deep dive', 'Delve', 'Delve into', 'Delving',
  'Demystifying', 'Digital', 'Discover', 'Discover verified facts', 'Dive into',
  'Elevate', 'Embark', 'Enterprise-grade', 'Evolution', 'Explore', 'Extracting',
  'Find', 'Find verified facts', 'Foster', 'Furthermore', 'Game-changer', 'Guide',
  'Harness', 'Helpful background', 'Helpful background details and common queries',
  'High-Fidelity', 'In conclusion', 'In this article', 'In this article, we explore',
  'In today\'s digital era', 'In today\'s fast-paced', 'In today\'s fast-paced digital world',
  'In-depth', 'It is crucial to', 'It is important to note', 'It is important to remember',
  'Key Insights', 'Landscape', 'Learn', 'Learn how', 'Learn more', 'Learn more details',
  'Learn more now', 'Learn more today', 'Leverage', 'Look no further', 'Media',
  'Modern', 'Modern teams adopting', 'Moreover', 'Navigating', 'Navigating the',
  'Orchestrate', 'Paradigm shift', 'Pipelines', 'Pivotal', 'Plethora', 'Powerhouse',
  'Realm', 'Robust', 'Seamless', 'Seamlessly', 'Tapestry', 'Technical', 'Testament',
  'The Ultimate', 'Ultimate', 'Ultimate Guide', 'Ultra-High', 'Uncover', 'Unleash',
  'Unlock', 'Unpacking', 'Verified', 'Vital', 'Vital role'
];

function getAllFiles(dir, exts = ['.ts', '.tsx', '.js', '.jsx']) {
  let res = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.next') {
        res = res.concat(getAllFiles(full, exts));
      }
    } else if (exts.includes(path.extname(entry.name))) {
      res.push(full);
    }
  }
  return res;
}

const root = path.join(__dirname, '..');
const srcDir = path.join(root, 'src');
const files = getAllFiles(srcDir);

const report = [];

for (const file of files) {
  const rel = path.relative(srcDir, file);
  const lines = fs.readFileSync(file, 'utf8').split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (const term of userList) {
      const isPhrase = term.includes(' ');
      const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = isPhrase 
        ? new RegExp(escaped, 'gi')
        : new RegExp('\\b' + escaped + '\\b', 'gi');

      if (regex.test(line)) {
        if (term === 'Find') {
          // JS Array.find()
          if (line.includes('.find(') || line.includes('find(')) {
            const stripped = line.replace(/\.find\([^)]*\)/g, '');
            if (!regex.test(stripped)) {
              continue;
            }
          }
          // Linux shell command `find /...` or `find -type`
          if (line.includes('find /') || line.includes('find -')) {
            const stripped = line.replace(/find \/|find -/g, '');
            if (!regex.test(stripped)) {
              continue;
            }
          }
        }
        // Exception: SEO keywords definition array or property
        if (line.includes('secondaryKeywords') || line.includes('primaryKeyword') || line.includes('how to find duplicates in excel')) {
          continue;
        }

        report.push({
          file: rel,
          lineNum: i + 1,
          term,
          line: line.trim()
        });
      }
    }
  }
}

fs.writeFileSync(path.join(__dirname, 'scan-report.json'), JSON.stringify(report, null, 2), 'utf8');
console.log(`Scan completed. Total matches: ${report.length}. Written to scripts/scan-report.json`);
