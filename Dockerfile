FROM node:lts as base

RUN apt-get update -y
RUN apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev libfontconfig-dev -y

WORKDIR /

COPY package*.json ./

RUN npm i

COPY . .

EXPOSE 3000

ENV NODE_PATH = ./dist

RUN npm run build

CMD ["npm", "run", "start:prod"]
