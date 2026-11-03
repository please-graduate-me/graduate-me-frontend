import { style, globalStyle } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 답안 영역의 반응형 규칙이 다른 패널에 번지지 않게 한다. */
export const answerPanel = style({});

/** 문장 속 빈칸 입력이 서로 겹치지 않도록 읽기 간격을 확보한다. */
export const blankSentence = style([
  {
    lineHeight: '2.8',
    fontSize: '19px',
    margin: '18px 0 24px',
  },
]);

/** 학습 종료 후 비어 있는 플레이어 열까지 결과 화면이 사용하게 한다. */
export const completion = style([{ gridColumn: '1 / -1' }]);

/** 재생 조작을 영상과 설명 사이에서 구분하게 한다. */
export const controls = style([{ margin: '18px 0 12px' }]);

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

/** 영역의 성격을 제목보다 낮은 위계로 전달한다. */
export const eyebrow = style([
  {
    color: vars.color.accent,
    fontWeight: '700',
    fontSize: '13px',
    marginBottom: '10px',
  },
]);

/** 긴 영상 제목이 학습 화면의 조작 영역을 압도하지 않게 한다. */
export const lessonTitle = style([
  { fontSize: '25px', letterSpacing: '-.5px' },
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
        flexDirection: 'column',
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

/** 기본 영상을 크게 표시할 수 있도록 재생과 입력을 위아래로 배치한다. */
export const studyGrid = style([
  {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr)',
    gap: '24px',
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
    minHeight: '200px',
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
