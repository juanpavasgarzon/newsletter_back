FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npm run build

RUN npm prune --production

FROM node:22-alpine AS production

WORKDIR /app

COPY package.json package-lock.json ./

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

COPY config ./config

ENV NODE_ENV=production

EXPOSE 8000

CMD ["node", "dist/main.js"]
