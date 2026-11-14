import { style } from '@vanilla-extract/css';
import { layered } from '@/lib/styles/layers.css';
import { vars } from '@/lib/styles/theme.css';

/** 본문 속 링크를 강조색으로 표시하고 가리킬 때 밑줄로 위치를 알린다. */
export const root = style(
  layered({
    color: vars.color.accent,
    fontWeight: vars.fontWeight.bold,
    textDecoration: 'none',
    textUnderlineOffset: '0.2em',
    borderRadius: vars.radius.small,
    transition: `color ${vars.motion.fast} ${vars.motion.easeOut}`,
    selectors: {
      '&:hover': { color: vars.color.accentHover, textDecoration: 'underline' },
    },
    '@media': {
      '(prefers-reduced-motion: reduce)': { transition: 'none' },
    },
  })
);
