const https = require('https');
const fs = require('fs');

https.get('https://docs.google.com/spreadsheets/d/1BF0Em2tRbmexI88f1vchZavzad1vp1JgImCJxdSUWxY/edit', res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    fs.writeFileSync('scripts/sheet_raw.html', data, 'utf8');
    
    // Search for patterns
    const patterns = [
      /isViewOnly/gi,
      /canEdit/gi,
      /userRole/gi,
      /permissionLevel/gi,
      /readOnly/gi,
      /anonymous/gi
    ];
    
    patterns.forEach(p => {
      let match;
      let count = 0;
      while ((match = p.exec(data)) !== null && count < 5) {
        count++;
        const start = Math.max(0, match.index - 50);
        const end = Math.min(data.length, match.index + 100);
        console.log(`[${p.source}] Match ${count}:`, data.slice(start, end).replace(/\s+/g, ' '));
      }
    });
  });
});
