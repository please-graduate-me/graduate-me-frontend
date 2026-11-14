import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 학습 작업 공간은 테마 바탕 위에서 화면 폭에 맞춰 확장한다. */
export const study = style({ minWidth: 0, minHeight: '100vh' });

/** 자료 제목과 학습 종료를 입력 영역 밖에 유지한다. */
export const header = style({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: vars.space.md,
  padding: vars.space.lg,
  borderBottom: `1px solid ${vars.color.line}`,
});

/** 긴 자료 제목은 주변 조작보다 먼저 줄바꿈한다. */
export const headerTitle = style({ flex: 1, minWidth: 160 });

/** 목록 복귀 아이콘의 터치 영역을 유지한다. */
export const backLink = style({
  display: 'grid',
  placeItems: 'center',
  width: 40,
  height: 40,
});

/** 학습 종료 링크를 제목과 분리한다. */
export const exitLink = style({ whiteSpace: 'nowrap' });

/** 넓은 화면은 스크립트를 병렬로, 좁은 화면은 학습 뒤에 배치한다. */
export const studyGrid = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) 380px',
  gap: vars.space.lg,
  padding: vars.space.lg,
  alignItems: 'start',
  '@media': {
    '(max-width: 1100px)': { gridTemplateColumns: 'minmax(0, 1fr)' },
    '(max-width: 600px)': { padding: vars.space.sm },
  },
});

/** 영상과 답안은 같은 읽기 순서로 이어진다. */
export const main = style({ display: 'grid', gap: vars.space.lg, minWidth: 0 });

/** 영상과 재생 조작은 하나의 Astryx 카드로 묶는다. */
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

/** 빈칸과 원문을 같은 문장 흐름으로 읽게 한다. */
export const blankSentence = style({
  paddingBlock: vars.space.md,
  lineHeight: 2.7,
  minHeight: 84,
});

/** Astryx 입력은 문장 사이에서 일정한 폭을 확보한다. */
export const blankInput = style({
  display: 'inline-block',
  width: 160,
  verticalAlign: 'middle',
  marginInline: vars.space.xs,
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

/** 완료 화면에 다음 학습 행동을 위한 간격을 둔다. */
export const completion = style({
  display: 'grid',
  gap: vars.space.md,
  minHeight: 360,
});

/** 학습 집계는 같은 단위로 나란히 비교하게 한다. */
export const stats = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space.xl,
});

/** 차이 토큰이 긴 문장에서도 줄바꿈한다. */
export const differences = style({
  display: 'flex',
  gap: vars.space.xs,
  flexWrap: 'wrap',
});

/** 채점 비교 토큰에 읽기 여백을 둔다. */
export const diff = style({
  padding: '3px 7px',
  borderRadius: vars.radius.control,
});

/** 일치한 단어를 수정 대상과 구분한다. */
export const match = style({ color: vars.color.match });

/** 빠뜨린 단어는 정답과 함께 구분한다. */
export const missing = style({
  color: vars.color.differenceText,
  background: vars.color.differenceBackground,
});

/** 교체할 단어는 정답과 함께 구분한다. */
export const replace = style({
  color: vars.color.differenceText,
  background: vars.color.differenceBackground,
});

/** 추가한 단어를 누락된 단어와 구분한다. */
export const extra = style({
  color: vars.color.extraText,
  background: vars.color.extraBackground,
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

globalStyle(`${stats} strong`, {
  display: 'block',
  fontSize: vars.fontSize.heading1,
});
