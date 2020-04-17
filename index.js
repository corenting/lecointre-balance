const puppeteer = require('puppeteer');
const fetch = require('node-fetch');

async function sendNotification(balanceText) {
  // Send to telegram
  console.log('Sending balance to Telegram');
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
      text: `*Lecointre*\nBalance: ${balanceText}`,
    }),
  });
}

async function check() {
  console.log('Launching puppeteer');
  const browser = await puppeteer.launch({ executablePath: 'google-chrome-unstable' });
  const page = await browser.newPage();

  console.log('Loading website');
  page.setViewport({ width: 1920, height: 1080 });
  await page.goto('https://7-11h.lecointreparis.com/Lp');

  console.log('Clicking on login');
  await Promise.all([
    page.click('td#tzA33'),
    page.waitForNavigation(),
  ]);

  console.log('Filling login informations');
  await page.type('input#A3', process.env.LC_USERNAME);
  await page.type('input#A4', process.env.LC_PASSWORD);

  console.log('Submitting login form');
  await Promise.all([
    page.click('span#z_A7_IMG'),
    page.waitForNavigation(),
  ]);

  console.log('Going to customer area');
  await Promise.all([
    page.click('a#M32'),
    page.waitForNavigation(),
  ]);

  console.log('Going to transactions history');
  await Promise.all([
    page.click('a#A2'),
    page.waitForNavigation(),
  ]);

  console.log('Getting balance');
  const balanceString = await page.$eval('input#A24', (elt) => elt.value);
  const balance = parseFloat(balanceString.replace(',', '.'));

  // Exit early if balance is more than 25€
  if (balance > 25) {
    console.log(`Balance at ${balanceString}, not sending notification`);
    await browser.close();
    return;
  }

  sendNotification(balanceString);
  await browser.close();
}

async function main() {
  // Check if it's a week day
  const dayOfTheWeek = (new Date()).getDay();
  if (dayOfTheWeek === 0 || dayOfTheWeek === 6) {
    console.log('Weekend day, not executing');
    return;
  }

  // Run the check function with 3 tries
  let count = 0;
  const maxTries = 3;
  while (true) {
    try {
      console.log(`Try ${count + 1}/${maxTries}`);
      await check();
      break;
    } catch (err) {
      console.log(err);
      count += 1;
      if (count === maxTries) throw err;
    }
  }
}

(async () => {
  try {
    await main();
  } catch (error) {
    console.error(error);
  }
})();
