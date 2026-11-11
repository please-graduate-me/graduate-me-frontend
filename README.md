# graduate-me-frontend

Next.js 웹 화면과 프론트엔드 API 계약을 관리합니다.

## 저장소 배치

```text
codding/
├── graduate-me-frontend/
└── graduate-me-backend/
```

각 저장소는 자신의 소스와 의존성만으로 설치하고 빌드합니다. 상대 저장소의 코드를 직접 import하지 않습니다. API 계약을 변경하면 양쪽의 타입, 검증, 사용처를 함께 확인합니다.

## 로컬 개발

백엔드 → 프론트엔드 순서로 실행합니다. 백엔드가 `graduate-me-app` 네트워크를 만들고 프론트엔드가 여기에 연결됩니다. 영상 분석은 백엔드 worker가 Gemini API를 직접 호출합니다.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

`pnpm dev`는 Docker Compose로 실행하며 파일 변경을 반영합니다. 환경변수는 Compose에서 주입합니다. 웹은 http://localhost:3000, API는 http://localhost:4000에서 접근합니다. 프론트 컨테이너의 `API_INTERNAL_URL`은 `http://api:4000`입니다.

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

`pnpm check`는 포맷 적용, ESLint, 타입 검사를 순서대로 실행합니다. `pnpm build`는 이 저장소만 빌드합니다.

## Git 이력과 기존 환경 전환

기존 `graduate-me/frontend`의 변경 이력을 `git subtree split`으로 추출했습니다. 파일 경로가 저장소 루트로 바뀌어 커밋 해시는 재작성되지만 해당 폴더의 변경 내용, 작성자, 커밋 메시지는 이어집니다. 기존 `graduate-me`는 원본 보관용이며, 이후 개발은 분리된 저장소에서 진행합니다. 원격 저장소는 별도로 연결해야 합니다.

기존 환경과 포트가 겹치므로 처음 전환할 때 기존 프로젝트에서 아래 명령으로 컨테이너를 내립니다. DB 볼륨은 유지됩니다.

```sh
docker compose -f compose.yaml -f compose.dev.yaml down
```

그다음 새 저장소를 위 순서대로 실행합니다. 백엔드는 기존 `graduate-me_postgres_data` 볼륨을 사용합니다. 새 DB로 시작하려면 백엔드 `.env`에 `POSTGRES_VOLUME_NAME`을 다른 이름으로 설정합니다. 같은 DB 볼륨으로 두 PostgreSQL 컨테이너를 동시에 실행하지 않습니다.

코드 배치 규칙은 [Architecture.md](Architecture.md), 작업 지침은 [AGENTS.md](AGENTS.md)를 따릅니다.

## 일반 사용자와 조교

조교도 같은 Google 로그인과 학습 화면을 사용합니다. 프로필·게시글·댓글에 조교 타이틀이 표시되고, 조교에게만 `나를 태그한 글` 메뉴가 추가됩니다. 커뮤니티 작성·수정에서 조교를 선택해 태그하고 댓글로 함께 답변합니다. 태그는 글의 공개 범위와 원본 접근 권한을 변경하지 않습니다.

기존 개인 질문은 이력으로 보존하고 새 질문은 커뮤니티에서 작성합니다. 원문 오류 신고는 운영자에게 별도로 전달합니다. 수업 개설·구성원·과제 관리도 이 앱에서 수행하며 수업 조교 역할과 커뮤니티 조교 타이틀은 별개입니다.

별도 운영 콘솔은 관리자 아이디·비밀번호를 사용하며 사용자 Google 세션과 공유하지 않습니다.
