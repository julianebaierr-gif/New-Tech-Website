const puppeteer = require('puppeteer-core');

async function capture() {
  console.log('Launching browser to capture screenshots...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1400,1000']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 1000 });

  // 1. About Page Authors Section
  console.log('Visiting /about...');
  await page.goto('http://localhost:3000/about', { waitUntil: 'networkidle2' });
  await page.evaluate(() => window.scrollTo(0, 1400));
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'scripts/about_page_authors.png' });
  console.log('Saved scripts/about_page_authors.png');

  // 2. Evan Mitchell Profile
  console.log('Visiting /authors/evan-mitchell...');
  await page.goto('http://localhost:3000/authors/evan-mitchell', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: 'scripts/author_evan_mitchell.png' });
  console.log('Saved scripts/author_evan_mitchell.png');

  // 3. Sarah Blake Profile
  console.log('Visiting /authors/sarah-blake...');
  await page.goto('http://localhost:3000/authors/sarah-blake', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: 'scripts/author_sarah_blake.png' });
  console.log('Saved scripts/author_sarah_blake.png');

  await browser.close();
  console.log('All screenshots captured successfully!');
}

capture().catch(e => console.error(e));
