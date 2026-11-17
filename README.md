# graduate-me-frontend

React + Vite 기반의 로그인 전용 서비스 앱과 프론트엔드 API 계약을 관리합니다. 마케팅 랜딩은 별도 저장소에서 운영합니다. 서비스 앱의 목표 도메인은 `app.pleasegraduate.me`, 랜딩은 `pleasegraduate.me`입니다. DNS와 인증 공개 주소의 실제 전환은 별도 배포 작업입니다.

## 저장소 배치

```text
codding/
├── graduate-me-frontend/
└── graduate-me-backend/
```

각 저장소는 자신의 소스와 의존성만으로 설치하고 빌드합니다. 상대 저장소의 코드를 직접 import하지 않습니다. API 계약을 변경하면 양쪽의 타입, 검증, 사용처를 함께 확인합니다.

## 로컬 개발

백엔드 → 프론트엔드 순서로 실행합니다. 백엔드가 `graduate-me-app` 네트워크를 만들고 프론트엔드가 여기에 연결됩니다. 영상 분석은 백엔드 worker가 담당합니다. 실제 Gemini 호출과 worker 실행은 사용자가 명시적으로 요청한 경우에만 수행하며, 검증에는 모의 응답을 사용합니다.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

`pnpm dev`는 Docker Compose로 실행하며 파일 변경을 반영합니다. 환경변수는 Compose에서 주입합니다. 웹은 http://localhost:3000, API는 http://localhost:4000에서 접근합니다. 브라우저는 같은 출처의 `/api`를 사용하고, 개발 중에는 Vite가 `http://api:4000`으로 전달합니다. `ADMIN_APP_URL`은 Compose가 공개 환경변수 `VITE_ADMIN_APP_URL`로 전달합니다.

```sh
pnpm dev:logs
pnpm dev:down
```

## 검사

```sh
pnpm check
pnpm test
pnpm build
```

`pnpm check`는 포맷 적용, ESLint, 타입 검사를 순서대로 실행합니다. `pnpm build`는 타입 검사와 Vite 빌드로 `dist/`를 생성합니다. 운영 이미지는 Nginx가 정적 파일, `/api` 프록시, 직접 URL 진입의 fallback을 제공합니다. `/healthz`는 정적 서버의 상태만 확인합니다. 라우트 생성은 개발 플러그인과 `pnpm routes:generate`가 담당합니다.

## Git 이력과 기존 환경 전환

기존 `graduate-me/frontend`의 변경 이력을 `git subtree split`으로 추출했습니다. 파일 경로가 저장소 루트로 바뀌어 커밋 해시는 재작성되지만 해당 폴더의 변경 내용, 작성자, 커밋 메시지는 이어집니다. 기존 `graduate-me`는 원본 보관용이며, 이후 개발은 분리된 저장소에서 진행합니다. 원격 저장소는 별도로 연결해야 합니다.

기존 환경과 포트가 겹치므로 처음 전환할 때 기존 프로젝트에서 아래 명령으로 컨테이너를 내립니다. DB 볼륨은 유지됩니다.

```sh
docker compose -f compose.yaml -f compose.dev.yaml down
```

그다음 새 저장소를 위 순서대로 실행합니다. 백엔드는 기존 `graduate-me_postgres_data` 볼륨을 사용합니다. 새 DB로 시작하려면 백엔드 `.env`에 `POSTGRES_VOLUME_NAME`을 다른 이름으로 설정합니다. 같은 DB 볼륨으로 두 PostgreSQL 컨테이너를 동시에 실행하지 않습니다.

코드 배치 규칙은 [Architecture.md](Architecture.md), 작업 지침은 [AGENTS.md](AGENTS.md)를 따릅니다.

## 인증 전환 범위

로그인 화면은 `/login`, 학습 홈은 `/library`입니다. 기존 `/` 콜백 주소의 복귀 경로와 오류는 `/login`으로 전달합니다. 인증 상위 라우트의 `beforeLoad` 이후에 개인 데이터 조회를 시작하며, 실제 접근 권한은 백엔드가 검사합니다. 로그아웃·탈퇴 후 개인 캐시를 제거하고 학습 중 세션 만료는 기존 답안을 유지하는 재인증 안내로 처리합니다.

Resend SMTP를 통해 `noreply@pleasegraduate.me`에서 보낸 6자리 인증번호로 가입·로그인합니다. 가입은 학교 이메일(@hufs.ac.kr)만 허용하며 인증번호 확인이 끝나기 전에는 계정을 만들지 않습니다. Google 로그인과 CSRF 토큰 API 의존성은 제거했습니다. 10분 만료·60초 재발송 대기를 표시하며 실제 학교 주소, 시도 제한, 일회성 검증과 세션 발급은 백엔드가 강제합니다. SMTP 설정과 인증 테이블 마이그레이션은 백엔드 운영 안내를 따릅니다.

## 일반 사용자와 조교

조교도 같은 학교 이메일 로그인과 학습 화면을 사용합니다. 프로필·게시글·댓글에 조교 타이틀이 표시되고, 조교에게만 `나를 태그한 글` 메뉴가 추가됩니다. 커뮤니티 작성·수정에서 조교를 선택해 태그하고 댓글로 함께 답변합니다. 태그는 글의 공개 범위와 원본 접근 권한을 변경하지 않습니다.

기존 개인 질문은 이력으로 보존하고 새 질문은 커뮤니티에서 작성합니다. 원문 오류 신고는 운영자에게 별도로 전달합니다. 수업 개설·구성원·과제 관리도 이 앱에서 수행하며 수업 조교 역할과 커뮤니티 조교 타이틀은 별개입니다.

별도 운영 콘솔은 관리자 아이디·비밀번호를 사용하며 사용자 학교 인증 세션과 공유하지 않습니다.

## 앱별 CI/CD

`.github/workflows/check.yaml`은 PR과 `main` push에서 포맷·린트·타입·테스트·빌드와 로컬 Compose 구성을 검사합니다. 검사가 통과한 `main`은 infra의 재사용 workflow를 호출해 이 저장소의 Dockerfile로 `linux/amd64` 이미지를 만듭니다. Tailscale·SSH로 홈서버에 직접 전송한 뒤 `web`를 배포합니다. 이미지 저장소나 홈서버 빌드는 사용하지 않습니다.

학생 웹 배포는 자기 컨테이너만 교체하고 API·DB·다른 앱을 유지합니다.

연결 설정 후 저장소 Variable `DEPLOY_ENABLED=true`일 때 자동 배포합니다. 최초 연결 전에는 검사는 실행하고 배포만 생략합니다. PR 코드는 홈서버에서 실행하지 않습니다. 수동 재배포는 GitHub Actions에서 `main`을 선택해 실행합니다. 새 merge가 이미 있으면 오래된 커밋의 배포는 생략합니다.

Dockerfile은 이미지에 들어갈 환경·코드·기본 실행 명령을 관리하고, 로컬 Compose는 개발 실행을 담당합니다. 홈서버의 운영 환경변수·네트워크·이미지 버전·재시작 정책과 배포 절차는 [infra 운영 안내](https://github.com/please-graduate-me/graduate-me-infra#readme)를 따릅니다. infra의 새 설정은 수동으로 적용한 뒤에만 다음 앱 배포에서 사용합니다.
