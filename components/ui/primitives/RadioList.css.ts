import { style, styleVariants } from '@vanilla-extract/css';
import { layered } from '@/lib/styles/layers.css';
import { vars } from '@/lib/styles/theme.css';

/** 질문과 선택지를 세로로 묶는다. */
export const root = style(
  layered({
    display: 'grid',
    gap: vars.space.sm,
    minWidth: 0,
    margin: 0,
    padding: 0,
    border: 0,
  })
);

/** 선택지 위의 질문 문구다. */
export const legend = style(
  layered({
    marginBottom: vars.space.xxs,
    padding: 0,
    color: vars.color.ink,
    fontSize: vars.fontSize.small,
    fontWeight: vars.fontWeight.bold,
    lineHeight: vars.lineHeight.small,
  })
);

/** 세로 목록이나 폭이 좁으면 줄바꿈되는 가로 타일로 선택지를 놓는다. */
export const options = styleVariants({
  list: layered({ display: 'grid', gap: vars.space.xs }),
  tile: layered({ display: 'flex', flexWrap: 'wrap', gap: vars.space.sm }),
});
