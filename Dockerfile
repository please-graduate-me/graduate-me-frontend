FROM node:22-bookworm-slim
RUN corepack enable && corepack prepare pnpm@10.33.0 --activate
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/
RUN pnpm install --frozen-lockfile --filter @graduate-me/web... --ignore-scripts
COPY . .
ARG API_INTERNAL_URL=http://api:4000
ENV API_INTERNAL_URL=$API_INTERNAL_URL
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm --filter @graduate-me/web build
EXPOSE 3000
CMD ["pnpm", "--filter", "@graduate-me/web", "start"]
