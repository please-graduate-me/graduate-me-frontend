import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 고리는 줄어들지 않고 자기 크기를 지킨다. */
export const root = style({ flex: '0 0 auto' });

/** 고리 바탕 원이다. */
export const track = style({ stroke: vars.color.line });

/** 정답률만큼 채우는 고리이며 조건이 바뀌면 길이가 부드럽게 바뀐다. */
export const value = style({
  stroke: vars.color.accentBright,
  transition: `stroke-dasharray 600ms ${vars.motion.easeOut}`,
  '@media': {
    '(prefers-reduced-motion: reduce)': { transition: 'none' },
  },
});

/** 고리 가운데 백분율이다. */
export const label = style({
  fill: vars.color.ink,
  fontFamily: vars.font.numeric,
  fontSize: 20,
  fontWeight: vars.fontWeight.bold,
});
