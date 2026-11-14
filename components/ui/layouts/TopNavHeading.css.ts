import { style } from '@vanilla-extract/css';
import { layered } from '@/lib/styles/layers.css';
import { vars } from '@/lib/styles/theme.css';

/** 로고와 서비스 이름을 묶은 홈 링크다. */
export const root = style(
  layered({
    display: 'inline-flex',
    alignItems: 'center',
    gap: vars.space.sm,
    flexShrink: 0,
    minHeight: 44,
    color: vars.color.ink,
    fontSize: vars.fontSize.lead,
    fontWeight: vars.fontWeight.heavy,
    letterSpacing: '-0.02em',
    lineHeight: 1.2,
    textDecoration: 'none',
    whiteSpace: 'nowrap',
  })
);

/** 아주 좁은 화면에서는 서비스 이름을 숨기고 로고만 남긴다. */
export const text = style(
  layered({
    '@media': {
      'screen and (max-width: 419px)': {
        position: 'absolute',
        width: 1,
        height: 1,
        overflow: 'hidden',
        clip: 'rect(0 0 0 0)',
        whiteSpace: 'nowrap',
      },
    },
  })
);
