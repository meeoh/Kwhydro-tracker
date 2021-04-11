require("dotenv").config({ path: `${__dirname}/.env` });

const puppeteer = require("puppeteer");

const {
  LOGIN: login,
  PASSWORD: password,
  CHROME_PATH: chromePath,
  RASPBIAN,
} = process.env;

const required = ["LOGIN", "PASSWORD"];
if (!login || !password) {
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

(async () => {
  const browser = RASPBIAN
    ? await puppeteer.launch({ executablePath: "/usr/bin/chromium-browser" })
    : await puppeteer.launch({ headless: false });
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
      `Electricity usage on ${text[0]} cost ${text[2]} (${text[1]})`
    );

    // await page
    //   .waitForSelector("#ctl01_MasterContentPlaceHolder1_lblChangeNumber")
    //   .then(async (el) => {
    //     const percentage = await page.evaluate(
    //       (element) => element.textContent,
    //       el
    //     );
    //     const changeTypeElm = await page.$(
    //       "#ctl01_MasterContentPlaceHolder1_lblChangeDirection"
    //     );
    //     const changeType = await page.evaluate(
    //       (element) => element.textContent,
    //       changeTypeElm
    //     );
    //     messenger.sendMessage(
    //       `Electricity usage ${changeType.toLowerCase()} ${percentage} compared to the day before.`
    //     );
    //   });
    // await browser.close();
  } catch (e) {}
})();
