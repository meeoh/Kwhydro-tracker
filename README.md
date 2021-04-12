# Kwhydro-tracker

Script to read the amount of hydro used in the past day on https://www.kwhydro.on.ca/en/index.asp. Currently messages the result over discord via the discord adapter. Any other adapters should implement the sendMessage method, then can be swapped out easily in `index.js`.

In order to setup a discord bot, follow: https://discordjs.guide/preparations/setting-up-a-bot-application.html. Make sure you are and the bot have a shared server or else it wont be able to DM you!

## Setup

Set the appropriate environment variables in the `.env`.

```
# kwhydro login info
LOGINS='first_login,second_login'
PASSWORDS='first_pass,second_pass'

# vars for telegram adapter
TELEGRAM_TOKEN=
CHAT_IDS='first_chatid,second_chatid'

```

## Running

Then run `npm i` or `./build.sh` for a dockerized setup. Create a cronjob to either run `node index.js` or the `run.sh` script periodically

## Running on raspbian (no docker)

Set `RASPBIAN=true` in the `.env` file and run the following

```
sudo apt install chromium-browser chromium-codecs-ffmpeg
npm i
```

Then simply run `node index.js`

![image](https://user-images.githubusercontent.com/5509365/114325066-1504bc00-9afc-11eb-9c71-a3bfef3b0afb.png)
