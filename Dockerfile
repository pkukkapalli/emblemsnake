FROM node:current-slim

WORKDIR /usr/src/app

COPY package*.json ./

RUN apt-get update && apt-get install -y \
  build-essential \
  libcairo2-dev \
  libpango1.0-dev \
  libjpeg-dev \
  libgif-dev \
  librsvg2-dev

RUN npm install

COPY assets assets
COPY drawserver drawserver

EXPOSE 8080

CMD ["node", "drawserver/server.js"]
