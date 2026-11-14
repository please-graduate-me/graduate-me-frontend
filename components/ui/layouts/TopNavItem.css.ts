import { style } from '@vanilla-extract/css';
import { layered } from '@/lib/styles/layers.css';
import { vars } from '@/lib/styles/theme.css';

const compact = 'screen and (max-width: 759px)';

/** 넓은 화면에서는 선택 시 먹색 밑줄, 접힌 패널에서는 회색 바탕 줄로 보이는 메뉴 링크다. */
export const item = style(
  layered({
    display: 'inline-flex',
    alignItems: 'center',
    gap: vars.space.xs,
    flexShrink: 0,
    minHeight: 44,
    padding: `0 ${vars.space.compact}`,
    borderBottom: '2px solid transparent',
    color: vars.color.muted,
    fontSize: vars.fontSize.small,
    fontWeight: vars.fontWeight.bold,
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    transition: `color ${vars.motion.fast} ${vars.motion.easeOut}`,
    selectors: {
      '&:hover': { color: vars.color.ink },
      '&[aria-current="page"]': {
        color: vars.color.ink,
        borderBottomColor: vars.color.ink,
      },
    },
    '@media': {
      [compact]: {
        display: 'flex',
        minHeight: 48,
        borderBottom: 0,
        borderRadius: vars.radius.small,
        fontSize: vars.fontSize.body,
        selectors: {
          '&[aria-current="page"]': { background: vars.color.canvas },
        },
      },
      '(prefers-reduced-motion: reduce)': { transition: 'none' },
    },
  })
);
