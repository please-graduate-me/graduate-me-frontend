import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 학습 작업 공간은 테마 바탕 위에서 화면 폭에 맞춰 확장한다. */
export const study = style({ minWidth: 0, minHeight: '100vh' });

/** 집중 학습 상단은 본문과 같은 폭의 가운데 열에 둔다. */
export const header = style({
  display: 'grid',
  gap: vars.space.md,
  width: '100%',
  maxWidth: 1120,
  marginInline: 'auto',
  boxSizing: 'border-box',
  padding: `${vars.space.compact} ${vars.space.lg} 0`,
  '@media': {
    '(max-width: 1100px)': { maxWidth: 760 },
    '(max-width: 600px)': {
      padding: `${vars.space.sm} ${vars.space.sm} 0`,
    },
  },
});

/** 닫기, 진행 막대, 진도 배지를 한 줄의 얇은 막대로 묶는다. */
export const topBar = style({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: vars.space.md,
});

/** 진행 막대가 상단 막대의 남는 폭을 차지하고 좁으면 먼저 줄어든다. */
export const lessonProgress = style({ flex: '1 1 120px', minWidth: 80 });

/** 긴 자료 제목은 상단 막대 아래에서 줄바꿈한다. */
export const headerTitle = style({ display: 'grid', gap: vars.space.xxs });

/** 목록 복귀 아이콘의 터치 영역을 유지한다. */
export const backLink = style({
  display: 'grid',
  placeItems: 'center',
  flex: 'none',
  width: 44,
  height: 44,
  borderRadius: vars.radius.control,
  color: vars.color.muted,
  transition: 'background-color 150ms ease',
  selectors: { '&:hover': { background: vars.color.canvas } },
});

/** 진도와 단계 숫자는 시안의 숫자 서체로 폭을 맞춘다. */
export const numeric = style({
  fontFamily: vars.font.numeric,
  fontVariantNumeric: 'tabular-nums',
});

/** 넓은 화면은 스크립트를 병렬로, 좁은 화면은 학습 뒤에 가운데 열로 배치한다. */
export const studyGrid = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) 380px',
  gap: vars.space.lg,
  width: '100%',
  maxWidth: 1120,
  marginInline: 'auto',
  boxSizing: 'border-box',
  padding: vars.space.lg,
  alignItems: 'start',
  '@media': {
    '(max-width: 1100px)': {
      gridTemplateColumns: 'minmax(0, 1fr)',
      maxWidth: 760,
    },
    '(max-width: 600px)': { padding: vars.space.sm },
  },
});

/** 영상과 답안은 같은 읽기 순서로 이어진다. */
export const main = style({ display: 'grid', gap: vars.space.lg, minWidth: 0 });

/** 영상과 재생 조작은 하나의 공통 Card로 묶는다. */
export const playerPanel = style({
  display: 'grid',
  gap: vars.space.md,
  minWidth: 0,
});

/** 외부 플레이어가 준비되기 전에도 영상 비율을 확보한다. */
export const videoFrame = style({
  position: 'relative',
  width: '100%',
  aspectRatio: '16 / 9',
  overflow: 'hidden',
  background: vars.color.video,
});

/** 좁은 화면에서도 재생 조작을 줄바꿈해 접근하게 한다. */
export const playbackToolbar = style({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: vars.space.sm,
});

/** 시간 숫자의 폭이 재생 중 흔들리지 않게 한다. */
export const time = style({
  whiteSpace: 'nowrap',
  fontVariantNumeric: 'tabular-nums',
});

/** 탐색 막대가 남는 공간을 사용하게 한다. */
export const progress = style({ flex: '1 1 160px', minWidth: 100 });

/** 반복 옵션의 문구가 스위치에서 떨어지지 않게 한다. */
export const repeatControl = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.xs,
  whiteSpace: 'nowrap',
});

/** 답안 카드는 내용 길이에 맞게 높이가 늘어난다. */
export const answerPanel = style({
  display: 'grid',
  gap: vars.space.md,
  minWidth: 0,
});

/** 구절 정보와 저장 상태를 줄바꿈 가능한 행에 배치한다. */
export const answerHeading = style({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: vars.space.sm,
});

/** 저장 상태는 구절 조작의 끝에 둔다. */
export const saveStatus = style({ marginLeft: 'auto' });

/** 학습 모드와 스크립트 공개 동작을 나란히 배치한다. */
export const modeRow = style({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: vars.space.md,
});

