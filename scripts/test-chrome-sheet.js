const puppeteer = require('puppeteer-core');

async function test() {
  console.log('Launching Chrome...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  console.log('Navigating to Google Sheet...');
  await page.goto('https://docs.google.com/spreadsheets/d/1BF0Em2tRbmexI88f1vchZavzad1vp1JgImCJxdSUWxY/edit?gid=0#gid=0', {
    waitUntil: 'networkidle2',
    timeout: 30000
  });

  console.log('Page Title:', await page.title());
  await page.screenshot({ path: 'scripts/sheet_screenshot.png' });
  console.log('Screenshot saved to scripts/sheet_screenshot.png');

  await browser.close();
  console.log('Done.');
}

test().catch(e => console.error('Error:', e));
