import { keyframes, style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

const reducedMotion = '(prefers-reduced-motion: reduce)';

const rise = keyframes({
  from: { opacity: 0, transform: 'translateY(8px)' },
  to: { opacity: 1, transform: 'none' },
});

/** 선택 조건의 요약 카드이며 다시 조회하면 아래에서 떠오른다. */
export const root = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 22,
  padding: vars.space.lg,
  borderRadius: 24,
  animation: `${rise} ${vars.motion.slow} ${vars.motion.easeOut} both`,
  '@media': { [reducedMotion]: { animation: 'none' } },
});

/** 요약 제목이다. */
export const title = style({ fontSize: 22 });

/** 집계 시작 시각과 표본 수다. */
export const since = style({
  marginTop: vars.space.xs,
  color: '#33363F',
  fontSize: vars.fontSize.small,
});

/** 정답률과 숫자 지표를 나란히 두고 좁으면 감싼다. */
export const figures = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'stretch',
  gap: vars.space.lg,
});

/** 정답률 고리와 설명을 회색 면에 담는다. */
export const accuracy = style({
  flex: '1 1 220px',
  display: 'flex',
  alignItems: 'center',
  gap: 18,
  padding: 18,
  borderRadius: vars.radius.panel,
  background: vars.color.canvas,
});

/** 정답률 이름표다. */
export const accuracyLabel = style({
  fontSize: vars.fontSize.label,
  fontWeight: vars.fontWeight.heavy,
});

/** 정답률 근거 문장이다. */
export const accuracyText = style({
  marginTop: vars.space.xxs,
  fontSize: vars.fontSize.small,
  lineHeight: 1.6,
});

/** 학습한 날, 전체 제출, 도움 사용 제외를 세 칸으로 둔다. */
export const stats = style({
  flex: '2 1 360px',
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: vars.space.compact,
  margin: 0,
});

/** 지표 한 칸이다. */
export const stat = style({
  padding: vars.space.md,
  border: `1px solid ${vars.color.line}`,
  borderRadius: 16,
});

/** 지표 이름이다. */
export const statLabel = style({
  color: vars.color.muted,
  fontSize: vars.fontSize.caption,
  fontWeight: vars.fontWeight.bold,
});

/** 지표 값은 숫자 글꼴로 크게 둔다. */
export const statValue = style({
  margin: '6px 0 0',
  fontFamily: vars.font.numeric,
  fontSize: 26,
  fontWeight: vars.fontWeight.bold,
});

/** 지표 단위는 작고 옅게 둔다. */
export const unit = style({
  color: vars.color.muted,
  fontSize: vars.fontSize.small,
});

/** 막대 그림과 설명을 묶는다. */
export const figure = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.sm,
  margin: 0,
});

/** 그림 제목이다. */
export const caption = style({
  fontSize: vars.fontSize.small,
  fontWeight: vars.fontWeight.heavy,
});

/** 제출 구성을 한 줄 누적 막대로 보여 준다. */
export const stack = style({
  display: 'flex',
  gap: 2,
  height: 28,
  borderRadius: 6,
  overflow: 'hidden',
  // 구간 사이 2px 틈이 흰 줄로 보이도록 바탕을 카드와 같은 흰색으로 둔다.
  background: vars.color.surface,
});

/** 누적 막대 한 구간이며 너비는 컴포넌트가 비율로 넘긴다. */
export const segment = style({
  height: '100%',
  transition: `width 500ms ${vars.motion.easeOut}`,
  selectors: {
    '&[data-kind="correct"]': { background: vars.color.accentBright },
    '&[data-kind="wrong"]': { background: vars.color.streakBright },
    '&[data-kind="excluded"]': { background: vars.color.inputBorder },
  },
  '@media': { [reducedMotion]: { transition: 'none' } },
});

/** 누적 막대 범례다. */
export const legend = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: `8px ${vars.space.comfortable}`,
  margin: 0,
  padding: 0,
  listStyle: 'none',
  color: '#33363F',
  fontSize: vars.fontSize.label,
  fontWeight: vars.fontWeight.bold,
});

/** 범례 한 항목이다. */
export const legendItem = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
});

/** 범례 색 견본이다. */
export const swatch = style({
  width: 12,
  height: 12,
  borderRadius: 3,
  selectors: {
    '&[data-kind="correct"]': { background: vars.color.accentBright },
    '&[data-kind="wrong"]': { background: vars.color.streakBright },
    '&[data-kind="excluded"]': { background: vars.color.inputBorder },
  },
});

/** 범례 수치는 숫자 글꼴로 둔다. */
export const legendValue = style({
  color: vars.color.ink,
  fontFamily: vars.font.numeric,
});

/** 오답 차이 분류의 이름, 막대, 횟수를 한 줄씩 둔다. */
export const categories = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  margin: 0,
  padding: 0,
  listStyle: 'none',
});

/** 분류 한 줄이다. */
export const categoryRow = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(96px, 140px) minmax(0, 1fr) 44px',
  alignItems: 'center',
  gap: vars.space.compact,
});

/** 분류 이름이다. */
export const categoryName = style({
  color: '#33363F',
  fontSize: vars.fontSize.label,
  fontWeight: vars.fontWeight.bold,
  overflowWrap: 'anywhere',
});

/** 분류 막대 트랙이다. */
export const categoryTrack = style({
  height: 14,
  borderRadius: '0 4px 4px 0',
  background: vars.color.canvas,
  overflow: 'hidden',
});

/** 분류 막대이며 가장 많은 분류를 기준으로 너비를 넘긴다. */
export const categoryBar = style({
  display: 'block',
  height: '100%',
  borderRadius: '0 4px 4px 0',
  background: vars.color.streakBright,
  transition: `width 500ms ${vars.motion.easeOut}`,
  '@media': { [reducedMotion]: { transition: 'none' } },
});

/** 분류 횟수다. */
export const categoryCount = style({
  fontFamily: vars.font.numeric,
  fontSize: vars.fontSize.label,
  fontWeight: vars.fontWeight.bold,
  textAlign: 'right',
});

/** 집계 기준을 구분선 아래 작게 둔다. */
export const basis = style({
  paddingTop: 14,
  borderTop: `1px solid ${vars.color.line}`,
  fontSize: vars.fontSize.caption,
  lineHeight: 1.6,
});
