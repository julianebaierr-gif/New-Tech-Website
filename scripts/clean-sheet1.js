const puppeteer = require('puppeteer-core');
const fs = require('fs');

async function cleanSheet1() {
  console.log('Launching Chrome to clean Sheet1...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1400,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });

  const client = await page.target().createCDPSession();
  await client.send('Browser.grantPermissions', {
    permissions: ['clipboardReadWrite', 'clipboardSanitizedWrite'],
    origin: 'https://docs.google.com'
  });

  console.log('Navigating to Google Sheet...');
  await page.goto('https://docs.google.com/spreadsheets/d/1BF0Em2tRbmexI88f1vchZavzad1vp1JgImCJxdSUWxY/edit?gid=0#gid=0', {
    waitUntil: 'networkidle2',
    timeout: 35000
  });

  await new Promise(r => setTimeout(r, 4000));

  // Make sure Sheet1 tab is active
  await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('.docs-sheet-tab, .docs-sheet-tab-name'));
    for (const t of tabs) {
      if (t.innerText && t.innerText.trim() === 'Sheet1') {
        t.click();
        break;
      }
    }
  });

  await new Promise(r => setTimeout(r, 2000));

  // Focus A1
  await page.keyboard.down('Control');
  await page.keyboard.press('Home');
  await page.keyboard.up('Control');
  await new Promise(r => setTimeout(r, 500));

  // Select all rows down in Sheet1 and clear them
  console.log('Clearing old Sheet1 contents...');
  await page.keyboard.down('Control');
  await page.keyboard.press('KeyA');
  await page.keyboard.up('Control');
  await page.keyboard.press('Delete');
  await new Promise(r => setTimeout(r, 1000));

  // Prepare pristine Sheet1 TSV: Header + 9 distinct articles
  const cleanTsv = [
    ["Keywords", "Category", "Tags", "Status", "Post Url", "Post Date / Tmie"].join('\t'),
    ["how to remove duplicates in excel", "Data & Excel Automation", "how to find duplicates in excel, how to delete duplicates in excel, how to highlight duplicates in excel, remove duplicates in excel shortcut", "Live", "https://techopswire.com/articles/how-to-remove-duplicates-in-excel", "2026-09-24 10:00:00"].join('\t'),
    ["aws ec2 instance types", "Cloud & Infrastructure", "ec2 instance types comparison, aws ec2 instance types pricing, best ec2 instances for web servers", "Live", "https://techopswire.com/articles/aws-ec2-instance-types-explained", "2026-09-24 10:00:00"].join('\t'),
    ["why is chatgpt so slow", "AI & Developer Tools", "chatgpt slow response fix, why does chatgpt take so long to generate, chatgpt latency issues", "Live", "https://techopswire.com/articles/why-is-chatgpt-so-slow", "2026-09-24 10:00:00"].join('\t'),
    ["windows 11 pro vs home", "OS & Systems", "difference between windows 11 home and pro, is windows 11 pro worth it, windows 11 bitlocker vs home", "Live", "https://techopswire.com/articles/windows-11-pro-vs-home", "2026-09-24 10:00:00"].join('\t'),
    ["linux file permissions", "Cloud & Infrastructure", "chmod command in linux, chown command in linux, chmod 755 vs 644, octal notation linux permissions", "Live", "https://techopswire.com/articles/linux-file-permissions-chmod-chown", "2026-09-24 10:00:00"].join('\t'),
    ["excel drop down list", "Data & Excel Automation", "how to create a drop down list in excel, how to add drop down list in excel, create drop down list in excel, excel drop down menu", "Live", "https://techopswire.com/articles/excel-drop-down-list", "2026-09-24 10:00:00"].join('\t'),
    ["docker container architecture", "Cloud & Infrastructure", "docker swarm vs kubernetes, docker overlay network, docker volume vs bind mount", "Live", "https://techopswire.com/articles/docker-container-architecture", "2026-09-24 10:00:00"].join('\t'),
    ["chatgpt file upload limit", "AI & Developer Tools", "chatgpt plus file upload limits, chatgpt pdf max size, chatgpt token limits explained", "Live", "https://techopswire.com/articles/chatgpt-file-upload-limits", "2026-09-24 10:00:00"].join('\t'),
    ["server 2019 end of life", "OS & Systems", "windows server 2019 support lifecycle, server 2019 upgrade to 2022, windows server migration checklist", "Live", "https://techopswire.com/articles/windows-server-2019-end-of-life", "2026-09-24 10:00:00"].join('\t')
  ].join('\n');

  // Go to A1
  await page.keyboard.down('Control');
  await page.keyboard.press('Home');
  await page.keyboard.up('Control');
  await new Promise(r => setTimeout(r, 500));

  console.log('Writing clean data to clipboard...');
  await page.evaluate(async (text) => {
    await navigator.clipboard.writeText(text);
  }, cleanTsv);

  console.log('Pasting clean data into Sheet1...');
  await page.keyboard.down('Control');
  await page.keyboard.press('KeyV');
  await page.keyboard.up('Control');

  console.log('Waiting 6 seconds for Google Drive save...');
  await new Promise(r => setTimeout(r, 6000));

  await page.screenshot({ path: 'scripts/final_sheet1.png' });
  console.log('Saved final screenshot of Sheet1 to scripts/final_sheet1.png');

  await browser.close();
  console.log('Sheet1 cleaned and saved successfully!');
}

cleanSheet1().catch(e => console.error(e));
