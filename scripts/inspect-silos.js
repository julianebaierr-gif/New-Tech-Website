const fs = require('fs');

function parseCSV(text) {
  const rows = [];
  let currentRow = [];
  let currentField = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];
    if (char === '"') {
      if (inQuotes && nextChar === '"') { currentField += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      currentRow.push(currentField); currentField = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') i++;
      currentRow.push(currentField); currentField = '';
      if (currentRow.length > 1 || currentRow[0] !== '') rows.push(currentRow);
      currentRow = [];
    } else { currentField += char; }
  }
  if (currentField || currentRow.length > 0) { currentRow.push(currentField); rows.push(currentRow); }
  return rows;
}

const csv = fs.readFileSync('scripts/live_sheet2_after.csv', 'utf8');
const rows = parseCSV(csv);
const silos = {};

for (let r = 1; r < rows.length; r++) {
  const silo = rows[r][0];
  const status = rows[r][9] || 'Pending';
  if (!silos[silo]) silos[silo] = { total: 0, live: 0, pending: 0 };
  silos[silo].total++;
  if (status.toLowerCase() === 'live') silos[silo].live++;
  else silos[silo].pending++;
}

console.log('Category Silos Status in Sheet2:');
console.log(JSON.stringify(silos, null, 2));
