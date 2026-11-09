import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 영상과 스크립트가 데스크톱 학습 창 전체를 사용하게 한다. */
export const study = style({
  minWidth: 1120,
  color: vars.color.ink,
  background: vars.color.surface,
  minHeight: '100vh',
  borderTop: `4px solid ${vars.color.accent}`,
});

/** 학습을 떠나는 동작과 현재 자료를 한 줄에서 확인한다. */
export const header = style({
  height: 80,
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.md,
  paddingInline: vars.space.lg,
  borderBottom: `1px solid ${vars.color.line}`,
});

/** 자료 제목이 길어져도 종료 동작은 유지한다. */
export const headerTitle = style({ flex: 1, minWidth: 0 });

/** 목록 복귀는 작은 화살표로 표현한다. */
export const backLink = style({
  display: 'grid',
  placeItems: 'center',
  width: 36,
  height: 36,
  color: vars.color.muted,
});

/** 종료는 학습 입력과 분리된 테두리 링크로 표시한다. */
export const exitLink = style({
  padding: '10px 16px',
  border: `1px solid ${vars.color.line}`,
  borderRadius: vars.radius.control,
  textDecoration: 'none',
  color: vars.color.ink,
  fontSize: 14,
});

/** 영상과 입력은 왼쪽, 스크립트는 오른쪽에 고정한다. */
export const studyGrid = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(620px, 1fr) 380px',
  alignItems: 'start',
});

/** 영상과 답안을 같은 배경에서 이어 읽게 한다. */
export const main = style({
  padding: vars.space.xl,
  background: vars.color.canvas,
  minWidth: 0,
  minHeight: 'calc(100vh - 84px)',
});

/** 플레이어 오류를 원본 영상 가까이 표시한다. */
export const playerPanel = style({ minWidth: 0 });

/** 준비 전에도 영상 비율과 크기를 유지한다. */
export const videoFrame = style({
  position: 'relative',
  width: '100%',
  aspectRatio: '16 / 9',
  borderRadius: vars.radius.control,
  overflow: 'hidden',
  background: vars.color.video,
});

/** 재생과 속도 및 반복을 실제 컨트롤로 모은다. */
export const playbackToolbar = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  padding: '10px 12px',
  background: vars.color.surface,
  borderRadius: vars.radius.control,
  marginTop: vars.space.md,
});

/** 구절 위치는 일정한 숫자 폭으로 유지한다. */
export const time = style({
  color: vars.color.muted,
  fontSize: 12,
  whiteSpace: 'nowrap',
  fontVariantNumeric: 'tabular-nums',
});

/** 현재 구절의 전체 위치를 재생 탐색과 혼동하지 않게 표시한다. */
export const progress = style({
  accentColor: vars.color.accent,
  height: 5,
  flex: 1,
  minWidth: 70,
});

/** 자동 반복은 입력 가능한 체크박스로 제공한다. */
export const repeatControl = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.xs,
  fontSize: 12,
  whiteSpace: 'nowrap',
});

/** 받아쓰기 영역을 얇은 테두리 패널로 분리한다. */
export const answerPanel = style({
  marginTop: vars.space.md,
  padding: vars.space.lg,
  background: vars.color.surface,
  border: `1px solid ${vars.color.line}`,
  borderRadius: vars.radius.panel,
});

/** 구절 번호와 반복 및 저장 상태를 같은 기준선에 놓는다. */
export const answerHeading = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  marginBottom: vars.space.md,
});

/** 저장 상태를 구절 제목보다 낮은 위계로 표시한다. */
export const saveStatus = style({
  color: vars.color.muted,
  fontSize: 12,
  marginLeft: 'auto',
});

/** 학습 모드와 스크립트를 하나의 탭 줄로 맞춘다. */
export const modeRow = style({
  display: 'flex',
  alignItems: 'start',
  borderBottom: `1px solid ${vars.color.line}`,
  marginBottom: vars.space.md,
  gap: vars.space.lg,
});

/** 정답 공개를 요청하는 스크립트 탭을 제공한다. */
export const scriptTab = style({
  border: 0,
  borderBottom: '2px solid transparent',
  background: 'transparent',
  color: vars.color.muted,
  minHeight: 44,
  padding: '12px 0',
  fontSize: 14,
  cursor: 'pointer',
  selectors: {
    '&[aria-pressed="true"]': {
      color: vars.color.accent,
      borderBottomColor: vars.color.accent,
    },
  },
});

