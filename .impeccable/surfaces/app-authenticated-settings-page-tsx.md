---
version: 1
slug: 'app-authenticated-settings-page-tsx'
primary_target: 'app/(authenticated)/settings/page.tsx'
related_targets: ['app/(authenticated)/settings/_components/SettingsEditor.tsx']
---

# 학습 설정 A

- 모드: Operate. 장기 언어 듣기 학습자가 자신의 반복과 재생 환경을 조절한다.
- 승인: 사용자가 "A로 갈게"로 항목별 한 줄 배치를 선택했다. 기준 .impeccable/mocks/settings/a-selected.html과 specimen.css.
- 기존 세계: DESIGN.md의 백색, 청색, DM Sans/Noto Sans KR 유지. 설정 화면만 확장한다.
- 구성: 최대800px 본문, 제목34px(모바일28px), 4개 가로행. 행간 padding24px(모바일20px), select176px(모바일148px), 체크박스44×26px.
- 기능: 자동 미리듣기, 반복 간격1~10초, 추가 반복1~10회/null, 배속5단계. useLearningSettings의 즉시저장, 저장중잠금, 실패복구 유지. 서버 초기값/관리자조건 보존.
- 대비와 상태: 꺼진 체크박스 배경 #c6cfdf, 경계 #a5b4d0, 비활성 입력 배경 #f3f5f9는 승인 시안의 표면 전용 값이다. 상태표시는 성공/저장중/실패에 따라 구분한다.
- 제외: 시안 예시 안내, 공통 헤더/푸터 재설계, 공유 LearningOptions 변경, 신규설정/API 추가.
- 검증: 1440×900과390×900에 동일 초기값을 넣어 시안과 비교. 임시 하네스와 테스트 응답으로 저장/실패복구/키보드/관리자분기 확인, 하네스는 제거.
- 절차 기록: 비교 시안 생성 전에 concept-seed를 실행하지 않았다. 명시적 면제 근거가 없는 절차 누락이며, 사후 seed를 만들어 원래 설계 근거로 주장하지 않는다. 사용자가 승인한 A HTML을 구현 기준으로 보존했고, 승인 화면과 실제 구현의 일치 및 기능 검증은 별도로 수행했다.
