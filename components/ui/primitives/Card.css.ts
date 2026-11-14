import { style, styleVariants } from '@vanilla-extract/css';
import { layered } from '@/lib/styles/layers.css';
import { vars } from '@/lib/styles/theme.css';

/** 시안의 흰 카드 면이다. */
export const root = style(
  layered({
    minWidth: 0,
    padding: vars.space.comfortable,
    border: `1px solid ${vars.color.line}`,
    borderRadius: vars.radius.panel,
    background: vars.color.surface,
    color: vars.color.ink,
  })
);

/** 강조 카드는 청록 바탕, 보조 카드는 회색 바탕으로 위계를 낮춘다. */
export const variant = styleVariants(
  {
    teal: {
      borderColor: vars.color.accentLine,
      background: vars.color.selected,
    },
    muted: { borderColor: 'transparent', background: vars.color.canvas },
  },
  layered
);
