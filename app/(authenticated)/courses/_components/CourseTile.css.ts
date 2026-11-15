import { style, styleVariants } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

const reducedMotion = '(prefers-reduced-motion: reduce)';

/** 수업 타일 안 그림, 제목, 표지와 이동 안내를 세로로 쌓는다. */
export const tile = style({
  flex: '1 1 auto',
  display: 'flex',
  flexDirection: 'column',
  gap: 14,
});

/** 타일에 올리면 칠판 그림이 살짝 기울며 반응한다. */
export const art = style({
  transition: `transform 250ms ${vars.motion.spring}`,
  selectors: {
    [`${tile}:hover &`]: { transform: 'rotate(-4deg) scale(1.06)' },
  },
  '@media': {
    [reducedMotion]: {
      transition: 'none',
      selectors: { [`${tile}:hover &`]: { transform: 'none' } },
    },
  },
});

/** 수업마다 칠판 색을 달리해 목록에서 구분하기 쉽게 한다. */
export const board = styleVariants({
  ink: { fill: vars.color.ink },
  info: { fill: vars.color.info },
  review: { fill: vars.color.review },
});

/** 칠판 옆 언어 표지 원의 색이다. */
export const badge = styleVariants({
  accent: { fill: vars.color.accentBright },
  highlight: { fill: vars.color.highlight },
  notice: { fill: vars.color.reviewBackground },
});

/** 칠판 위 글줄은 흰색으로 둔다. */
export const boardLine = style({ fill: vars.color.onAccent });

/** 언어 표지 원 안 글자색이다. */
export const badgeText = style({
  fill: vars.color.ink,
  fontFamily: vars.font.numeric,
});

/** 수업 이름은 두 줄까지 굵게 보여 준다. */
export const tileTitle = style({
  fontSize: 17,
  fontWeight: vars.fontWeight.heavy,
  lineHeight: 1.35,
  overflowWrap: 'anywhere',
});

/** 언어와 역할 표지를 한 줄에 흘린다. */
export const chips = style({ display: 'flex', flexWrap: 'wrap', gap: 6 });

/** 이동 안내는 타일 아래쪽에 붙여 청록 글자로 둔다. */
export const go = style({
  marginTop: 'auto',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  fontSize: vars.fontSize.small,
  fontWeight: vars.fontWeight.heavy,
  color: vars.color.accent,
});
