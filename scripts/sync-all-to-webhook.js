const https = require('https');
const fs = require('fs');

const webhookUrl = 'https://script.google.com/macros/s/AKfycbxawZ-7K7VjR2_wOgqiVtdalkvFohhoM3VxRbnBmjsSz7pWnVVyA-EPXYJwvUNHuCjR8w/exec';

const articlesToSync = [
  {
    keyword: "excel drop down list",
    category: "Data & Excel Automation",
    tags: "how to create a drop down list in excel, how to add drop down list in excel, create drop down list in excel, excel drop down menu",
    postUrl: "https://techopswire.com/articles/excel-drop-down-list",
    postDate: "2026-09-24 10:00:00"
  },
  {
    keyword: "how to remove duplicates in excel",
    category: "Data & Excel Automation",
    tags: "how to find duplicates in excel, how to delete duplicates in excel, how to highlight duplicates in excel, remove duplicates in excel shortcut",
    postUrl: "https://techopswire.com/articles/how-to-remove-duplicates-in-excel",
    postDate: "2026-09-24 10:00:00"
  },
  {
    keyword: "aws ec2 instance types",
    category: "Cloud & Infrastructure",
    tags: "ec2 instance types comparison, aws ec2 instance types pricing, best ec2 instances for web servers",
    postUrl: "https://techopswire.com/articles/aws-ec2-instance-types-explained",
    postDate: "2026-09-24 10:00:00"
  },
  {
    keyword: "server 2019 end of life",
    category: "OS & Systems",
    tags: "windows server 2019 support lifecycle, server 2019 upgrade to 2022, windows server migration checklist",
    postUrl: "https://techopswire.com/articles/windows-server-2019-end-of-life",
    postDate: "2026-09-24 10:00:00"
  },
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

function postArticle(art) {
  return new Promise((resolve) => {
    const jsonStr = JSON.stringify(art);
    console.log(`[SYNCING] Posting: ${art.keyword}...`);

    function makeRequest(url, method, body) {
      const u = new URL(url);
      const options = {
        hostname: u.hostname,
        path: u.pathname + u.search,
        method: method,
        headers: {
          'Content-Type': 'application/json',
          ...(body ? { 'Content-Length': Buffer.byteLength(body) } : {})
        }
      };

      const req = https.request(options, res => {
        if (res.statusCode === 302 || res.statusCode === 301 || res.statusCode === 307) {
          makeRequest(res.headers.location, 'GET', null);
          return;
        }
        let resBody = '';
        res.on('data', chunk => resBody += chunk);
        res.on('end', () => {
          console.log(`  -> Response: ${resBody.trim()}`);
          resolve(true);
        });
      });

      req.on('error', err => {
        console.error(`  -> Error:`, err.message);
        resolve(false);
      });

      if (body) req.write(body);
      req.end();
    }

    makeRequest(webhookUrl, 'POST', jsonStr);
  });
}

async function run() {
  console.log(`Syncing ${articlesToSync.length} articles to Google Sheet via Webhook...\n`);
  for (let i = 0; i < articlesToSync.length; i++) {
    await postArticle(articlesToSync[i]);
    // Small delay between posts to prevent concurrency locks
    await new Promise(r => setTimeout(r, 1200));
  }
  console.log('\n[COMPLETE] All 9 articles sent to Google Sheet Webhook!');
}

run();
