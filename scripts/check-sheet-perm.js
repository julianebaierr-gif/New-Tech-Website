const https = require('https');

const url = 'https://docs.google.com/spreadsheets/d/1BF0Em2tRbmexI88f1vchZavzad1vp1JgImCJxdSUWxY/edit';

https.get(url, res => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log('Status code:', res.statusCode);
    const m = body.match(/"canEdit":(true|false)/);
    if (m) console.log('canEdit match:', m[0]);
    const v = body.match(/"isViewOnly":(true|false)/);
    if (v) console.log('isViewOnly match:', v[0]);
    const w = body.match(/"canWrite":(true|false)/);
    if (w) console.log('canWrite match:', w[0]);
  });
}).on('error', e => console.error(e));
