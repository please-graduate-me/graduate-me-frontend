import { style } from '@vanilla-extract/css';
import { layered } from '@/lib/styles/layers.css';
import { vars } from '@/lib/styles/theme.css';

/** 밑줄 탭을 가로로 나열하고 넘치면 가로 스크롤한다. */
export const root = style(
  layered({
    display: 'flex',
    gap: vars.space.xxs,
    minWidth: 0,
    overflowX: 'auto',
    scrollbarWidth: 'none',
  })
);

/** 탭 줄 아래 전체 폭 구분선이다. */
export const divider = style(
  layered({ boxShadow: `inset 0 -1px 0 ${vars.color.line}` })
);
