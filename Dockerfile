FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npm run build

RUN npm prune --production

FROM node:22-alpine AS production

WORKDIR /app

RUN apk add --no-cache sqlite

RUN mkdir -p /app/data && chown -R node:node /app

COPY --chown=node:node package.json package-lock.json ./

COPY --from=builder --chown=node:node /app/dist ./dist
COPY --from=builder --chown=node:node /app/node_modules ./node_modules

COPY --chown=node:node config ./config

ENV NODE_ENV=production

USER node

EXPOSE 8000

ENTRYPOINT ["./entrypoint.sh"]
CMD ["node", "dist/main.js"]
