import { keyframes, style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

const appear = keyframes({
  from: { opacity: 0, transform: 'translateX(-6px)' },
  to: { opacity: 1, transform: 'none' },
});

/** 반복 흐름 미리보기의 회색 띠다. */
export const preview = style({
  margin: '6px 0 4px',
  padding: vars.space.md,
  borderRadius: vars.radius.panel,
  background: vars.color.canvas,
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: vars.space.xs,
});

const chip = {
  padding: '6px 10px',
  borderRadius: vars.radius.small,
  fontFamily: vars.font.numeric,
  fontSize: vars.fontSize.caption,
  fontWeight: vars.fontWeight.bold,
  whiteSpace: 'nowrap',
} as const;

/** 처음 한 번 듣기를 먹색 칩으로 시작점에 둔다. */
export const first = style({
  ...chip,
  background: vars.color.ink,
  color: vars.color.onAccent,
});

/** 연결선과 반복 칩을 한 덩어리로 줄바꿈하고 설정이 바뀌면 옆에서 밀려 들어온다. */
export const step = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space.xs,
  animation: `${appear} 240ms ${vars.motion.easeOut}`,
  '@media': { '(prefers-reduced-motion: reduce)': { animation: 'none' } },
});

/** 칩 사이의 반복 흐름 연결선이다. */
export const connector = style({
  width: 18,
  height: 2,
  flex: 'none',
  background: vars.color.inputBorder,
});

/** 추가 반복을 청록 칩으로 표시한다. */
export const loop = style({
  ...chip,
  background: vars.color.selected,
  color: vars.color.accent,
});
