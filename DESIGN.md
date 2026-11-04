---
name: graduate me
description: 밝은 청색과 명료한 활자로 반복 듣기와 받아쓰기를 연결하는 학습 화면
colors:
  ink: '#24314b'
  muted: '#576985'
  line: '#d5def1'
  accent: '#254fca'
  background: '#ffffff'
  surface: '#ffffff'
  focus: '#254fca'
  input-border: '#acbce5'
  notice: '#fff5df'
  error: '#9b2c2c'
  error-background: '#fff0ee'
  success: '#e8f4ed'
  match: '#276243'
  difference-background: '#fde3d5'
  difference-text: '#8c2c16'
  extra-background: '#e5e6fa'
  extra-text: '#3d3880'
  video: '#19292e'
typography:
  body:
    fontFamily: '"DM Sans", "Noto Sans KR", sans-serif'
    lineHeight: 1.6
  headline:
    fontSize: 'clamp(28px, 4vw, 42px)'
    lineHeight: 1.3
    letterSpacing: '-1px'
  title:
    fontSize: '21px'
  label:
    fontSize: '14px'
    fontWeight: 600
rounded:
  control: '7px'
  panel: '12px'
spacing:
  xs: '6px'
  sm: '10px'
  md: '16px'
  lg: '24px'
  xl: '32px'
components:
  button-primary:
    backgroundColor: '{colors.accent}'
    textColor: '{colors.surface}'
    rounded: '{rounded.control}'
    padding: '10px 16px'
  button-secondary:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.ink}'
    rounded: '{rounded.control}'
    padding: '10px 16px'
  field:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.ink}'
    rounded: '{rounded.control}'
    padding: '10px 12px'
  panel:
    backgroundColor: '{colors.surface}'
    rounded: '{rounded.panel}'
    padding: '{spacing.lg}'
---

# Design System: graduate me

## Overview

**Creative North Star: "밝은 청색의 학습 공간"**

백색 바탕과 선명한 청색 조작부로 듣기와 직접 입력하기를 연결한다. 영어와 한국어가 섞인 화면에서도 읽기 쉬운 활자와 여백을 유지하고, 실제 영상과 답안이 중심이 되게 한다.

E 색상과 F 확대 시안을 기준으로 정정한 현재 코드에서 추출했다. 공통 토큰과 헤더는 앱에 공유되지만, 아래 학습 배치와 입력 상태 규칙의 적용 범위는 홈의 `DemoStudy`와 `/learn/[id]`의 `Study`다. 다른 화면의 전면 개편을 승인하거나 계획 중인 기능을 규정하는 문서가 아니다.

**Key Characteristics:**

- 백색 면, 청색 강조, 차분한 남색 본문.
- 얇은 경계선과 둥근 입력부, 그림자 없는 구조.
- 실제 영상과 답안의 관계가 드러나는 학습 공간.

## Colors

밝은 중립 면에 청색을 조작과 포커스의 기준색으로 사용한다. 수치의 기준은 frontmatter이며 구현 원본은 `lib/styles/theme.css.ts`다.

### Primary

- **선명한 학습 청색** (`accent`, `focus`): 주 버튼, 링크, 진행 표시, 입력 커서와 포커스.

### Neutral

- **백색 바탕** (`background`, `surface`): 본문, 헤더, 패널과 보조 버튼.
- **남색 잉크** (`ink`), **차분한 설명색** (`muted`): 본문과 보조 안내의 위계.
- **옅은 청색 경계** (`line`, `input-border`): 영역 구분과 입력 가능 영역.
- **짙은 영상 바탕** (`video`): 플레이어 준비 전에도 영상 자리를 유지한다.

안내는 `notice`, 실패는 `error`와 `error-background`, 성공은 `success`와 `match`를 사용한다. 단어 누락과 교체는 `difference-*`, 불필요한 추가는 `extra-*`로 구분한다. 이 색들은 장식 팔레트가 아니라 결과 상태에 대응한다.

**The 상태 설명 Rule.** 채점 차이를 색만으로 표시하지 않고 누락, 추가, 교체의 문구와 함께 보여준다.

## Typography

**Body Font:** DM Sans, Noto Sans KR, sans-serif. 영문은 DM Sans, 한글은 Noto Sans KR로 이어진다. 두 가변 글꼴은 자체 호스팅하며 `font-display: swap`을 사용한다. 출처, 문자 범위와 SIL Open Font License 1.1 기록은 `public/fonts/README.md`와 동봉 라이선스를 따른다.

