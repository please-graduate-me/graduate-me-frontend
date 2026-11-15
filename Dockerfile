# Node.js 22와 Debian 기반의 실행 환경을 준비한다.
FROM node:22-bookworm-slim
# 저장소에서 정한 pnpm 버전을 사용한다.
RUN corepack enable && corepack prepare pnpm@10.33.0 --activate
# 이후 명령을 실행할 컨테이너 내부 디렉터리를 정한다.
WORKDIR /app
# 코드 변경 시 의존성 설치 결과를 재사용하도록 목록부터 복사한다.
COPY package.json pnpm-lock.yaml ./
# 잠금 파일에 기록된 버전 그대로 의존성을 설치한다.
RUN pnpm install --frozen-lockfile
# .dockerignore에서 제외한 비밀 파일과 로컬 산출물을 빼고 코드를 복사한다.
COPY . .
# API 프록시 주소는 빌드에도 반영되므로 GitHub 배포에서 운영 내부 주소를 전달한다.
ARG API_INTERNAL_URL=http://api:4000
# Next.js 빌드가 사용할 API 주소를 환경변수로 전달한다.
ENV API_INTERNAL_URL=$API_INTERNAL_URL
# Next.js 사용 통계 전송을 비활성화한다.
ENV NEXT_TELEMETRY_DISABLED=1
# Next.js 배포용 페이지와 서버 코드를 빌드한다.
RUN pnpm build
# 내부 포트를 표시하며 홈서버의 외부 연결은 infra에서 설정한다.
EXPOSE 3000
# 컨테이너를 시작하면 Next.js 운영 서버를 실행한다.
CMD ["pnpm", "start"]
