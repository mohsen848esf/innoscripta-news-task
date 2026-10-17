FROM node:22.13.0-alpine AS build
WORKDIR /app
RUN npm install --global pnpm@11.25.0
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY index.html vite.config.ts tsconfig*.json ./
COPY src ./src
ARG VITE_NEWSAPI_API_KEY
ARG VITE_NEWSAPI_BASE_URL=https://newsapi.org/v2
ARG VITE_GUARDIAN_API_KEY
ARG VITE_GUARDIAN_BASE_URL=https://content.guardianapis.com
ARG VITE_NYT_API_KEY
ARG VITE_NYT_BASE_URL=https://api.nytimes.com/svc/search/v2
RUN pnpm build
FROM nginx:stable-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -q -O /dev/null http://127.0.0.1/ || exit 1
