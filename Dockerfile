# Multi-stage build for production
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production --legacy-peer-deps

FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps
COPY . .

# Build-time variables
ARG APP_BUILD_ID
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_S3_URL
ARG NEXT_PUBLIC_BRAND_DOMAIN
ENV APP_BUILD_ID=$APP_BUILD_ID
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_S3_URL=$NEXT_PUBLIC_S3_URL
ENV NEXT_PUBLIC_BRAND_DOMAIN=$NEXT_PUBLIC_BRAND_DOMAIN

RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
