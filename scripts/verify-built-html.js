const fs = require('fs');
const path = require('path');

const filesToCheck = [
  { path: '.next/server/app/index.html', name: 'Homepage (/)' },
  { path: '.next/server/app/about.html', name: 'About (/about)' },
  { path: '.next/server/app/editorial-policy.html', name: 'Editorial Policy (/editorial-policy)' },
  { path: '.next/server/app/contact.html', name: 'Contact (/contact)' },
  { path: '.next/server/app/privacy.html', name: 'Privacy Policy (/privacy)' },
  { path: '.next/server/app/terms.html', name: 'Terms of Service (/terms)' },
  { path: '.next/server/app/category/data-excel-automation.html', name: 'Category: Data & Excel' },
  { path: '.next/server/app/category/cloud-infrastructure.html', name: 'Category: Cloud & Infra' },
  { path: '.next/server/app/category/ai-developer-tools.html', name: 'Category: AI & Dev Tools' },
  { path: '.next/server/app/category/os-systems.html', name: 'Category: OS & Systems' },
  { path: '.next/server/app/authors/sarah-blake.html', name: 'Author: Sarah Blake' },
  { path: '.next/server/app/authors/evan-mitchell.html', name: 'Author: Evan Mitchell' },
  { path: '.next/server/app/articles/how-to-remove-duplicates-in-excel.html', name: 'Article: duplicates-in-excel' },
  { path: '.next/server/app/articles/aws-ec2-instance-types-explained.html', name: 'Article: aws-ec2' },
  { path: '.next/server/app/articles/why-is-chatgpt-so-slow.html', name: 'Article: chatgpt-slow' },
  { path: '.next/server/app/articles/windows-11-pro-vs-home.html', name: 'Article: win11-pro-home' },
  { path: '.next/server/app/articles/linux-file-permissions-chmod-chown.html', name: 'Article: linux-permissions' },
  { path: '.next/server/app/articles/excel-drop-down-list.html', name: 'Article: excel-drop-down' },
  { path: '.next/server/app/articles/docker-container-architecture.html', name: 'Article: docker-architecture' },
  { path: '.next/server/app/articles/chatgpt-file-upload-limits.html', name: 'Article: chatgpt-file-limits' },
  { path: '.next/server/app/articles/windows-server-2019-end-of-life.html', name: 'Article: win-server-2019' },
  { path: '.next/server/app/articles/how-to-add-bullet-points-in-excel.html', name: 'Article: bullet-points-excel' },
  { path: '.next/server/app/articles/benefits-of-cloud-computing.html', name: 'Article: cloud-benefits' },
];

console.log("=== INSPECTING PRODUCTION BUILT HTML FILES ===");
let allPassed = true;

filesToCheck.forEach(item => {
  if (!fs.existsSync(item.path)) {
    console.log(`[FILE MISSING] ${item.path}`);
    allPassed = false;
    return;
  }
  const html = fs.readFileSync(item.path, 'utf8');
  const titleM = html.match(/<title>([^<]+)<\/title>/);
  const descM = html.match(/<meta name="description" content="([^"]+)"/);

  const title = titleM ? titleM[1] : '';
  const desc = descM ? descM[1] : '';

  const tLen = title.length;
  const dLen = desc.length;
  const tOk = tLen >= 50 && tLen <= 55;
  const dOk = dLen >= 150 && dLen <= 155;

  if (!tOk || !dOk) allPassed = false;

  console.log(`[${tOk && dOk ? 'PASS' : 'FAIL'}] ${item.name}`);
  console.log(`   Title (${tLen} chars): "${title}"`);
  console.log(`   Desc  (${dLen} chars): "${desc}"`);
});

console.log("\n=============================================");
console.log(`PROD HTML VERIFICATION ALL PASSED: ${allPassed}`);
console.log("=============================================");

if (!allPassed) process.exit(1);
