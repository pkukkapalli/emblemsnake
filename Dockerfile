FROM node:current-slim

WORKDIR /usr/src/app

COPY package.json .
COPY assets assets
COPY drawserver drawserver

RUN apt-get update && apt-get install -y \
  build-essential \
  libcairo2-dev \
  libpango1.0-dev \
  libjpeg-dev \
  libgif-dev \
  librsvg2-dev

RUN npm install

EXPOSE 8080

CMD ["node", "drawserver/server.js"]
