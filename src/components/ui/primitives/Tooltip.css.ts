import { keyframes, style } from '@vanilla-extract/css';
import { layered } from '@/lib/styles/layers.css';
import { vars } from '@/lib/styles/theme.css';

const appear = keyframes({
  from: { opacity: 0, transform: 'translateY(2px)' },
  to: { opacity: 1, transform: 'none' },
});

/** 먹색 바탕의 짧은 설명 말풍선이다. */
export const content = style(
  layered({
    zIndex: 1100,
    maxWidth: 280,
    padding: `${vars.space.xs} ${vars.space.sm}`,
    borderRadius: vars.radius.small,
    background: vars.color.ink,
    color: vars.color.onAccent,
    boxShadow: vars.shadow.popover,
    fontSize: vars.fontSize.label,
    fontWeight: vars.fontWeight.medium,
    lineHeight: vars.lineHeight.caption,
    overflowWrap: 'anywhere',
    pointerEvents: 'none',
    animation: `${appear} ${vars.motion.fast} ${vars.motion.easeOut}`,
    '@media': {
      '(prefers-reduced-motion: reduce)': { animation: 'none' },
    },
  })
);

/** 외부 기준 요소에 붙는 말풍선은 화면 좌표로 고정한다. */
export const anchored = style(layered({ position: 'fixed', top: 0, left: 0 }));
