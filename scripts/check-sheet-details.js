const https = require('https');
const fs = require('fs');

https.get('https://docs.google.com/spreadsheets/d/1BF0Em2tRbmexI88f1vchZavzad1vp1JgImCJxdSUWxY/edit', res => {
  let body = '';
  res.on('data', c => body += c);
  res.on('end', () => {
    fs.writeFileSync('scripts/sheet_edit_page.html', body);
    console.log('Saved page HTML, length:', body.length);
    const regex1 = /"permissionLevel":"([^"]+)"/;
    const m1 = body.match(regex1);
    if (m1) console.log('permissionLevel:', m1[1]);
    const regex2 = /"userRole":"([^"]+)"/;
    const m2 = body.match(regex2);
    if (m2) console.log('userRole:', m2[1]);
    const regex3 = /"canEdit":\s*([a-z]+)/;
    const m3 = body.match(regex3);
    if (m3) console.log('canEdit:', m3[1]);
    const regex4 = /"isPublic":\s*([a-z]+)/;
    const m4 = body.match(regex4);
    if (m4) console.log('isPublic:', m4[1]);
  });
});
