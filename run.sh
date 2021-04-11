#!/bin/bash
docker run -i --init --rm --cap-add=SYS_ADMIN \
   --name puppeteer-chrome meterconnex-reporter \
   node -e "`cat index.js`"