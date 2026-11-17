import { style, styleVariants } from '@vanilla-extract/css';
import { layered } from '@/lib/styles/layers.css';
import { vars } from '@/lib/styles/theme.css';

/** 회색 알약 바탕 위에 항목을 나란히 둔다. */
export const root = style(
  layered({
    display: 'inline-flex',
    alignItems: 'stretch',
    gap: vars.space.xxs,
    maxWidth: '100%',
    padding: vars.space.xxs,
    borderRadius: vars.radius.pill,
    background: vars.color.neutral,
    overflowX: 'auto',
    scrollbarWidth: 'none',
  })
);

/** 기본 알약 묶음, 칸 폭을 나눠 채우는 블록, 바탕 없이 줄바꿈되는 칩 묶음이다. */
export const variant = styleVariants({
  pill: {},
  block: layered({ display: 'flex', width: '100%', borderRadius: '16px' }),
  chip: layered({
    flexWrap: 'wrap',
    gap: vars.space.xs,
    padding: 0,
    borderRadius: 0,
    background: 'transparent',
    overflowX: 'visible',
  }),
});
