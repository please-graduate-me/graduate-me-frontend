import { keyframes, style } from '@vanilla-extract/css';

const press = keyframes({
  '0%': { opacity: 0, transform: 'scale(1.9) rotate(-28deg)' },
  '55%': { opacity: 1, transform: 'scale(0.9) rotate(-10deg)' },
  '100%': { opacity: 1, transform: 'scale(1) rotate(-12deg)' },
});

/** 위에서 크게 떨어져 비스듬히 찍히는 도장 동작을 주고 모션 축소 설정에서는 정지한다. */
export const stamp = style({
  flex: 'none',
  transform: 'rotate(-12deg)',
  animation: `${press} 500ms cubic-bezier(0.3, 1.4, 0.5, 1) 150ms both`,
  '@media': {
    '(prefers-reduced-motion: reduce)': { animation: 'none' },
  },
});

/** 번진 도장은 찍히는 동작 없이 감싼 요소의 흔들림만 따른다. */
export const faded = style({ flex: 'none' });
