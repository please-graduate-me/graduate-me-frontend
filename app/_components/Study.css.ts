import { style, globalStyle } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 답안 영역의 반응형 규칙이 다른 패널에 번지지 않게 한다. */
export const answerPanel = style({
  minWidth: 0,
  gridColumn: '1',
  gridRow: '1 / span 2',
  paddingTop: '0',
  '@media': {
    '(max-width: 900px)': { gridColumn: '1', gridRow: '2', paddingTop: 0 },
  },
});

/** 문장 속 빈칸 입력이 서로 겹치지 않도록 읽기 간격을 확보한다. */
export const blankSentence = style([
  {
    lineHeight: '2.8',
    fontSize: '19px',
    margin: '18px 0 24px',
  },
]);

/** 학습 종료 후 비어 있는 플레이어 열까지 결과 화면이 사용하게 한다. */
export const completion = style([{ gridColumn: '1 / -1', gridRow: '1' }]);

/** 재생 조작을 영상과 설명 사이에서 구분하게 한다. */
export const controls = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: '10px',
  marginTop: '18px',
});

/** 누락과 교체 결과를 단어 단위로 읽을 수 있게 한다. */
export const diff = style([{ padding: '3px 7px', borderRadius: '4px' }]);

/** 긴 오답 비교도 화면 밖으로 넘치지 않게 한다. */
export const differences = style([
  {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
  },
]);

/** 실패 메시지를 일반 안내와 시각적으로 구분한다. */
export const error = style([
  {
    padding: '14px 16px',
    borderRadius: '7px',
    margin: '16px 0',
    background: vars.color.notice,
  },
  {
    color: vars.color.error,
    background: vars.color.errorBackground,
  },
]);

/** 불필요하게 추가한 단어를 누락된 단어와 구분한다. */
export const extra = style({});

/** 긴 영상 제목이 학습 화면의 조작 영역을 압도하지 않게 한다. */
export const lessonTitle = style([
  {
    fontSize: '24px',
    letterSpacing: '-.5px',
    overflowWrap: 'anywhere',
  },
]);

/** 이미 맞힌 단어는 수정 대상과 구분한다. */
export const match = style({});

/** 들었지만 적지 못한 단어를 쉽게 찾게 한다. */
export const missing = style({});

