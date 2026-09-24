const puppeteer = require('puppeteer-core');
const fs = require('fs');

async function testPaste() {
  console.log('Launching Chrome...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: false, // let's see if headless or headed, let's use "new" or false
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--window-size=1280,800'
    ]
  });

  const context = browser.defaultBrowserContext();
  await context.overridePermissions('https://docs.google.com', ['clipboard-read', 'clipboard-write']);

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  console.log('Navigating to Google Sheet...');
  await page.goto('https://docs.google.com/spreadsheets/d/1BF0Em2tRbmexI88f1vchZavzad1vp1JgImCJxdSUWxY/edit?gid=0#gid=0', {
    waitUntil: 'networkidle2',
    timeout: 30000
  });

  // Wait 3 seconds for Google Sheets UI to fully initialize
  await new Promise(r => setTimeout(r, 3000));

  // Press ArrowDown to move from A1 to A2
  console.log('Moving to cell A2...');
  await page.keyboard.press('ArrowDown');
  await new Promise(r => setTimeout(r, 500));

  // Prepare TSV data for the 9 rows:
  // Columns: Keywords \t Category \t Tags \t Status \t Post Url \t Post Date / Tmie
  const sheet1Data = fs.readFileSync('scripts/sheet1_data.csv', 'utf8');
  const lines = sheet1Data.split('\r\n').filter(Boolean);
  // parse csv lines to TSV
  const tsvRows = [];
  for (let i = 1; i < lines.length; i++) {
    // Parse line respecting quotes
    const parts = [];
    let cur = '';
    let inQuotes = false;
    const l = lines[i];
    for (let c = 0; c < l.length; c++) {
      if (l[c] === '"') inQuotes = !inQuotes;
      else if (l[c] === ',' && !inQuotes) { parts.push(cur); cur = ''; }
      else cur += l[c];
    }
    parts.push(cur);
    tsvRows.push(parts.join('\t'));
  }
  const tsvContent = tsvRows.join('\n');
  console.log('TSV Content to paste:\n', tsvContent);

  // Write to clipboard inside browser
  await page.evaluate(async (text) => {
    await navigator.clipboard.writeText(text);
  }, tsvContent);

  console.log('Pasting via Ctrl+V...');
  await page.keyboard.down('Control');
  await page.keyboard.press('KeyV');
  await page.keyboard.up('Control');

  // Wait 4 seconds for Google Sheets to process paste and save
  await new Promise(r => setTimeout(r, 4000));

  await page.screenshot({ path: 'scripts/sheet1_after_paste.png' });
  console.log('Screenshot saved to scripts/sheet1_after_paste.png');

  await browser.close();
}

testPaste().catch(e => console.error(e));
