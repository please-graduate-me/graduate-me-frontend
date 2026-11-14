import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 내 기록 카드와 다음 행동 카드를 오른쪽 열에 세로로 쌓는다. */
export const root = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.md,
  minWidth: 0,
});

/** 카드 안 요소 간격만 정하고 외형은 Astryx Card에 맡긴다. */
export const panel = style({
  display: 'grid',
  gap: vars.space.md,
  minWidth: 0,
});

/** 시안의 2열 수치 타일을 좁은 열에서도 유지한다. */
export const tiles = style({
  margin: 0,
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: vars.space.compact,
});

/** 각 수치를 옅은 회색 바탕 타일로 묶는다. */
export const tile = style({
  padding: 14,
  borderRadius: 14,
  background: vars.color.canvas,
  minWidth: 0,
});

/** 타일 이름은 수치보다 낮은 위계로 둔다. */
export const tileLabel = style({
  fontSize: vars.fontSize.caption,
  fontWeight: 700,
  color: vars.color.muted,
});

/** 타일 수치를 가장 먼저 읽히게 크게 둔다. */
export const tileValue = style({
  margin: '4px 0 0',
  fontSize: 22,
  fontWeight: 700,
  lineHeight: 1.3,
  fontVariantNumeric: 'tabular-nums',
  overflowWrap: 'anywhere',
});

/** 레벨 제목, 누적 기록, 진행률을 촘촘하게 묶는다. */
export const level = style({
  display: 'grid',
  gap: vars.space.xs,
  paddingTop: vars.space.md,
  borderTop: `1px solid ${vars.color.line}`,
});

/** 다음 학습을 권하는 카드는 어두운 바탕으로 다른 정보와 구분한다. */
export const nudge = style({
  display: 'grid',
  gap: vars.space.sm,
  padding: vars.space.comfortable,
  borderRadius: 18,
  background: '#16181D',
  color: '#FFFFFF',
});

/** 수치 이름과 큰 수치를 한 문장으로 읽히게 위아래로 놓는다. */
export const goal = style({ margin: 0, display: 'grid', gap: vars.space.xxs });

/** 어두운 바탕에서 수치 이름을 보조 위계로 둔다. */
export const goalLabel = style({
  fontSize: 13,
  fontWeight: 700,
  color: '#B9BCC5',
});

/** 다음 레벨까지 남은 XP를 카드에서 가장 크게 보여 준다. */
export const goalValue = style({
  fontSize: 26,
  fontWeight: 700,
  lineHeight: 1.2,
  fontVariantNumeric: 'tabular-nums',
});

/** 어두운 바탕에서 안내 문장을 제목보다 옅게 둔다. */
export const hint = style({
  margin: '0 0 6px',
  fontSize: vars.fontSize.small,
  lineHeight: 1.55,
  color: '#D6D8DD',
});

/** 버튼을 카드 너비에 맞추되 버튼 자체 외형은 건드리지 않는다. */
export const action = style({ display: 'grid' });