/** 모드 이름과 선택 메뉴가 하나의 조작으로 보이게 한다. */
export const modeLabel = style([
  {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
]);

/** 보조 설명이 주요 행동보다 먼저 눈에 띄지 않게 한다. */
export const muted = style([{ color: vars.color.muted }]);

/** 구절 이동과 답안 제출을 시각적으로 분리한다. */
export const navigation = style([
  {
    justifyContent: 'space-between',
    marginTop: '24px',
    borderTop: `1px solid ${vars.color.line}`,
    paddingTop: '20px',
  },
]);

/** 학습 흐름을 끊지 않고 확인할 안내를 강조한다. */
export const notice = style([
  {
    padding: '14px 16px',
    borderRadius: '7px',
    margin: '16px 0',
    background: vars.color.notice,
  },
]);

/** 다르게 적은 단어를 수정 대상으로 드러낸다. */
export const replace = style({});

/** 버튼과 입력 부품이 좁은 화면에서 자연스럽게 줄바꿈되게 한다. */
export const row = style([
  {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
]);

/** 제목과 보조 조작을 한 영역으로 인식하게 한다. */
export const sectionHeading = style([
  {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '20px',
    marginBottom: '20px',
  },
  {
    '@media': {
      '(max-width: 800px)': {
        alignItems: 'flex-start',
        flexDirection: 'row',
        flexWrap: 'wrap',
      },
    },
  },
]);

/** 키보드 안내의 항목 구분을 유지한다. */
export const shortcutList = style([{ paddingLeft: '22px' }]);

/** 부가 정보가 본문과 같은 강조 수준을 갖지 않게 한다. */
export const small = style([{ fontSize: '13px' }]);

/** 학습 결과의 숫자를 설명보다 빠르게 확인하게 한다. */
export const stats = style([
  { display: 'flex', gap: '28px', margin: '24px 0' },
]);

/** 확정된 답안과 영상 비율을 유지하면서 모바일에서는 세로로 흐르게 한다. */
export const studyGrid = style([
  {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1.05fr) minmax(0, 1fr)',
    columnGap: '64px',
    rowGap: '0',
    '@media': {
      '(max-width: 900px)': {
        gridTemplateColumns: 'minmax(0, 1fr)',
        gap: '24px',
      },
    },
    alignItems: 'start',
  },
]);

/** 정답 피드백을 재확인 안내와 구분한다. */
export const success = style([{ background: vars.color.success }]);

/** 플레이어가 준비되기 전에도 영상 영역의 크기를 유지한다. */
export const videoFrame = style([
  {
    position: 'relative',
    aspectRatio: '16 / 9',
    width: '100%',
    maxWidth: '960px',
    minWidth: '200px',
    borderRadius: '12px',
    overflow: 'hidden',
    marginInline: 'auto',
    background: vars.color.video,
  },
]);

/** 작은 화면에서도 플레이어를 잘라내지 않고 실제 크기만 줄인다. */
export const compactVideo = style({ maxWidth: '480px' });

/** 크기 조작이 플레이어 위를 덮지 않도록 별도 줄에 둔다. */
export const videoSizeControls = style({
  display: 'flex',
  justifyContent: 'flex-end',
  marginBottom: vars.space.sm,
});

globalStyle(`.${sectionHeading} h1`, { marginBottom: '0' });
globalStyle(`.${sectionHeading} h2`, { marginBottom: '0' });

globalStyle(`.${notice} p:last-child`, { marginBottom: '0' });

globalStyle(`.${studyGrid} > [hidden]`, { display: 'none' });

globalStyle(`.${videoFrame} iframe`, {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  border: '0',
});

globalStyle(`.${modeLabel} select`, { padding: '6px 8px', fontSize: '13px' });

globalStyle(`.${blankSentence} input`, {
  width: '115px',
  margin: '0 5px',
  padding: '4px 8px',
});

globalStyle(`.${diff}.${match}`, { color: vars.color.match });

globalStyle(`.${diff}.${missing}`, {
  background: vars.color.differenceBackground,
  color: vars.color.differenceText,
});

globalStyle(`.${diff}.${replace}`, {
  background: vars.color.differenceBackground,
  color: vars.color.differenceText,
});

globalStyle(`.${diff}.${extra}`, {
  background: vars.color.extraBackground,
  color: vars.color.extraText,
});

globalStyle(`.${stats} strong`, { display: 'block', fontSize: '30px' });

globalStyle(`.${answerPanel} .${sectionHeading}`, {
  '@media': {
    '(max-width: 800px)': { flexDirection: 'row', alignItems: 'center' },
  },
});

/** 학습 화면의 포커스 상태를 모바일 재생 영역과 공유한다. */
export const study = style({ minWidth: 0, caretColor: vars.color.accent });

/** 제목 아래에 부가 동작을 모아 학습 시작점을 일정하게 유지한다. */
export const lessonToolbar = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '16px',
  flexWrap: 'wrap',
  marginBottom: '24px',
});

/** 플레이어는 답안과 같은 줄을 사용하되 모바일에서는 먼저 읽힌다. */
export const playerPanel = style({
  minWidth: 0,
  gridColumn: '2',
  gridRow: '1',
  '@media': { '(max-width: 900px)': { gridColumn: '1', gridRow: '1' } },
});

/** 본문을 가리지 않도록 학습 설정을 필요할 때 펼친다. */
export const learningDetails = style({
  borderTop: `1px solid ${vars.color.line}`,
  paddingBlock: '16px',
  marginTop: '16px',
});

/** 확인한 문장만 제한된 높이 안에서 다시 읽게 한다. */
export const transcript = style({
  maxHeight: '280px',
  overflowY: 'auto',
  paddingLeft: '24px',
  overflowWrap: 'anywhere',
});

/** 현재 위치는 전체 결과 수치와 구분해 표시한다. */
export const segmentCount = style({
  fontWeight: 700,
  fontVariantNumeric: 'tabular-nums',
  marginBottom: 0,
});

/** 긴 문장을 입력해도 영상과 균형을 이루는 답안 공간을 확보한다. */
export const answerInput = style({
  minHeight: '280px',
  background: '#f5f7ff',
  borderColor: '#bacaf1',
  borderRadius: '12px',
  padding: '24px',
  fontSize: '28px',
  lineHeight: 1.8,
  '@media': {
    '(max-width: 900px)': {
      minHeight: '114px',
      padding: '14px',
      fontSize: '17px',
    },
  },
});

/** 주 행동을 오른쪽에 두어 보조 동작과 혼동하지 않게 한다. */
export const answerActions = style({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '10px',
});

/** 입력 완료 동작은 넓은 클릭 영역으로 유지한다. */
export const submitButton = style({
  order: 3,
  marginLeft: 'auto',
  minWidth: '178px',
});

