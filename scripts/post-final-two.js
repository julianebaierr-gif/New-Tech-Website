const https = require('https');

const webhookUrl = 'https://script.google.com/macros/s/AKfycbxawZ-7K7VjR2_wOgqiVtdalkvFohhoM3VxRbnBmjsSz7pWnVVyA-EPXYJwvUNHuCjR8w/exec';

const finalTwo = [
  {
    keyword: "chatgpt file upload limit",
    category: "AI & Developer Tools",
    tags: "chatgpt plus file upload limits, chatgpt pdf max size, chatgpt token limits explained",
    postUrl: "https://techopswire.com/articles/chatgpt-file-upload-limits",
    postDate: "2026-09-24 10:00:00"
  },
  {
    keyword: "windows 11 pro vs home",
    category: "OS & Systems",
    tags: "difference between windows 11 home and pro, is windows 11 pro worth it, windows 11 bitlocker vs home",
    postUrl: "https://techopswire.com/articles/windows-11-pro-vs-home",
    postDate: "2026-09-24 10:00:00"
  }
];

function postOne(art) {
  return new Promise((resolve) => {
    const jsonStr = JSON.stringify(art);
    console.log(`[POSTING] ${art.keyword}...`);

    function doReq(url, method, body) {
      const u = new URL(url);
      const req = https.request({
        hostname: u.hostname,
        path: u.pathname + u.search,
        method: method,
        timeout: 25000,
        headers: {
          'Content-Type': 'application/json',
          ...(body ? { 'Content-Length': Buffer.byteLength(body) } : {})
        }
      }, res => {
        if (res.statusCode === 302 || res.statusCode === 301 || res.statusCode === 307) {
          doReq(res.headers.location, 'GET', null);
          return;
        }
        let resData = '';
        res.on('data', d => resData += d);
        res.on('end', () => {
          console.log(`  -> Response: ${resData.trim()}`);
          resolve(true);
        });
      });

      req.on('timeout', () => {
        console.log(`  -> Timeout reached, destroying socket...`);
        req.destroy();
        resolve(true);
      });

      req.on('error', err => {
        console.log(`  -> Error:`, err.message);
        resolve(false);
      });

      if (body) req.write(body);
      req.end();
    }

    doReq(webhookUrl, 'POST', jsonStr);
  });
}

async function run() {
  for (const art of finalTwo) {
    await postOne(art);
    await new Promise(r => setTimeout(r, 3000));
  }
  console.log('Final two done!');
}

run();
