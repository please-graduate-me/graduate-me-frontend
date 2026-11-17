import { style } from '@vanilla-extract/css';
import { layered } from '@/lib/styles/layers.css';
import { vars } from '@/lib/styles/theme.css';

/** 열 제목을 작은 보조색 글자와 아래 구분선으로 표시한다. */
export const root = style(
  layered({
    padding: `${vars.space.sm} ${vars.space.compact}`,
    borderBottom: `1px solid ${vars.color.lineStrong}`,
    color: vars.color.muted,
    fontSize: vars.fontSize.label,
    fontWeight: vars.fontWeight.bold,
    textAlign: 'start',
    whiteSpace: 'nowrap',
  })
);
