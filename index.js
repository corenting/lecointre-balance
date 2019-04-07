const puppeteer = require('puppeteer');
const fetch = require('node-fetch');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  page.setViewport({ width: 1920, height: 1080 });
  await page.goto('https://7-11h.lecointreparis.com/Lp');

  await Promise.all([
    page.click('td#tzA33'),
    page.waitForNavigation(),
  ]);

  await page.type('input#A3', process.env.USERNAME);
  await page.type('input#A4', process.env.PASSWORD);
  await Promise.all([
    page.click('span#z_A7_IMG'),
    page.waitForNavigation(),
  ]);

  await Promise.all([
    page.click('a#M32'),
    page.waitForNavigation(),
  ]);

  await Promise.all([
    page.click('a#A2'),
    page.waitForNavigation(),
  ]);

  const balance = await page.$eval('input#A24', elt => elt.value);

  // Send to telegram
  await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_KEY}/sendMessage`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: process.env.TELEGRAM_USER,
      disable_web_page_preview: true,
      parse_mode: 'markdown',
      text: `*Lecointre*
      Balance: ${balance}`,
    }),
  });

  await browser.close();
})();