import { style, styleVariants } from '@vanilla-extract/css';
import { layered } from '@/lib/styles/layers.css';
import { vars } from '@/lib/styles/theme.css';

/** 자식을 세로로 쌓는다. */
export const root = style(
  layered({ display: 'flex', flexDirection: 'column', minWidth: 0 })
);

/** 자식을 가로로 놓고 좁으면 줄바꿈한다. */
export const horizontal = style(
  layered({ flexDirection: 'row', flexWrap: 'wrap' })
);

/** 교차축 가운데 정렬이다. */
export const center = style(layered({ alignItems: 'center' }));

/** 4px 단위 간격 단계를 디자인 간격 값에 대응한다. */
export const gap = styleVariants(
  {
    1: { gap: vars.space.xxs },
    2: { gap: `calc(${vars.space.xxs} * 2)` },
    3: { gap: vars.space.compact },
    4: { gap: vars.space.md },
  },
  layered
);
