import { style } from '@vanilla-extract/css';
import { layered } from '@/lib/styles/layers.css';
import { vars } from '@/lib/styles/theme.css';

/** 선택되면 흰 바탕으로 떠오르는 알약 항목이며 전역 글자 초기화를 이기도록 글자 속성만 계층 밖에 둔다. */
export const item = style({
  color: vars.color.muted,
  fontSize: vars.fontSize.small,
  fontWeight: vars.fontWeight.bold,
  lineHeight: 1.2,
  selectors: {
    '&:hover:not(:disabled)': { color: vars.color.ink },
    '&[aria-checked="true"]': { color: vars.color.ink },
    '&:disabled': { color: vars.color.subtle },
  },
  ...layered({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: vars.space.xs,
    flexShrink: 0,
    minHeight: 36,
    margin: 0,
    padding: `0 ${vars.space.md}`,
    border: 0,
    borderRadius: vars.radius.pill,
    background: 'transparent',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    transition: `background-color ${vars.motion.fast} ${vars.motion.easeOut}, box-shadow ${vars.motion.fast} ${vars.motion.easeOut}`,
    selectors: {
      '&[aria-checked="true"]': {
        background: vars.color.surface,
        boxShadow: vars.shadow.lift,
      },
      '&:disabled': { cursor: 'not-allowed' },
    },
    '@media': {
      '(prefers-reduced-motion: reduce)': { transition: 'none' },
    },
  }),
});
