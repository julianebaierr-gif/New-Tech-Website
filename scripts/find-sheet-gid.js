const fs = require('fs');
const html = fs.readFileSync('scripts/sheet_raw.html', 'utf8');

const regex = /"sheetId":\s*(\d+)/g;
let m;
while ((m = regex.exec(html)) !== null) {
  const start = Math.max(0, m.index - 50);
  const end = Math.min(html.length, m.index + 150);
  console.log('Found sheetId:', m[1], 'Context:', html.slice(start, end).replace(/\s+/g, ' '));
}
