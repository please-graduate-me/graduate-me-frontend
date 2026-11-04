---
version: 1
slug: 'app-authenticated-library-page-tsx'
primary_target: 'app/(authenticated)/library/page.tsx'
related_targets:
  [
    'app/(authenticated)/library/_components/Dashboard.tsx',
    'app/(authenticated)/library/_components/MyVideos.tsx',
  ]
---

# 내 영상 목록 A

- 모드: Operate. PC 키보드 60%, 모바일 40%의 장기 언어 듣기 학습자가 저장한 영상을 찾아 이어서 학습한다.
- 승인: 사용자가 2026-11-04 "A로 갈게"로 선택했다. 기준은 .impeccable/mocks/library/a.html이다.
- 확정 배치: PC 목록 왼쪽, 320px 보조 열에 영상 추가와 추천. 열 간격 40px. 모바일 800px 이하에서는 목록, 추가, 추천 순서.
- 본문: 기존 흰색, 청색 디자인 토큰과 DM Sans/Noto Sans KR 유지. 제목 36px(모바일 28px), 본문 15px, 보조 13px.
- 기능: 제목 검색, 카테고리, 정렬, 표시 필터, 관심 토글, 제거 확인, 등록, 추천 필터. API 계약 및 인증 경계 유지.
- 비교 범위: 실제 공통 헤더 유지. 시안 전용 안내 띠와 상태 예시는 제외. 가짜 통계, 썸네일, 새 API는 추가하지 않는다.
- 검증: 동일 예시 데이터로 1440×900과 390×900에서 시안과 실제 컴포넌트 비교. 임시 렌더 하네스는 검증 후 삭제한다.
