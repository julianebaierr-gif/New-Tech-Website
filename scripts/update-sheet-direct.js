const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

// Robust CSV to TSV converter
function csvToTsv(csvText) {
  const rows = [];
  let currentRow = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentField += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      currentRow.push(currentField);
      currentField = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') i++;
      currentRow.push(currentField);
      currentField = '';
      if (currentRow.length > 1 || currentRow[0] !== '') rows.push(currentRow);
      currentRow = [];
    } else {
      currentField += char;
    }
  }
  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField);
    rows.push(currentRow);
  }

  // Convert to TSV string
  return rows.map(r => r.map(c => c.replace(/\t/g, ' ').replace(/\n/g, ' ')).join('\t')).join('\n');
}

async function runUpdate() {
  console.log('=== Launching Chrome to update Google Sheets live ===');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: "new",
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--window-size=1400,900'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });

  // Grant clipboard permissions via CDP
  const client = await page.target().createCDPSession();
  await client.send('Browser.grantPermissions', {
    permissions: ['clipboardReadWrite', 'clipboardSanitizedWrite'],
    origin: 'https://docs.google.com'
  });

  console.log('Opening Google Sheet...');
  await page.goto('https://docs.google.com/spreadsheets/d/1BF0Em2tRbmexI88f1vchZavzad1vp1JgImCJxdSUWxY/edit?gid=0#gid=0', {
    waitUntil: 'networkidle2',
    timeout: 35000
  });

  await new Promise(r => setTimeout(r, 4000));

  // --- STEP 1: Verify Sheet1 ---
  console.log('Step 1: Checking Sheet1...');
  await page.screenshot({ path: 'scripts/live_sheet1.png' });
  console.log('Screenshot of Sheet1 saved to scripts/live_sheet1.png');

  // --- STEP 2: Switch to Sheet2 ---
  console.log('Step 2: Switching to Sheet2 tab...');
  const clicked = await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('.docs-sheet-tab, .docs-sheet-tab-name'));
    for (const t of tabs) {
      if (t.innerText && t.innerText.trim() === 'Sheet2') {
        t.click();
        return true;
      }
    }
    return false;
  });
  console.log('Clicked Sheet2 tab:', clicked);

  // Wait 3 seconds for Sheet2 to load
  await new Promise(r => setTimeout(r, 3000));

  // Focus grid and go to A1
  console.log('Selecting cell A1 in Sheet2...');
  await page.keyboard.down('Control');
  await page.keyboard.press('Home');
  await page.keyboard.up('Control');
  await new Promise(r => setTimeout(r, 1000));

  // Prepare full Sheet2 TSV data
  const sheet2Csv = fs.readFileSync('scripts/sheet2_updated.csv', 'utf8');
  const sheet2Tsv = csvToTsv(sheet2Csv);
  console.log(`Sheet2 TSV prepared, length: ${sheet2Tsv.length} chars.`);

  // Write to clipboard
  await page.evaluate(async (text) => {
    await navigator.clipboard.writeText(text);
  }, sheet2Tsv);
  console.log('Wrote updated Sheet2 data to browser clipboard.');

  // Paste into Sheet2
  console.log('Pasting data into Sheet2 via Ctrl+V...');
  await page.keyboard.down('Control');
  await page.keyboard.press('KeyV');
  await page.keyboard.up('Control');

  // Wait 6 seconds for Google Sheets to process and save to drive
  console.log('Waiting 6 seconds for Google Sheets to save changes to Drive...');
  await new Promise(r => setTimeout(r, 6000));

  // Take screenshot of Sheet2
  await page.screenshot({ path: 'scripts/live_sheet2.png' });
  console.log('Screenshot of Sheet2 saved to scripts/live_sheet2.png');

  // Let's scroll down to check rows 33-34 in Sheet2
  console.log('Scrolling down in Sheet2 to verify rows 33-34...');
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press('PageDown');
    await new Promise(r => setTimeout(r, 500));
  }
  await page.screenshot({ path: 'scripts/live_sheet2_scrolled.png' });
  console.log('Screenshot of scrolled Sheet2 saved to scripts/live_sheet2_scrolled.png');

  await browser.close();
  console.log('=== All updates finished successfully ===');
}

runUpdate().catch(e => console.error('Error during update:', e));
