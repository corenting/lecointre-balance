const puppeteer = require('puppeteer');

require('dotenv').config();

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

  const text = await page.$eval('input#A24', elt => elt.value);
  console.log(text);

  await browser.close();
})();
