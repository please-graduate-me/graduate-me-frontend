---
version: 1
slug: 'app-authenticated-learn-id-components-study-tsx'
primary_target: 'app/(authenticated)/learn/[id]/_components/Study.tsx'
related_targets:
  [
    'app/(authenticated)/learn/[id]/_components/Study.css.ts',
    'app/_components/DemoStudy.tsx',
    'app/_components/DemoStudy.css.ts',
  ]
---

# 학습 화면 구현 방향

대상: 홈 DemoStudy와 로그인 후 Study. 구현 경로: code-led, 사용자 승인 HTML F 시안.

모드: Operate. 사용자 승인 E 색상과 F 확대 영상. 구현 승인 완료.

## Direction contract

THESIS: 실제 영상과 직접 입력하는 답안을 나란히 연결한다. 사용자가 승인한 왼쪽 답안과 오른쪽 큰 영상을 유지한다. OWN-WORLD: 백색 바탕, #24314b 본문, #254fca 강조, #d5def1 구분선. 입력은 옅은 청색 면과 14px 모서리, 보조 동작은 얇은 테두리. STORY: 한 구절을 듣고 입력하고 확인한 뒤 안 들린 부분을 반복한다. 공유와 설정은 이 흐름을 가리지 않는다. FIRST VIEWPORT: 제목과 저장 상태 아래 좌우 1.05:1 작업 영역, 오른쪽 16:9 영상. 왼쪽 큰 입력창과 오른쪽 정렬 확인 버튼. 모바일에서는 영상 다음 답안, 입력 중 영상을 접고 재생 조작을 유지한다. FORM: 사용자 선택 E와 수정 F. seed:7abae99c75935758. 사용자 스크린샷과 f.html이 우선한다. FINISH: 독립 검토와 실제 구현에 맞춘 DESIGN.md 및 sidecar를 기록하고 코드 검사, 테스트, 빌드를 완료한다.
