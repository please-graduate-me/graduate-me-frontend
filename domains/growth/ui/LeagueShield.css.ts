import { createVar, style, styleVariants } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

const outerFill = createVar();
const innerFill = createVar();
const centerFill = createVar();

/** 방패 크기만 정하고 색은 등급 변형이 변수로 넘긴다. */
export const root = style({ display: 'block', flexShrink: 0 });

/** 등급별 바깥 테두리, 안쪽 면, 가운데 표지 색이며 방패에만 쓰는 값이라 이 파일에 둔다. */
export const tier = styleVariants({
  bronze: {
    vars: {
      [outerFill]: '#E9B88E',
      [innerFill]: vars.color.streak,
      [centerFill]: '#FDE3CC',
    },
  },
  silver: {
    vars: {
      [outerFill]: '#D5D9E0',
      [innerFill]: '#7C8597',
      [centerFill]: '#F1F2F4',
    },
  },
  gold: {
    vars: {
      [outerFill]: '#F6D77A',
      [innerFill]: '#B98900',
      [centerFill]: '#FFF4CC',
    },
  },
});

/** 아직 오르지 않은 등급은 회색 방패에 흰 자물쇠로 둔다. */
export const locked = style({
  vars: {
    [outerFill]: vars.color.line,
    [innerFill]: vars.color.lineHover,
    [centerFill]: vars.color.surface,
  },
});

/** 방패 바깥 테두리다. */
export const outer = style({ fill: outerFill });

/** 방패 안쪽 면이다. */
export const inner = style({ fill: innerFill });

/** 가운데 원 또는 자물쇠 몸통이다. */
export const center = style({ fill: centerFill });

/** 자물쇠 고리는 몸통과 같은 색의 선으로 그린다. */
export const shackle = style({
  fill: 'none',
  stroke: centerFill,
  strokeWidth: 3,
});
