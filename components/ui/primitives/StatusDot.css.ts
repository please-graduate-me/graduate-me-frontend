import { keyframes, style, styleVariants } from '@vanilla-extract/css';
import { layered } from '@/lib/styles/layers.css';
import { vars } from '@/lib/styles/theme.css';

const pulse = keyframes({
  '0%': { boxShadow: '0 0 0 0 currentColor' },
  '70%': { boxShadow: '0 0 0 6px transparent' },
  '100%': { boxShadow: '0 0 0 0 transparent' },
});

/** 상태 색을 보여 주는 작은 원이다. */
export const root = style(
  layered({
    display: 'inline-block',
    flexShrink: 0,
    width: vars.space.sm,
    height: vars.space.sm,
    borderRadius: '50%',
    background: 'currentColor',
  })
);

/** 상태 의미마다 원의 색을 정한다. */
export const variant = styleVariants(
  {
    neutral: { color: vars.color.subtle },
    success: { color: vars.color.accentBright },
    warning: { color: vars.color.streakBright },
    error: { color: vars.color.error },
  },
  layered
);

/** 진행 중인 상태를 퍼지는 고리로 알리고, 모션 축소 설정에서는 멈춘다. */
export const pulsing = style(
  layered({
    animation: `${pulse} 1.6s ${vars.motion.easeOut} infinite`,
    '@media': {
      '(prefers-reduced-motion: reduce)': { animation: 'none' },
    },
  })
);
