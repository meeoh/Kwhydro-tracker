require("dotenv").config({ path: `${__dirname}/.env` });

const puppeteer = require("puppeteer");

const {
  LOGINS: loginsEnvVar,
  PASSWORDS: passwordsEnvVar,
  CHROME_PATH: chromePath,
  CHAT_IDS: chatIdsEnvVar,
  RASPBIAN,
} = process.env;

const required = ["LOGINS", "PASSWORDS", "CHAT_IDS"];
if (!loginsEnvVar || !passwordsEnvVar || !chatIdsEnvVar) {
  const missing = [];
  required.forEach((k) => (!process.env[k] ? missing.push(k) : null));
  console.log(`Missing ${missing.join(", ")}`);
  process.exit();
}

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

const messenger = require("./telegram_adapter");

const logins = loginsEnvVar.split(",");
const passwords = passwordsEnvVar.split(",");
const chatIds = chatIdsEnvVar.split(",");

if (logins.length !== passwords.length || logins.length !== chatIds.length) {
  console.log(
    "Logins, passwords, and chat ids env vars need to be arrays of same length"
  );
  process.exit();
}

(async () => {
  for (var i = 0; i < logins.length; i++) {
    const login = logins[i].trim();
    const password = passwords[i].trim();
    const chatId = chatIds[i].trim();

    const browser = RASPBIAN
      ? await puppeteer.launch({ executablePath: "/usr/bin/chromium-browser" })
      : await puppeteer.launch({});
    const page = await browser.newPage();

    try {
      await page.goto("https://www3.kwhydro.on.ca/app/login.jsp");
      await page.waitForSelector("#accessCode").then(async () => {
        await page.focus("#accessCode");
        await page.keyboard.type(login);
      });
      await page.waitForSelector("#password").then(async () => {
        await page.focus("#password");
        await page.keyboard.type(password);
        await page.keyboard.press("Enter");
      });
      await delay(3000);

      await page.goto(
        "https://www3.kwhydro.on.ca/app/capricorn?para=smartMeterConsumInqV2&inquiryType=hydro&tab=SMCONSUM"
      );

      await delay(3000);

      await page.hover(
        ".highcharts-series-group > .highcharts-series-0 > rect:nth-last-child(2)"
      );

      const text = [];
      await page.waitForSelector(".highcharts-tooltip tspan").then(async () => {
        elements = await page.$$(".highcharts-tooltip tspan");
        for (var i = 0; i < elements.length; i++) {
          text.push(
            await page.evaluate((element) => element.textContent, elements[i])
          );
        }
      });

      messenger.sendMessage(
        `Electricity usage on ${text[0]} cost ${text[2]} (${text[1]})`,
        chatId
      );
    } catch (e) {
    } finally {
      await browser.close();
    }
  }
})();
