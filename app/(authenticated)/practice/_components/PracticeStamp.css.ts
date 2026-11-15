import { keyframes, style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

const stamp = keyframes({
  '0%': { opacity: 0, transform: 'scale(1.9) rotate(-28deg)' },
  '55%': { opacity: 1, transform: 'scale(0.9) rotate(-10deg)' },
  '100%': { opacity: 1, transform: 'scale(1) rotate(-12deg)' },
});

/** 완료 순간 도장을 찍듯 기울어진 채 내려앉는다. */
export const root = style({
  flex: '0 0 auto',
  transform: 'rotate(-12deg)',
  animation: `${stamp} 500ms ${vars.motion.spring} 150ms both`,
  '@media': {
    '(prefers-reduced-motion: reduce)': { animation: 'none' },
  },
});

/** 바깥 원은 흰 바탕에 청록 테두리다. */
export const outer = style({
  fill: vars.color.surface,
  stroke: vars.color.accent,
});

/** 가운데 원은 청록으로 채운다. */
export const inner = style({ fill: vars.color.accent });

/** 둘레 문구는 청록 숫자 글꼴이다. */
export const ring = style({
  fill: vars.color.accent,
  fontFamily: vars.font.numeric,
});

/** 가운데 표기는 흰 숫자 글꼴이다. */
export const mark = style({
  fill: vars.color.onAccent,
  fontFamily: vars.font.numeric,
});
