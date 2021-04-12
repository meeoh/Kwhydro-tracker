require("dotenv").config({ path: `${__dirname}/.env` });
const { TELEGRAM_TOKEN: telegramToken, CHAT_IDS: chatIdsEnvVar } = process.env;
const required = ["TELEGRAM_TOKEN", "CHAT_IDS"];
if (!telegramToken || !chatIdsEnvVar) {
  const missing = [];
  required.forEach((k) => (!process.env[k] ? missing.push(k) : null));
  console.log(`Missing ${missing.join(", ")}`);
  process.exit();
}

const chatIds = chatIdsEnvVar.split(",");

function sendMessage(msg, index) {
  const TelegramBot = require("node-telegram-bot-api");
  const bot = new TelegramBot(telegramToken, { polling: false });

  if (!chatIds[index]) {
    console.log("chat id does not exist");
    process.exit();
  }
  bot.sendMessage(chatIds[index], msg);
}

module.exports.sendMessage = sendMessage;
