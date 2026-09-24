const fs = require('fs');
const html = fs.readFileSync('scripts/sheet_raw.html', 'utf8');

// Find all occurrences of bind, docos, mutation, batchUpdate
const terms = ['batchUpdate', 'save', 'mutate', 'edit', 'upload', 'token', 'xsrf', 'at='];
terms.forEach(t => {
  let idx = 0;
  let count = 0;
  while ((idx = html.indexOf(t, idx)) !== -1 && count < 3) {
    count++;
    console.log(`[${t}] at ${idx}:`, html.slice(Math.max(0, idx - 40), idx + 100).replace(/\s+/g, ' '));
    idx += t.length;
  }
});
