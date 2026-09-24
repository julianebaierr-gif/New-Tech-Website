const puppeteer = require('puppeteer-core');

async function checkTabs() {
  console.log('Launching Chrome...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,800']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  console.log('Navigating to Google Sheet...');
  await page.goto('https://docs.google.com/spreadsheets/d/1BF0Em2tRbmexI88f1vchZavzad1vp1JgImCJxdSUWxY/edit?gid=0#gid=0', {
    waitUntil: 'networkidle2',
    timeout: 30000
  });

  await new Promise(r => setTimeout(r, 4000));

  // Find sheet tab elements
  const tabs = await page.evaluate(() => {
    // Sheet tabs typically have class docs-sheet-tab or docs-sheet-tab-name
    const elements = Array.from(document.querySelectorAll('.docs-sheet-tab, .docs-sheet-tab-name, [role="tab"]'));
    return elements.map(el => ({
      text: el.innerText,
      className: el.className,
      ariaSelected: el.getAttribute('aria-selected')
    }));
  });
  console.log('Found sheet tabs:', tabs);

  await browser.close();
}

checkTabs().catch(e => console.error(e));
