# 빌드와 실행을 분리해 운영에는 정적 파일만 제공한다.
FROM node:22-bookworm-slim AS build
RUN corepack enable && corepack prepare pnpm@10.33.0 --activate
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
ARG VITE_ADMIN_APP_URL
ENV VITE_ADMIN_APP_URL=$VITE_ADMIN_APP_URL
RUN pnpm build
FROM nginx:alpine
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html
ENV API_INTERNAL_URL=http://api:4000
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
