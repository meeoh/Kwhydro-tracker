require("dotenv").config({ path: `${__dirname}/.env` });
const { TELEGRAM_TOKEN: telegramToken, CHAT_ID: chatId } = process.env;
const required = ["TELEGRAM_TOKEN", "CHAT_ID"];
if (!telegramToken || !chatId) {
  const missing = [];
  required.forEach((k) => (!process.env[k] ? missing.push(k) : null));
  console.log(`Missing ${missing.join(", ")}`);
  process.exit();
}

function sendMessage(msg) {
  const TelegramBot = require("node-telegram-bot-api");
  const bot = new TelegramBot(telegramToken, { polling: false });
  bot.sendMessage(chatId, msg);
}

module.exports.sendMessage = sendMessage;
