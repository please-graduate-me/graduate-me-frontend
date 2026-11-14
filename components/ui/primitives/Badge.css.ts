import { style, styleVariants } from '@vanilla-extract/css';
import { layered } from '@/lib/styles/layers.css';
import { vars } from '@/lib/styles/theme.css';

/** 시안의 작은 알약 표지 모양이다. */
export const root = style(
  layered({
    display: 'inline-flex',
    alignItems: 'center',
    gap: vars.space.xxs,
    flexShrink: 0,
    padding: `${vars.space.xxs} ${vars.space.sm}`,
    borderRadius: vars.radius.pill,
    fontSize: vars.fontSize.caption,
    lineHeight: vars.lineHeight.caption,
    fontWeight: vars.fontWeight.heavy,
    letterSpacing: '0.02em',
    whiteSpace: 'nowrap',
  })
);

/** 상태 의미마다 옅은 바탕과 진한 글자색을 짝지어 대비를 지킨다. */
export const tone = styleVariants(
  {
    neutral: { background: vars.color.neutral, color: vars.color.ink },
    brand: { background: vars.color.selected, color: vars.color.accent },
    success: { background: vars.color.selected, color: vars.color.accent },
    info: { background: vars.color.infoBackground, color: vars.color.info },
    warning: { background: vars.color.notice, color: vars.color.warning },
    error: { background: vars.color.errorBackground, color: vars.color.error },
    review: {
      background: vars.color.reviewBackground,
      color: vars.color.review,
    },
  },
  layered
);
