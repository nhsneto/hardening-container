FROM node:24.21.0-alpine

WORKDIR /app

COPY --chown=node:node app/package.json .

RUN npm install

COPY --chown=node:node app/server.js .

USER node

EXPOSE 3000

CMD ["node", "server.js"]
