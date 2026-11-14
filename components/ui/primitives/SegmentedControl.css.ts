import { style } from '@vanilla-extract/css';
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