/** 문장 속 빈칸을 본문과 같은 읽기 흐름으로 정렬한다. */
export const blankSentence = style({
  paddingBlock: '12px 18px',
  lineHeight: 2.7,
  fontSize: 16,
  minHeight: 84,
});

/** 문장 전체 입력도 시안의 간결한 입력 패널을 유지한다. */
export const answerInput = style({
  minHeight: 130,
  padding: vars.space.md,
  lineHeight: 1.8,
  fontSize: 17,
});

/** 답안을 제출하는 행동과 보조 안내를 가깝게 둔다. */
export const answerActions = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  marginTop: vars.space.md,
});

/** 학습 선택과 이동을 제출 동작에서 분리한다. */
export const secondaryActions = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  marginTop: vars.space.lg,
});

/** 이전과 다음 구절 이동은 오른쪽 끝에 모은다. */
export const navigation = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.xs,
  marginLeft: 'auto',
});

/** 스크립트는 입력 영역과 같은 높이에서 읽게 한다. */
export const scriptReading = style({
  paddingBlock: vars.space.sm,
  lineHeight: 1.9,
  minHeight: 130,
});

/** 자주 쓰지 않는 학습 옵션은 접힌 보조 영역에 둔다. */
export const learningDetails = style({
  marginTop: vars.space.lg,
  paddingTop: vars.space.md,
  borderTop: `1px solid ${vars.color.line}`,
});

/** 완료 상태는 비어 있는 플레이어 대신 결과를 표시한다. */
export const completion = style({ padding: vars.space.xl, minHeight: 400 });

/** 실제 완료 숫자를 같은 단위로 비교하게 한다. */
export const stats = style({
  display: 'flex',
  gap: vars.space.xl,
  marginBlock: vars.space.lg,
});

/** 안내는 상태와 문구로 표현한다. */
export const notice = style({
  padding: '12px 16px',
  background: vars.color.notice,
  borderRadius: vars.radius.control,
  marginBlock: vars.space.md,
  fontSize: 14,
  lineHeight: 1.7,
});

/** 실패는 안내와 구분해 입력 가까이 표시한다. */
export const error = style({
  padding: '12px 16px',
  background: vars.color.errorBackground,
  color: vars.color.error,
  borderRadius: vars.radius.control,
  marginBlock: vars.space.md,
});

/** 정답 피드백의 의미를 성공 배경으로 보완한다. */
export const success = style({ background: vars.color.success });

/** 단어별 비교가 긴 문장에서도 줄바꿈되게 한다. */
export const differences = style({
  display: 'flex',
  gap: vars.space.xs,
  flexWrap: 'wrap',
});

/** 개별 차이를 읽을 수 있는 최소 여백을 둔다. */
export const diff = style({ padding: '3px 7px', borderRadius: 4 });

/** 맞힌 단어는 수정 대상에서 구분한다. */
export const match = style({ color: vars.color.match });

/** 빠뜨린 단어를 실제 정답과 함께 표시한다. */
export const missing = style({
  color: vars.color.differenceText,
  background: vars.color.differenceBackground,
});

/** 교체할 단어를 실제 정답과 함께 표시한다. */
export const replace = style({
  color: vars.color.differenceText,
  background: vars.color.differenceBackground,
});

/** 추가한 단어는 빠뜨린 단어와 구분한다. */
export const extra = style({
  color: vars.color.extraText,
  background: vars.color.extraBackground,
});

/** 보조 설명은 읽기 위계를 낮춘다. */
export const muted = style({ color: vars.color.muted });

/** 시간과 단축키는 본문보다 작은 크기를 쓴다. */
export const small = style({ fontSize: 12, color: vars.color.muted });

globalStyle(`${headerTitle} h1`, { fontSize: 18, margin: 0, lineHeight: 1.5 });

globalStyle(`${headerTitle} p`, {
  color: vars.color.muted,
  fontSize: 12,
  margin: '4px 0 0',
});

globalStyle(`${videoFrame} iframe`, {
  position: 'absolute',
  inset: 0,
  border: 0,
  width: '100%',
  height: '100%',
});

globalStyle(`${playbackToolbar} select`, {
  width: 90,
  minHeight: 32,
  fontSize: 12,
});

globalStyle(`${blankSentence} input`, {
  width: 160,
  display: 'inline-block',
  marginInline: vars.space.xs,
  padding: '6px 10px',
  borderRadius: vars.radius.control,
  border: `1px solid ${vars.color.line}`,
  background: vars.color.selected,
  color: vars.color.accent,
  fontSize: 15,
});

globalStyle(`${stats} strong`, { display: 'block', fontSize: 30 });