/** 구절 표시와 공유를 채점보다 낮은 위계로 묶는다. */
export const secondaryActions = style({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '12px',
  marginTop: '20px',
});

/** 기록 삭제가 일상적인 학습 조작 옆에 노출되지 않게 한다. */
export const videoDetails = style({
  marginTop: '48px',
  paddingTop: '24px',
  borderTop: `1px solid ${vars.color.line}`,
});

globalStyle(`.${answerInput}::placeholder`, { color: vars.color.muted });

globalStyle(`.${study} ::selection`, {
  background: '#dce5ff',
  color: vars.color.ink,
});

globalStyle(`.${study} summary`, { minHeight: '32px', fontWeight: 600 });

globalStyle(`.${study}[data-answer-focused] .${videoFrame}`, {
  '@media': { '(max-width: 900px)': { display: 'none' } },
});

globalStyle(`.${study}[data-answer-focused] .${videoSizeControls}`, {
  '@media': { '(max-width: 900px)': { display: 'none' } },
});

globalStyle(`.${study}[data-answer-focused] .${playerPanel}`, {
  '@media': {
    '(max-width: 900px)': {
      position: 'sticky',
      top: 0,
      zIndex: 2,
      background: vars.color.surface,
    },
  },
});

globalStyle(
  `.${study}[data-answer-focused] .${playerPanel} > p, .${study}[data-answer-focused] .${playerPanel} > details`,
  {
    '@media': { '(max-width: 900px)': { display: 'none' } },
  }
);

/** 보조 도구를 모바일 답안 뒤에 두어 입력 시작을 늦추지 않는다. */
export const learningAuxiliary = style({
  minWidth: 0,
  gridColumn: '2',
  gridRow: '2',
  '@media': { '(max-width: 900px)': { gridColumn: '1', gridRow: '3' } },
});

globalStyle(`.${study}[data-answer-focused] .${learningAuxiliary}`, {
  '@media': { '(max-width: 900px)': { display: 'none' } },
});

/** 모바일 입력 중 사용자가 원할 때 영상 영역을 다시 펼치게 한다. */
export const showVideo = style({
  display: 'none',
  '@media': { '(max-width: 900px)': { display: 'block' } },
});

/** 다시 듣기만 옅은 청색 면으로 강조한다. */
export const replayButton = style({
  background: '#e9effe',
  borderColor: '#e9effe',
});

/** 재생 상태와 보조 조작을 시안처럼 작은 한 줄로 둔다. */
export const playbackMeta = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '8px',
  color: vars.color.muted,
  fontSize: '12px',
  marginTop: '10px',
});

/** 입력 안내는 모드 탭 바로 위의 짧은 설명으로 유지한다. */
export const answerHelp = style({
  margin: '8px 0 24px',
  color: vars.color.muted,
  fontSize: '13px',
});

globalStyle(`.${answerPanel} h2`, {
  fontSize: '28px',
  letterSpacing: '-0.035em',
  '@media': { '(max-width: 900px)': { fontSize: '19px' } },
});

globalStyle(`.${answerPanel} > .${sectionHeading}`, { marginBottom: 0 });
globalStyle(`.${answerInput}`, { margin: 0 });
globalStyle(`.${answerActions}`, { marginTop: '18px' });

globalStyle(`.${controls} select`, {
  minWidth: 0,
  padding: '10px 6px',
  textAlign: 'center',
  fontSize: '13px',
});

globalStyle(`.${playbackMeta} button`, {
  border: 0,
  background: 'transparent',
  color: vars.color.muted,
  cursor: 'pointer',
  minHeight: '36px',
  fontSize: '12px',
  padding: '6px 0',
});

/** 보조 조작이 확인 버튼과 같은 위계로 보이지 않게 한다. */
export const quietButton = style({
  border: 0,
  background: 'transparent',
  padding: '6px 0',
  fontSize: '12px',
  color: vars.color.muted,
});

globalStyle(`.${study}[data-answer-focused] .${answerHelp}`, {
  '@media': { '(max-width: 900px)': { display: 'none' } },
});

/** 재생 조작 크기는 공용 버튼 내부를 덮어쓰지 않고 전달한다. */
export const playbackButton = style({
  width: '100%',
  minWidth: 0,
  padding: '10px 6px',
  minHeight: '44px',
  textAlign: 'center',
  fontSize: '13px',
});

globalStyle(`.${study}[data-answer-focused] .${answerInput}`, {
  '@media': { '(max-width: 900px)': { minHeight: '96px' } },
});
