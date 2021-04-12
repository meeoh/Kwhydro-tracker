require("dotenv").config({ path: `${__dirname}/.env` });
const {
  DISCORD_TOKEN: discordToken,
  DISCORD_IDS: discordIdsEnvVar,
} = process.env;

const required = ["DISCORD_TOKEN", "DISCORD_IDS"];
if (!discordToken || !discordIdsEnvVar) {
  const missing = [];
  required.forEach((k) => (!process.env[k] ? missing.push(k) : null));
  console.log(`Missing ${missing.join(", ")}`);
  process.exit();
}

const discordIds = discordIdsEnvVar.split(",");
const Discord = require("discord.js");

function sendMessage(msg, index) {
  const client = new Discord.Client();
  client.login(discordToken);

  client.once("ready", async () => {
    const user = await client.users.fetch(discordIds[index], false);
    await user.send(msg);
    client.destroy();
  });
}

module.exports.sendMessage = sendMessage;
