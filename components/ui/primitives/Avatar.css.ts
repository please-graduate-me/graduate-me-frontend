import { style, styleVariants } from '@vanilla-extract/css';
import { layered } from '@/lib/styles/layers.css';
import { vars } from '@/lib/styles/theme.css';

/** 이름 첫 글자를 담는 원형 표시다. 지름은 컴포넌트가 인라인으로 넘긴다. */
export const root = style(
  layered({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    borderRadius: '50%',
    fontWeight: vars.fontWeight.heavy,
    lineHeight: 1,
    userSelect: 'none',
  })
);

/** 이름마다 고정되는 옅은 바탕과 진한 글자색 짝이다. */
export const palette = styleVariants(
  {
    info: { background: vars.color.infoBackground, color: vars.color.info },
    review: {
      background: vars.color.reviewBackground,
      color: vars.color.review,
    },
    streak: {
      background: vars.color.streakBackground,
      color: vars.color.streak,
    },
    accent: { background: vars.color.selected, color: vars.color.accent },
  },
  layered
);

/** 이름과 무관하게 역할로 정하는 색으로, 조교는 청록 단색, 본인은 연보라, 순위 목록은 회색이다. */
export const role = styleVariants(
  {
    helper: { background: vars.color.accent, color: vars.color.onAccent },
    self: { background: vars.color.reviewBackground, color: vars.color.review },
    neutral: { background: vars.color.neutral, color: vars.color.ink },
  },
  layered
);

/** 계정 이동 링크는 아바타가 작아도 누르기 쉬운 영역을 확보한다. */
export const link = style(
  layered({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 44,
    minHeight: 44,
    borderRadius: '50%',
    textDecoration: 'none',
  })
);
