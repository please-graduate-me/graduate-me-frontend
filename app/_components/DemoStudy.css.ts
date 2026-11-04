import { style, globalStyle } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 체험도 개인 학습과 같은 작업 공간으로 보여준다. */
export const root = style({
  marginTop: '24px',
  paddingBlock: '24px',
  borderTop: `1px solid ${vars.color.line}`,
  fontSize: '14px',
});

/** 체험 안내는 학습 제목보다 낮은 위계로 전달한다. */
export const status = style({
  color: vars.color.muted,
  fontSize: '12px',
  whiteSpace: 'nowrap',
});

/** 구절 번호와 재생 시간을 양쪽 작업 영역에 정렬한다. */
export const progressHeading = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingBottom: '18px',
  fontSize: '13px',
  color: vars.color.muted,
});

/** 승인한 F 시안의 답안과 영상 비율을 유지한다. */
export const grid = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1.05fr) minmax(0, 1fr)',
  columnGap: '64px',
  rowGap: 0,
  alignItems: 'start',
  '@media': { '(max-width: 900px)': { gridTemplateColumns: 'minmax(0, 1fr)' } },
});

/** 답안은 영상과 목록을 합친 높이 옆에서 독립적으로 흐른다. */
export const writing = style({
  minWidth: 0,
  gridColumn: 1,
  gridRow: '1 / span 2',
  '@media': { '(max-width: 900px)': { gridRow: 2, marginTop: '20px' } },
});

/** 입력 제목을 첫 시선의 기준점으로 삼는다. */
export const answerHeading = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '12px',
});

/** 격려 문구는 입력 제목과 모드 사이에 둔다. */
export const help = style({
  color: vars.color.muted,
  fontSize: '13px',
  margin: '8px 0 24px',
});

/** 문장 전체 입력의 크기와 색을 승인 시안에 맞춘다. */
export const answer = style({
  display: 'block',
  width: '100%',
  minHeight: '280px',
  padding: '24px',
  margin: 0,
  borderRadius: '12px',
  borderColor: '#bacaf1',
  background: '#f5f7ff',
  fontSize: '28px',
  lineHeight: 1.8,
  letterSpacing: '-0.02em',
  '@media': {
    '(max-width: 900px)': {
      minHeight: '114px',
      fontSize: '17px',
      padding: '14px',
    },
  },
});

/** 빈칸도 전체 입력과 같은 공간 안에서 읽게 한다. */
export const blanks = style({
  minHeight: '280px',
  padding: '24px',
  border: '1px solid #bacaf1',
  borderRadius: '12px',
  background: '#f5f7ff',
  fontSize: '24px',
  lineHeight: 2.4,
  '@media': {
    '(max-width: 900px)': {
      minHeight: '114px',
      padding: '14px',
      fontSize: '17px',
    },
  },
});

/** 정답 확인을 오른쪽의 유일한 주 행동으로 유지한다. */
export const actions = style({
  display: 'flex',
  justifyContent: 'space-between',
  gap: '16px',
  marginTop: '18px',
});

/** 확인 버튼은 시안과 동일한 넓은 클릭 영역을 갖는다. */
export const confirm = style({
  minWidth: '178px',
  '@media': { '(max-width: 900px)': { minWidth: '160px' } },
});

/** 이동과 초기화는 채점보다 가벼운 문구로 제공한다. */
export const secondary = style({
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: '20px',
});

/** 결과 메시지가 긴 문장에서도 화면 밖으로 넘치지 않게 한다. */
export const feedback = style({
  background: '#e9effe',
  padding: '14px',
  borderRadius: '8px',
  marginTop: '16px',
  overflowWrap: 'anywhere',
});

/** 저장 제한 안내를 답안 아래에 일관되게 둔다. */
export const note = style({
  borderTop: `1px solid ${vars.color.line}`,
  paddingTop: '22px',
  marginTop: '26px',
  fontSize: '12px',
  color: vars.color.muted,
});

/** 모바일에서는 먼저 영상을 듣고 바로 입력으로 이어진다. */
export const media = style({
  minWidth: 0,
  gridColumn: 2,
  gridRow: 1,
  '@media': { '(max-width: 900px)': { gridColumn: 1 } },
});

