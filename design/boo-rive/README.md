# 부 Rive 2D

공식 부 벡터 원본을 부품으로 분리하고, 웹에서 호출하는 상태 머신을 제작했다. 정지 PNG 전체를 흔드는 방식 대신 눈, 표정, 날개, 몸통을 각각 움직인다.

## 사용

```tsx
<BooMascot
  reaction='levelUp'
  eventId={receipt.id}
  size={128}
/>
```

동일한 사건에는 동일한 `eventId`를 전달한다. 새로운 사건은 새 ID로 전달한다. 대기 상태는 `<BooMascot />`만 사용한다. 반응을 호출하려면 `eventId`가 필요하다.

| 반응      | 동작                                            | 길이     |
| --------- | ----------------------------------------------- | -------- |
| `idle`    | 작은 호흡, 독립된 눈 깜빡임                     | 4초 반복 |
| `correct` | 준비 자세, 날개 인사, 웃는 눈, 잔동작           | 1.4초    |
| `goal`    | 눌렀다 점프, 착지, 작은 재도약, 반짝임 4개      | 1.8초    |
| `levelUp` | 큰 준비 자세, 두 번의 도약, 웃는 눈, 반짝임 6개 | 2.4초    |

모든 반응은 기본 자세로 돌아온다. 새 신호는 기존 반응을 짧게 섞어 전환한다. 목표와 레벨을 함께 달성하면 레벨 반응을 우선한다. XP 지급은 기존 서버 영수증이 결정하며 애니메이션이 지급을 발생시키지 않는다.

## 디자인 기준

- 부의 하늘색 몸통, 밝은 배, 주황색 부리와 신발, 머리 장식을 유지한다.
- 작은 크기에서 보이는 눈을 키우고 깃털 세부 선을 줄인다.
- 발끝 기준의 눌림과 늘어남, 얼굴과 날개의 시간차, 착지 후 잔동작으로 무게감을 표현한다.
- 준비 자세와 도약, 착지에 서로 다른 속도 곡선을 적용한다.
- 정답은 작게 응원하고 목표와 레벨은 더 큰 동작으로 구분한다.
- 모션 축소 환경에는 원본 정지 이미지를 표시하고 Rive 런타임을 불러오지 않는다.
- 런타임 또는 파일 로드 실패 시 원본 정지 이미지로 대체한다.

듀오링고처럼 학습 행동마다 표정과 몸짓으로 즉시 반응하되, 작은 보상과 큰 성취의 동작 강도를 구분한다.

## 파일

- `parts.xml`: 공식 AI의 응용 동작 09에서 분리한 벡터 경로와 부품 계층.
- `polish-rig.mjs`: 발끝 기준 변형, 확대된 얼굴, 웃는 눈, 그림자와 반짝임.
- `build-scene.mjs`: 타임라인, 전환, 데이터 바인딩을 생성한다.
- `scene.rml`: CLI에서 사용하는 생성된 Rive 소스.
- `boo.rev`: Rive 편집기로 가져올 수 있는 편집용 문서.
- `../../public/characters/boo/boo.riv`: 실제 웹 배포용 파일.

아트보드는 `Boo`, 상태 머신은 `BooController`, View Model은 `BooState`다. 세 반응은 같은 이름의 Trigger 속성이다. 새로운 동작을 추가할 때는 에셋과 앱의 `BooReaction` 계약을 함께 변경한다. 기존 동작의 속도와 표정만 바꿀 때는 호출 코드를 변경할 필요가 없다.

## 재생성과 검증

Rive CLI 1.9.2에서 제작했다. 공식 설치 안내: https://rive.app/agents

```sh
pnpm mascot:scene
rive design/boo-rive --verify
rive inspect design/boo-rive --summary
rive design/boo-rive
```

소스 수정은 `parts.xml`, `polish-rig.mjs`, `build-scene.mjs`에서 한다. `scene.rml`에 직접 한 수정은 재생성 시 사라진다. 편집기에서 `boo.rev`를 수정했다면 CLI 소스와 별도로 관리되는 변경이라는 점을 확인하고, 새 런타임 파일을 내보내 교체한다.

```sh
rive login
rive design/boo-rive --publish=local --rev=design/boo-rive/boo.rev
cp design/boo-rive/build/boo.riv public/characters/boo/boo.riv
pnpm check
pnpm test
pnpm build
```

`--publish=local`은 로컬 파일 내보내기다. 웹 호스팅이나 Rive 워크스페이스 파일 업로드를 하지 않는다. 공식 CLI는 내보내기에 계정 인증을 요구한다. 현재 무료 플랜으로 내보낸 `.riv`에는 Rive 시작 화면이 포함된다는 CLI 안내가 있다. 워터마크는 제거하지 않는다.

웹 런타임은 `@rive-app/react-canvas` 4.39.0과 `@rive-app/canvas` 2.50.0이다. WASM은 동일 버전을 로컬에서 제공한다. 버전 변경 시 `copy-runtime.mjs`와 `AnimatedBoo.tsx`의 경로를 함께 수정하고 `pnpm mascot:runtime`을 실행한다.

## 출처

공식 안내: https://www.hufs.ac.kr/hufs/11137/subview.do

벡터 원본: https://www.hufs.ac.kr/sites/hufs/files/boo_ai.zip

캐릭터 권리는 한국외국어대학교에 있다. 변형 범위와 공개 시 사용 조건은 공식 안내를 따른다. 원본 PNG와 출처는 `public/characters/boo/README.md`에 기록했다.
