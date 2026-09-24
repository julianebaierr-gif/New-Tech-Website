const https = require('https');

const webhookUrl = 'https://script.google.com/macros/s/AKfycbxawZ-7K7VjR2_wOgqiVtdalkvFohhoM3VxRbnBmjsSz7pWnVVyA-EPXYJwvUNHuCjR8w/exec';

const remainingArticles = [
  {
    keyword: "linux file permissions explained",
    category: "Cloud & Infrastructure",
    tags: "chmod command in linux, chown command in linux, chmod 755 vs 644, octal notation linux permissions",
    postUrl: "https://techopswire.com/articles/linux-file-permissions-chmod-chown",
    postDate: "2026-09-24 10:00:00"
  },
  {
    keyword: "docker swarm vs kubernetes",
    category: "Cloud & Infrastructure",
    tags: "docker swarm vs kubernetes, docker overlay network, docker volume vs bind mount",
    postUrl: "https://techopswire.com/articles/docker-container-architecture",
    postDate: "2026-09-24 10:00:00"
  },
  {
    keyword: "why is chatgpt so slow",
    category: "AI & Developer Tools",
    tags: "chatgpt slow response fix, why does chatgpt take so long to generate, chatgpt latency issues",
    postUrl: "https://techopswire.com/articles/why-is-chatgpt-so-slow",
    postDate: "2026-09-24 10:00:00"
  },
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

function postSingleArticle(art) {
  return new Promise((resolve) => {
    const jsonStr = JSON.stringify(art);
    console.log(`[POSTING] ${art.keyword}...`);

    function doRequest(url, method, body) {
      const u = new URL(url);
      const req = https.request({
        hostname: u.hostname,
        path: u.pathname + u.search,
        method: method,
        timeout: 15000,
        headers: {
          'Content-Type': 'application/json',
          ...(body ? { 'Content-Length': Buffer.byteLength(body) } : {})
        }
      }, res => {
        if (res.statusCode === 302 || res.statusCode === 301 || res.statusCode === 307) {
          doRequest(res.headers.location, 'GET', null);
          return;
        }
        let resData = '';
        res.on('data', d => resData += d);
        res.on('end', () => {
          console.log(`  -> Success: ${resData.trim()}`);
          resolve(true);
        });
      });

      req.on('timeout', () => {
        console.log(`  -> Timeout reached, destroying socket...`);
        req.destroy();
        resolve(true);
      });

      req.on('error', (err) => {
        console.log(`  -> Error: ${err.message}`);
        resolve(false);
      });

      if (body) req.write(body);
      req.end();
    }

    doRequest(webhookUrl, 'POST', jsonStr);
  });
}

async function runRemaining() {
  for (const art of remainingArticles) {
    await postSingleArticle(art);
    await new Promise(r => setTimeout(r, 2000));
  }
  console.log('All remaining articles submitted!');
}

runRemaining();
