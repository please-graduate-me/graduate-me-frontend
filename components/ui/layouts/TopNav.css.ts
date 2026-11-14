import { style } from '@vanilla-extract/css';
import { layered } from '@/lib/styles/layers.css';
import { vars } from '@/lib/styles/theme.css';

/** 좁은 화면에서 탐색 메뉴를 접는 기준이다. */
export const compact = 'screen and (max-width: 759px)';

/** 화면 위에 붙는 흰 64px 상단 막대다. */
export const header = style(
  layered({
    position: 'sticky',
    top: 0,
    zIndex: 900,
    height: vars.layout.topbar,
    borderBottom: `1px solid ${vars.color.line}`,
    background: vars.color.surface,
  })
);

/** 1120px 폭 안에 로고, 메뉴, 끝 내용을 한 줄로 둔다. */
export const inner = style(
  layered({
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: vars.space.lg,
    maxWidth: 1120,
    height: '100%',
    margin: '0 auto',
    padding: `0 ${vars.space.lg}`,
    '@media': {
      [compact]: { gap: vars.space.compact, padding: `0 ${vars.space.md}` },
    },
  })
);

/** 넓은 화면의 가로 메뉴이며 좁은 화면에서는 메뉴 버튼으로 여는 패널이 된다. */
export const items = style(
  layered({
    display: 'flex',
    alignItems: 'center',
    gap: vars.space.xxs,
    flex: '1 1 auto',
    minWidth: 0,
    '@media': {
      [compact]: {
        position: 'absolute',
        top: 'calc(100% + 1px)',
        right: 0,
        left: 0,
        display: 'none',
        flexDirection: 'column',
        alignItems: 'stretch',
        gap: vars.space.xxs,
        maxHeight: `calc(100dvh - ${vars.layout.topbar})`,
        padding: `${vars.space.sm} ${vars.space.md} ${vars.space.md}`,
        borderBottom: `1px solid ${vars.color.line}`,
        background: vars.color.surface,
        boxShadow: vars.shadow.lift,
        overflowY: 'auto',
      },
    },
  })
);

/** 좁은 화면에서 메뉴 패널을 연 상태다. */
export const open = style(
  layered({ '@media': { [compact]: { display: 'flex' } } })
);

/** 오른쪽 끝의 성장 정보, 계정, 메뉴 버튼 묶음이다. */
export const end = style(
  layered({
    display: 'flex',
    alignItems: 'center',
    gap: vars.space.xs,
    flexShrink: 0,
    marginLeft: 'auto',
  })
);

/** 좁은 화면에서만 보이는 메뉴 열기 버튼이다. */
export const toggle = style(
  layered({
    // 공통 버튼의 display보다 앞서도록 요소 선택자로 우선순위를 높인다.
    selectors: { 'button&': { display: 'none' } },
    '@media': {
      [compact]: { selectors: { 'button&': { display: 'inline-flex' } } },
    },
  })
);
