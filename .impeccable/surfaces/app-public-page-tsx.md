---
version: 1
slug: 'app-public-page-tsx'
primary_target: 'app/(public)/page.tsx'
related_targets: ['app/_components/DemoStudy.tsx']
---

# 홈 B

- 모드: Persuade. 소개를 짧게 읽고 바로 반복 듣기와 받아쓰기를 체험한 뒤 개인 학습으로 이어간다.
- 승인: 사용자가 B안을 선택했고 영상 탐색 영역, 체험 상단 제목·설명·듣기 연습 문구를 제거하도록 요청했다.
- 비교 기준: .impeccable/mocks/home/b-selected.html. 기존 DESIGN.md의 흰색·청색, DM Sans/Noto Sans KR, 입력 왼쪽·큰 영상 오른쪽 학습 구성 유지.
- 구성: 32px 소개 제목, 체험, 로그인 영역. 체험 위 여백 24px. 로그인 영역 위아래 경계선, 패딩 28px, 위 여백 40px. 모바일 로그인 세로 배치.
- 문구: 기록 미저장 안내는 답안 아래 한 번만 표시한다. 재생 중·버퍼링 상태는 플레이어 옆에 필요할 때만 표시한다.
- 범위: 홈과 DemoStudy의 중복 안내만 수정한다. 영상 탐색, 새 API, 개인 학습 화면 변경은 제외한다. 인증 분기·실패 복구·체험 채점·모바일 입력 포커스 동작 유지.
- 검증: PC 1440×900과 모바일 390×900에서 선택 시안과 실제 화면 비교. 실제 체험 데이터와 플레이어를 사용하고 오류·빈 자료·인증 분기는 테스트 응답으로 별도 확인한다.
