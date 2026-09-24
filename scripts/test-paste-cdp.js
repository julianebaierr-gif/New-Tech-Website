const puppeteer = require('puppeteer-core');
const fs = require('fs');

async function testPasteCDP() {
  console.log('Launching Chrome...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: "new",
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--window-size=1280,800'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  // Grant clipboard permissions via CDP
  const client = await page.target().createCDPSession();
  await client.send('Browser.grantPermissions', {
    permissions: ['clipboardReadWrite', 'clipboardSanitizedWrite'],
    origin: 'https://docs.google.com'
  });

  console.log('Navigating to Google Sheet...');
  await page.goto('https://docs.google.com/spreadsheets/d/1BF0Em2tRbmexI88f1vchZavzad1vp1JgImCJxdSUWxY/edit?gid=0#gid=0', {
    waitUntil: 'networkidle2',
    timeout: 30000
  });

  await new Promise(r => setTimeout(r, 4000));

  // Check what element has focus
  const activeTag = await page.evaluate(() => {
    return {
      tagName: document.activeElement ? document.activeElement.tagName : 'none',
      className: document.activeElement ? document.activeElement.className : '',
      id: document.activeElement ? document.activeElement.id : ''
    };
  });
  console.log('Active element:', activeTag);

  // Press ArrowDown to select A2
  await page.keyboard.press('ArrowDown');
  await new Promise(r => setTimeout(r, 1000));

  // Prepare TSV data for the 9 rows:
  const sheet1Data = fs.readFileSync('scripts/sheet1_data.csv', 'utf8');
  const lines = sheet1Data.split('\r\n').filter(Boolean);
  const tsvRows = [];
  for (let i = 1; i < lines.length; i++) {
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

  console.log('Attempting clipboard write...');
  try {
    await page.evaluate(async (text) => {
      await navigator.clipboard.writeText(text);
    }, tsvContent);
    console.log('navigator.clipboard.writeText SUCCESS!');
    
    // Press Ctrl+V
    await page.keyboard.down('Control');
    await page.keyboard.press('KeyV');
    await page.keyboard.up('Control');
    console.log('Dispatched Ctrl+V');
  } catch (err) {
    console.log('Clipboard write failed:', err.message);
    
    // Try dispatching paste event
    console.log('Trying dispatching ClipboardEvent on activeElement and document...');
    const dispatched = await page.evaluate((text) => {
      const target = document.activeElement || document.body;
      const dt = new DataTransfer();
      dt.setData('text/plain', text);
      const pasteEvent = new ClipboardEvent('paste', {
        bubbles: true,
        cancelable: true,
        clipboardData: dt
      });
      return target.dispatchEvent(pasteEvent);
    }, tsvContent);
    console.log('Dispatched paste event result:', dispatched);
  }

  // Wait 5 seconds to observe
  await new Promise(r => setTimeout(r, 5000));

  await page.screenshot({ path: 'scripts/sheet1_after_cdp_paste.png' });
  console.log('Screenshot saved to scripts/sheet1_after_cdp_paste.png');

  await browser.close();
  console.log('Done.');
}

testPasteCDP().catch(e => console.error(e));