### Hierarchy

- **Headline**: 공통 h1의 유동 크기와 조밀한 자간은 frontmatter 기준이다. 개인 학습 영상 제목은 별도로 (24px), 자간 `-.5px`를 사용하고 긴 제목은 줄바꿈한다. 체험 제목도 (24px)다. 두 화면의 답안 제목은 (28px), 자간 `-0.035em`이며 모바일에서는 (19px)다.
- **Title**: h2는 `title`, h3는 (18px)를 사용한다.
- **Body**: 공통 줄 높이는 `body` 기준이다. 본문 기본 글자 크기는 코드에서 별도로 지정하지 않는다.
- **Label**: 입력 이름은 `label`, 부가 안내는 (12px 또는 13px), 모드 전환 버튼은 (13px)다.
- **학습 답안**: 두 화면의 데스크톱 전체 입력은 (28px), 줄 높이는 (1.8)이다. 모바일은 두 화면 모두 (17px)다. 빈칸 문장은 체험 (24px), 줄 높이 (2.4), 모바일 (17px)이며 개인 학습은 (19px), 줄 높이 (2.8)다.

## Layout

공통 본문은 최대 (1440px), 패딩 (24px 64px 60px)다. 화면 너비 (800px) 이하에서는 (24px 16px)로 바뀐다. 헤더는 줄바꿈 가능한 flex이며 상단 청색 선 (4px)과 하단 경계선 (1px)을 갖는다. 헤더 설명은 (800px) 이하에서 숨긴다.

학습 화면은 답안과 영상을 `minmax(0, 1.05fr) minmax(0, 1fr)`로 배치하고 열 간격 (64px), 행 간격 (0)을 둔다. 왼쪽 답안은 두 행을 사용하고 오른쪽 영상 아래에 보조 학습 도구가 놓인다. (900px) 이하에서는 영상, 답안, 구절 목록 순서의 한 열로 바뀐다. 개인 학습의 행 간격은 (24px), 체험 답안의 상단 여백은 (20px)이며 입력 중에는 (12px)다.

영상은 두 화면 모두 16:9 비율과 너비 100%다. 개인 학습은 최대 (960px), 최소 (200px)이며 작게 보기 상태는 최대 (480px)다. 체험에는 이 최대·최소 너비 규칙이 없다. 전체 답안 입력은 최소 높이 (280px), 내부 여백 (24px)다. 모바일 최소 높이는 (114px)이며 두 화면의 전체 입력은 포커스 중 (96px)로 줄어든다. 모바일 내부 여백은 (14px)다. 제출 버튼은 오른쪽에 배치하고 최소 너비 (178px)를 확보한다. 체험 모바일에서는 최소 너비 (160px)다.

**The 학습 흐름 Rule.** 학습 화면의 보조 도구는 모바일 답안 뒤에 두고 입력 중에는 재생 조작을 남긴다.

## Elevation & Depth

확인한 공통 부품과 학습 화면에는 그림자와 장식 애니메이션이 없다. 백색 면, 옅은 입력 배경, 얇은 선으로 구분한다. 모바일 입력 상태의 재생 영역은 `position: sticky`, `top: 0`, `z-index: 2`와 백색 배경으로 위에 남는다. 포커스는 청색 외곽선 (3px)과 간격 (3px)으로 표시한다.

## Shapes

공통 조작부와 패널 모서리는 frontmatter의 `control`, `panel`을 따른다. 두 화면의 전체 답안 입력과 영상에는 모서리 (12px)를 사용한다. 단어 차이 표시는 작은 모서리 (4px)로 문장 안에 붙는다. 학습 입력의 옅은 청색 면 (`#f5f7ff`)과 경계 (`#bacaf1`), 개인 학습의 선택 텍스트 배경 (`#dce5ff`)은 화면에 정의된 값이며 공통 팔레트로 승격하지 않는다. 다시 듣기 버튼과 현재 구절은 옅은 청색 (`#e9effe`)으로 강조한다.

## Components

### Buttons

