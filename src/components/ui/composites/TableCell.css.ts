import { style } from '@vanilla-extract/css';
import { layered } from '@/lib/styles/layers.css';
import { vars } from '@/lib/styles/theme.css';

/** 자료 칸의 여백과 행 구분선이다. */
export const root = style(
  layered({
    padding: vars.space.compact,
    borderBottom: `1px solid ${vars.color.line}`,
    verticalAlign: 'middle',
  })
);
