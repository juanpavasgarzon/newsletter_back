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

RUN addgroup -g 1001 app && \
  adduser -D -u 1001 -G app app

RUN mkdir -p /app/data && chown -R app:app /app/data

COPY --chown=app:app package.json package-lock.json ./

COPY --from=builder --chown=app:app /app/dist ./dist
COPY --from=builder --chown=app:app /app/node_modules ./node_modules

COPY --chown=app:app config ./config

ENV NODE_ENV=production

USER app

EXPOSE 8000

CMD ["node", "dist/main.js"]