/** 학습 영상은 확대 시안의 16:9 비율을 유지한다. */
export const player = style({
  width: '100%',
  aspectRatio: '16 / 9',
  position: 'relative',
  background: vars.color.video,
  borderRadius: '12px',
  overflow: 'hidden',
});

/** 반복 청취 조작을 영상 아래 세 칸에 고정한다. */
export const playback = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: '10px',
  marginTop: '18px',
  '@media': { '(max-width: 900px)': { gap: '6px', marginTop: '12px' } },
});

/** 다시 듣기를 옅은 면으로 강조해 확인 버튼과 구별한다. */
export const replay = style({ background: '#e9effe', borderColor: '#e9effe' });

/** 재생 상태와 세부 동작은 작은 줄로 유지한다. */
export const settings = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '8px',
  color: vars.color.muted,
  fontSize: '12px',
  marginTop: '10px',
});

/** 목록은 영상 아래에 두되 모바일에서는 답안 뒤에 둔다. */
export const segmentArea = style({
  gridColumn: 2,
  gridRow: 2,
  minWidth: 0,
  '@media': { '(max-width: 900px)': { gridColumn: 1, gridRow: 3 } },
});

/** 접힌 영상을 사용자가 다시 열 수 있게 한다. */
export const showVideo = style({
  display: 'none',
  '@media': { '(max-width: 900px)': { display: 'inline-block' } },
});

globalStyle(`.${progressHeading} strong`, {
  fontSize: '19px',
  color: vars.color.ink,
});

globalStyle(`.${progressHeading} strong span`, {
  fontSize: '13px',
  color: vars.color.muted,
  fontWeight: 400,
});

globalStyle(`.${answerHeading} h3`, {
  fontSize: '28px',
  letterSpacing: '-0.035em',
  margin: 0,
  '@media': { '(max-width: 900px)': { fontSize: '19px' } },
});

globalStyle(`.${answerHeading} > span`, {
  fontSize: '10px',
  color: vars.color.muted,
});

globalStyle(`.${answer}::placeholder`, {
  color: vars.color.muted,
  fontSize: '18px',
});

globalStyle(`.${blanks} input`, {
  width: '110px',
  margin: '0 6px',
  fontSize: 'inherit',
});

globalStyle(`.${secondary} button, .${settings} button`, {
  border: 0,
  background: 'transparent',
  color: vars.color.muted,
  cursor: 'pointer',
  fontSize: '12px',
  minHeight: '36px',
  padding: '6px 0',
});

globalStyle(`.${secondary} button:disabled`, {
  opacity: 0.5,
  cursor: 'not-allowed',
});

globalStyle(`.${playback} select`, {
  width: '100%',
  minWidth: 0,
  padding: '10px 6px',
  minHeight: '44px',
  textAlign: 'center',
  fontSize: '13px',
});

globalStyle(`.${player} iframe`, {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  border: 0,
});

globalStyle(
  `.${root}[data-focused] .${player}, .${root}[data-focused] .${segmentArea}`,
  { '@media': { '(max-width: 900px)': { display: 'none' } } }
);

globalStyle(`.${root}[data-focused] .${media}`, {
  '@media': {
    '(max-width: 900px)': {
      position: 'sticky',
      top: 0,
      zIndex: 2,
      background: vars.color.surface,
    },
  },
});

globalStyle(`.${root}[data-focused] .${help}`, {
  '@media': { '(max-width: 900px)': { display: 'none' } },
});

globalStyle(`.${root}[data-focused] .${writing}`, {
  '@media': { '(max-width: 900px)': { marginTop: '12px' } },
});

globalStyle(
  `.${root}[data-focused] .${answer}, .${root}[data-focused] .${blanks}`,
  {
    '@media': { '(max-width: 900px)': { minHeight: '96px' } },
  }
);

/** 재생 조작 크기는 공용 버튼 내부를 덮어쓰지 않고 전달한다. */
export const playbackButton = style({
  width: '100%',
  minWidth: 0,
  padding: '10px 6px',
  minHeight: '44px',
  textAlign: 'center',
  fontSize: '13px',
});
