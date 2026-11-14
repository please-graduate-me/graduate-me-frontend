import { style, styleVariants } from '@vanilla-extract/css';
import { layered } from '@/lib/styles/layers.css';
import { vars } from '@/lib/styles/theme.css';

/** 카드 전체를 누를 수 있는 면으로, 가리키면 살짝 떠오른다. */
export const root = style(
  layered({
    position: 'relative',
    minWidth: 0,
    border: `1px solid ${vars.color.line}`,
    borderRadius: vars.radius.panel,
    background: vars.color.surface,
    color: vars.color.ink,
    transition: `transform ${vars.motion.base} ${vars.motion.easeOut}, box-shadow ${vars.motion.base} ${vars.motion.easeOut}`,
    selectors: {
      '&:hover': { transform: 'translateY(-2px)', boxShadow: vars.shadow.lift },
    },
    '@media': {
      '(prefers-reduced-motion: reduce)': {
        transition: 'none',
        selectors: { '&:hover': { transform: 'none' } },
      },
    },
  })
);

/** 투명 카드는 테두리와 바탕 없이 내용의 모양만 남긴다. */
export const transparent = style(
  layered({ borderColor: 'transparent', background: 'transparent' })
);

/** 간격 단계마다 카드 안쪽 여백을 정한다. */
export const padding = styleVariants(
  {
    default: { padding: vars.space.comfortable },
    0: { padding: 0 },
    3: { padding: vars.space.compact },
  },
  layered
);

/** 카드 전체를 덮어 어디를 눌러도 같은 동작이 실행되게 하는 투명 버튼이나 링크다. */
export const action = style(
  layered({
    position: 'absolute',
    inset: 0,
    zIndex: 1,
    padding: 0,
    border: 0,
    borderRadius: 'inherit',
    background: 'transparent',
    cursor: 'pointer',
  })
);
