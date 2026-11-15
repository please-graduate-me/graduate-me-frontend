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
    solid: { background: vars.color.accent, color: vars.color.onAccent },
    // 흰 숫자가 작은 글자 대비 기준을 넘도록 밝은 주황 대신 진한 연속 학습 색을 쓴다.
    count: {
      background: vars.color.streak,
      color: vars.color.onAccent,
      fontFamily: vars.font.numeric,
      fontVariantNumeric: 'tabular-nums',
      letterSpacing: 0,
    },
  },
  layered
);

/** 조교·도우미 표지처럼 작은 글자와 좁은 여백을 쓰는 단계다. */
export const small = style(
  layered({ padding: '2px 8px', fontSize: '11px', lineHeight: '16px' })
);

/** 알약 대신 6px 모서리의 사각 표지다. */
export const square = style(layered({ borderRadius: 6 }));
