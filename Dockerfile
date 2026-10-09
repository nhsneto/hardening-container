FROM node:24.21.0-alpine

ENV NODE_ENV=production

WORKDIR /app

COPY --chown=node:node app/package.json app/package-lock.json .

RUN npm ci --omit=dev && npm cache clean --force

COPY --chown=node:node app/server.js .

USER node

EXPOSE 3000

CMD ["node", "server.js"]
