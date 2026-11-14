import { style } from '@vanilla-extract/css';
import { layered } from '@/lib/styles/layers.css';
import { vars } from '@/lib/styles/theme.css';

/** 상단 막대와 본문을 세로로 쌓는 화면 틀이다. */
export const shell = style(
  layered({
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100dvh',
    background: vars.color.background,
  })
);

/** 화면 높이에 맞추고 본문만 스크롤하는 틀이다. */
export const fill = style(layered({ height: '100dvh', overflow: 'hidden' }));

/** 본문 영역이다. */
export const main = style(
  layered({
    flex: '1 1 auto',
    minWidth: 0,
    minHeight: 0,
    outline: 'none',
  })
);

/** 화면 높이 고정 틀에서 본문만 스크롤한다. */
export const scroll = style(layered({ overflowY: 'auto' }));

/** 키보드 초점을 받을 때만 보이는 본문 건너뛰기 링크다. */
export const skipLink = style(
  layered({
    position: 'fixed',
    top: vars.space.xs,
    left: vars.space.xs,
    zIndex: 1200,
    padding: `${vars.space.sm} ${vars.space.md}`,
    borderRadius: vars.radius.pill,
    background: vars.color.ink,
    color: vars.color.onAccent,
    fontSize: vars.fontSize.small,
    fontWeight: vars.fontWeight.heavy,
    textDecoration: 'none',
    transform: 'translateY(-200%)',
    selectors: { '&:focus': { transform: 'none' } },
  })
);
