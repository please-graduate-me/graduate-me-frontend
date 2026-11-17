import { style } from '@vanilla-extract/css';
import { layered } from '@/lib/styles/layers.css';
import { vars } from '@/lib/styles/theme.css';

/** 좁은 화면에서 표만 가로로 스크롤되게 감싼다. */
export const scroll = style(layered({ maxWidth: '100%', overflowX: 'auto' }));

/** 줄 경계가 겹치지 않는 표다. */
export const root = style(
  layered({
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: vars.fontSize.small,
    lineHeight: vars.lineHeight.small,
    color: vars.color.ink,
  })
);

/** 표 설명이다. 화면에서는 감추고 보조 기술에만 읽힌다. */
export const caption = style(
  layered({
    position: 'absolute',
    width: 1,
    height: 1,
    overflow: 'hidden',
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    whiteSpace: 'nowrap',
  })
);
