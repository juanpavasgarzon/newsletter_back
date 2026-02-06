FROM node:22.18.0-bookworm AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npm run build

RUN npm prune --production

FROM node:22.18.0-bookworm-slim AS production

WORKDIR /app

RUN groupadd --gid 1000 app && \
    useradd --uid 1000 --gid app --shell /bin/false --create-home app

COPY --chown=app:app package.json package-lock.json ./

COPY --from=builder --chown=app:app /app/dist ./dist
COPY --from=builder --chown=app:app /app/node_modules ./node_modules

COPY --chown=app:app config ./config

ENV NODE_ENV=production

USER app

EXPOSE 3001

CMD ["node", "dist/main.js"]
