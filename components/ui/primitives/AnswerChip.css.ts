import { style, styleVariants } from '@vanilla-extract/css';
import { layered } from '@/lib/styles/layers.css';
import { popFrames, shakeFrames } from '@/lib/styles/motion.css';
import { vars } from '@/lib/styles/theme.css';

const reducedMotion = '(prefers-reduced-motion: reduce)';

// 공통 칩의 가리킴·선택 규칙보다 우선하도록 상태 속성까지 붙여 고정한다.
const graded = '&[data-status], &[data-status]:hover';

// 공통 칩 스타일과 불러오는 순서에 관계없이 이기도록 클래스를 두 번 겹쳐 우선순위를 올린다.
const own = '&&';

/** 보기 칩은 숫자 서체의 큰 글자로 가운데 정렬한다. */
export const chip = style({
  selectors: {
    [own]: {
      fontFamily: vars.font.numeric,
      fontSize: '17px',
      fontWeight: vars.fontWeight.bold,
    },
  },
  ...layered({
    selectors: { [own]: { justifyContent: 'center', padding: '0 22px' } },
  }),
});

/** 채점 뒤 정답은 청록으로 튀어 오르고, 오답은 주황으로 흔들리며, 나머지 보기는 흐려진다. */
export const status = styleVariants({
  correct: {
    selectors: { [graded]: { color: vars.color.accent } },
    ...layered({
      animation: `${popFrames} 350ms ${vars.motion.easeOut}`,
      selectors: {
        [graded]: {
          borderColor: vars.color.accent,
          background: vars.color.selected,
        },
      },
      '@media': { [reducedMotion]: { animation: 'none' } },
    }),
  },
  incorrect: {
    selectors: { [graded]: { color: vars.color.warning } },
    ...layered({
      animation: `${shakeFrames} 350ms ${vars.motion.easeOut}`,
      selectors: {
        [graded]: {
          borderColor: vars.color.streak,
          background: vars.color.notice,
        },
      },
      '@media': { [reducedMotion]: { animation: 'none' } },
    }),
  },
  dimmed: layered({ opacity: 0.45 }),
});
