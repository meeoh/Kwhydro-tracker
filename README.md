# Kwhydro-tracker

Script to read the percentage change from provident meterconnex's website. Currently messages the result over telegram via the telegram adapter. Any other adapters should implement the sendMessage method, then can be swapped out easily in `index.js`. The default implementation simply changes the period of time to day and reads the percentage increase/decrease compared to the previous day.

## Setup

Set the appropriate environment variables in the `.env`.
```
# kwhydro login info
LOGIN=
PASSWORD=

# vars for telegram adapter
TELEGRAM_TOKEN=
CHAT_ID=

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

