import { globalStyle, style } from '@vanilla-extract/css';
import { layered } from '@/lib/styles/layers.css';
import { vars } from '@/lib/styles/theme.css';

/** 목록 기본 표시를 지우고 항목을 세로로 쌓는다. */
export const root = style(
  layered({
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    margin: 0,
    padding: 0,
    listStyle: 'none',
  })
);

/** 항목 사이에 구분선을 넣는 목록이다. */
export const dividers = style(layered({ gap: 0 }));

/** 글머리 점을 붙이는 목록이다. */
export const disc = style(layered({ gap: vars.space.xxs }));

// 구분선 사이 항목이 둥글면 선과 바탕 모서리가 어긋나므로 직각으로 맞춘다.
globalStyle(`${dividers} > li`, layered({ borderRadius: 0 }));

globalStyle(
  `${dividers} > li + li`,
  layered({ borderTop: `1px solid ${vars.color.line}` })
);

globalStyle(`${disc} > li`, layered({ paddingBlock: vars.space.xxs }));

// 항목은 flex 배치라 브라우저 글머리가 사라지므로 첫 줄 가운데에 점을 직접 그린다.
globalStyle(
  `${disc} > li::before`,
  layered({
    content: '""',
    flexShrink: 0,
    alignSelf: 'flex-start',
    width: vars.space.xs,
    height: vars.space.xs,
    marginTop: `calc(${vars.lineHeight.small} / 2 - ${vars.space.xs} / 2)`,
    borderRadius: '50%',
    background: vars.color.subtle,
  })
);
