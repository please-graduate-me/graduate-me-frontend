import { style, styleVariants } from '@vanilla-extract/css';
import { layered } from '@/lib/styles/layers.css';
import { vars } from '@/lib/styles/theme.css';

/** 시안의 굵고 촘촘한 제목 공통값이다. */
export const root = style(
  layered({
    margin: 0,
    color: vars.color.ink,
    fontWeight: vars.fontWeight.heavy,
    lineHeight: vars.lineHeight.heading,
    overflowWrap: 'break-word',
  })
);

/** 문서 단계마다 시안의 제목 크기와 자간을 대응한다. */
export const level = styleVariants(
  {
    1: { fontSize: vars.fontSize.heading1, letterSpacing: '-0.02em' },
    2: { fontSize: vars.fontSize.heading2, letterSpacing: '-0.01em' },
    3: { fontSize: vars.fontSize.heading3 },
    4: { fontSize: vars.fontSize.body },
    5: { fontSize: vars.fontSize.small },
    6: { fontSize: vars.fontSize.small },
  },
  layered
);

/** 랜딩처럼 큰 화면 제목에서 단계와 별개로 쓰는 표시 크기다. */
export const type = styleVariants(
  {
    'display-1': {
      fontSize: `clamp(40px, 8vw, ${vars.fontSize.display})`,
      fontWeight: vars.fontWeight.black,
      lineHeight: '1.15',
      letterSpacing: '-0.04em',
    },
    'display-2': {
      fontSize: `clamp(${vars.fontSize.heading2}, 5vw, 40px)`,
      fontWeight: vars.fontWeight.black,
      lineHeight: '1.2',
      letterSpacing: '-0.03em',
    },
    'display-3': {
      fontSize: `clamp(${vars.fontSize.heading2}, 4vw, ${vars.fontSize.heading1})`,
      lineHeight: '1.25',
      letterSpacing: '-0.02em',
    },
  },
  layered
);

/** 기본 굵기보다 한 단계 더 강조한다. */
export const bold = style(layered({ fontWeight: vars.fontWeight.black }));

/** 강조 배경 위에서 주변 글자색을 따른다. */
export const inherit = style(layered({ color: 'inherit' }));

/** 가운데 정렬한다. */
export const center = style(layered({ textAlign: 'center' }));

/** 한 줄을 넘는 제목을 말줄임표로 자른다. */
export const singleLine = style(
  layered({
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  })
);