/** 지시문과 문장 듣기 버튼을 문제 위에 차례로 쌓는다. */
export const prompt = style({
  display: 'grid',
  justifyItems: 'start',
  gap: vars.space.compact,
});

/** 문장 듣기는 회색 알약에 구절 길이를 함께 보여 준다. */
export const listen = style({ gap: vars.space.sm });

/** 구절 길이는 버튼 글자보다 작은 보조색 숫자다. */
export const listenTime = style({
  fontFamily: vars.font.numeric,
  fontSize: vars.fontSize.label,
  fontWeight: vars.fontWeight.bold,
  fontVariantNumeric: 'tabular-nums',
  color: vars.color.muted,
});

/** 빈칸과 원문을 시안의 숫자 서체로 크게 읽고 밑줄 빈칸이 줄 사이에 들어가게 한다. */
export const blankSentence = style({
  paddingBlock: vars.space.md,
  minHeight: 84,
  fontFamily: vars.font.numeric,
  fontSize: '30px',
  fontWeight: vars.fontWeight.bold,
  lineHeight: 2.1,
  letterSpacing: '-0.01em',
  '@media': { '(max-width: 600px)': { fontSize: '22px' } },
});

/** 풀이 중 번역은 문장 바로 아래 보조문으로 붙인다. */
export const translation = style({ marginTop: `calc(${vars.space.xs} * -1)` });

/** 주 행동 버튼은 시안처럼 넓은 최소 폭을 갖고 좁은 화면에서는 줄 전체를 쓴다. */
export const cta = style({
  minWidth: 220,
  '@media': { '(max-width: 600px)': { minWidth: 0, flex: '1 1 100%' } },
});

/** 전체 받아쓰기 입력에 여러 줄의 작성 공간을 확보한다. */
export const answerInput = style({ minHeight: 130 });

/** 제출과 보조 동작이 작은 화면에서 자연스럽게 줄바꿈한다. */
export const answerActions = style({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: vars.space.sm,
  marginTop: vars.space.md,
});

/** 검토와 구절 이동을 답안 제출에서 분리한다. */
export const secondaryActions = style({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: vars.space.sm,
});

/** 이전과 다음 구절은 한 묶음으로 이동한다. */
export const navigation = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.xs,
  marginLeft: 'auto',
});

/** 공개한 스크립트는 충분한 행간으로 이어 읽게 한다. */
export const scriptReading = style({
  display: 'grid',
  gap: vars.space.md,
  minHeight: 130,
});

/** 보조 설정은 주 학습 카드 뒤에 둔다. */
export const learningDetails = style({ paddingBlock: vars.space.sm });

/** 완료 화면은 도장과 집계, 다음 행동을 가운데 정렬로 쌓는다. */
export const completion = style({
  display: 'grid',
  justifyItems: 'center',
  alignContent: 'center',
  gap: vars.space.md,
  minHeight: 360,
  paddingBlock: vars.space.lg,
  textAlign: 'center',
});

/** 학습 집계는 같은 단위로 나란히 비교하게 한다. */
export const stats = style({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: vars.space.compact,
});

/** 집계 칸은 숫자를 이름 위에 크게 보여 주되 읽는 순서는 이름이 먼저다. */
export const stat = style({
  display: 'flex',
  flexDirection: 'column-reverse',
  alignItems: 'center',
  gap: vars.space.xxs,
  minWidth: 96,
  padding: `${vars.space.compact} ${vars.space.comfortable}`,
  border: `1px solid ${vars.color.line}`,
  borderRadius: vars.radius.panel,
  fontSize: vars.fontSize.small,
  color: vars.color.muted,
});

/** 복습과 모드 전환을 한 줄에 두고 좁으면 줄바꿈한다. */
export const completionActions = style({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: vars.space.sm,
});

/** 보조 설명은 테마의 낮은 읽기 위계를 따른다. */
export const muted = style({ color: vars.color.muted });

/** 짧은 학습 안내는 테마의 보조 크기를 따른다. */
export const small = style({
  fontSize: vars.fontSize.small,
  color: vars.color.muted,
});

globalStyle(`${videoFrame} iframe`, {
  position: 'absolute',
  inset: 0,
  border: 0,
  width: '100%',
  height: '100%',
});

globalStyle(`${stat} strong`, {
  fontSize: vars.fontSize.heading1,
  lineHeight: 1.1,
  color: vars.color.ink,
});