청색 주 버튼과 백색 보조 버튼으로 행동 위계를 나눈다. 글자 굵기는 (600), 테두리는 (1px)다. 보조 버튼 테두리는 `line`, 주 버튼은 `accent`다. 활성 hover는 `brightness(.94)`, 비활성은 불투명도 (0.5)와 `not-allowed` 커서다. 공통 포커스 외곽선을 유지한다. 재생 조작은 `2초 전`, `다시 듣기`, 배속 select의 세 열이다. 재생 버튼은 최소 높이 (44px)이며 다시 듣기만 옅은 청색으로 강조한다. 체험 이동과 초기화, 재생 상태 줄의 동작은 테두리 없는 작은 텍스트 버튼이다. 개인 학습도 정답 공개 등 보조 동작에 가벼운 텍스트 버튼을 사용한다.

### Inputs / Fields

일반 입력은 공통 경계, 백색 면, `field` 여백을 따른다. 큰 답안은 위 Shapes와 Layout의 학습 전용 값을 사용한다. 배속은 네이티브 select다. 개인 학습 빈칸 입력은 너비 (115px), 여백 (4px 8px), 체험은 너비 (110px)다.

### Cards / Containers

공통 Panel은 얇은 경계와 `panel` 모서리를 사용한다. (800px) 이하에서는 패딩이 (18px)다. 학습 답안과 영상 전체를 각각 공통 카드로 감싸지는 않는다.

### Navigation

헤더 브랜드 링크는 (23px), 굵기 (800), 밑줄 없이 표시한다. 일반 링크는 청색과 밑줄 간격 (4px)을 사용한다. 학습 구절 이동은 경계선 아래의 이전과 다음 버튼으로 나눈다.

### 모드 전환과 구절 목록

모드 전환은 `LearningModeSwitch`의 밑줄 버튼이며 select가 아니다. 버튼은 최소 높이 (44px), 간격 (24px)이고 선택 상태는 `aria-pressed`, 굵기 (700)와 청색 밑줄 (2px)로 드러낸다. 별도 탭 키보드 동작을 주장하지 않고 네이티브 버튼 동작을 유지한다.

`SegmentList`는 기본 상태에서 영상 조작 아래 항상 노출된다. 모바일에서는 답안 다음에 놓이며 입력 중에는 숨긴다. 최대 높이 (210px) 안에서 스크롤하고 행은 최소 높이 (48px), 내부 여백 (14px 12px)다. 현재 행은 `aria-current="step"`, 옅은 청색 면과 상태 문구로 구분한다. 확인하지 않은 정답을 목록에 노출하지 않는다.

### 학습 도구와 입력 상태

개인 학습의 추가 설정, 구절 찾기, 확인한 문장 대본과 기록 관리는 네이티브 details로 펼친다. 대본에는 정답을 맞혔거나 공개한 문장만 표시하고 최대 높이 (280px) 안에서 스크롤한다.

모바일에서 답안 폼에 포커스가 들어오면 영상과 구절 목록을 숨기고 재생 조작을 상단에 남긴다. `영상 보기` 버튼으로 해당 상태를 해제한다. 단순 blur로 자동 해제하지 않는다. `useAnswerViewport`는 답안 포커스 중 `visualViewport` 크기 변경에 반응해 폼을 화면 가운데로 이동시킨다. 개인 학습의 자동 답안 포커스는 (901px) 이상에서만 적용한다.

로컬 홈의 `/api/demo` 응답, YouTube iframe 썸네일 로딩, 체험 채점과 모드 전환을 확인했다. (390×500px) 뷰포트에서 입력 영역 (y=170~266px)과 제출 버튼 (y=284~329px)이 함께 보였다. 이는 축소한 브라우저 뷰포트 확인이며 실제 OS 소프트 키보드 검증이 아니다. 실제 미디어 청취와 전체 재생 제어도 미검증이다.

## Do's and Don'ts

### Do:

- **Do** 공통 토큰을 재사용하고 학습 화면 전용 배치와 값을 구분한다.
- **Do** 확인한 문장만 대본에 보여주고 채점 상태를 글로도 설명한다.
- **Do** 모드 전환의 버튼 상태, 배속 select, details와 가시적인 키보드 포커스를 유지한다.

### Don't:

- **Don't** 시안의 예시 답안이나 향후 학습 기능을 현재 제공 기능으로 기록하지 않는다.
- **Don't** 학습 입력 중 숨기는 영상과 보조 도구 규칙을 다른 화면의 공통 규칙으로 확대하지 않는다.
- **Don't** 시안의 래스터 이미지를 제품 자산으로 추가하지 않는다. 현재 화면은 코드와 실제 영상으로 구성한다.
