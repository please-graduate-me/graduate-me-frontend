---
version: 1
slug: 'app-authenticated-share-id-page-tsx'
primary_target: 'app/(authenticated)/share/[id]/page.tsx'
related_targets: ['app/(authenticated)/share/[id]/_components/SharedEntry.tsx']
---

# 공유 진입 B

- 모드: Operate. 공유받은 영상이나 구절을 확인하고 자신의 학습으로 이어간다.
- 결정: 사용자가 추천에 위임했고 B를 채택했다. 제목, 영상, 시작 버튼의 세로 흐름은 향후 공유 기능 변경에도 쉽게 조정할 수 있다.
- 근거: .impeccable/mocks/share/b.html, b-segment.html, specimen.css. seed:ea1676a25e7b072c, B는 후보1이다.
- 기존 세계: PRODUCT.md/DESIGN.md의 백색·청색, DM Sans/Noto Sans KR과 공통 헤더 유지.
- 구성: 최대960px, 위여백28px, 간격24px, 제목28px, 16:9 영상. 시작 버튼은 영상 아래 오른쪽. 800px 이하 위여백24px, 간격20px, 제목23px, 버튼전체폭.
- 기능: 로그인 필수, 실제 공유조회, 404처리, 영상/구절범위, 방문ID재사용과 집계, 학습시작과 실패복구 유지. API와 링크생성 UI 변경 없음.
- 검증: 영상과구절 각1440×900 및390×900 비교. 임시하네스에 실제컴포넌트와 테스트응답을 사용해 요청·중복방지·재시도·모바일을 확인하고 하네스를 제거한다.
