import { style } from '@vanilla-extract/css';
import { layered } from '@/lib/styles/layers.css';
import { vars } from '@/lib/styles/theme.css';

/** 화면의 한 영역 안 내용을 세로로 쌓는다. */
export const root = style(
  layered({
    display: 'flex',
    flexDirection: 'column',
    gap: vars.space.md,
    minWidth: 0,
    background: vars.color.surface,
  })
);

/** 뒤 배경을 그대로 비친다. */
export const transparent = style(layered({ background: 'transparent' }));

/** 앞 영역과 위 구분선으로 나눈다. */
export const dividerTop = style(
  layered({
    paddingTop: vars.space.lg,
    borderTop: `1px solid ${vars.color.line}`,
  })
);
