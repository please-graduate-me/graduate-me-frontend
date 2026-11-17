import { style } from '@vanilla-extract/css';
import { layered } from '@/lib/styles/layers.css';
import { vars } from '@/lib/styles/theme.css';

/** 고를 수 있는 카드 면으로, 선택 표시는 크기가 변하지 않게 안쪽 그림자로 그린다. */
export const root = style(
  layered({
    position: 'relative',
    minWidth: 0,
    padding: vars.space.sm,
    border: `1px solid ${vars.color.line}`,
    borderRadius: vars.radius.control,
    background: vars.color.surface,
    transition: `border-color ${vars.motion.fast} ${vars.motion.easeOut}, box-shadow ${vars.motion.fast} ${vars.motion.easeOut}`,
    selectors: {
      '&:hover': { borderColor: vars.color.inputBorder },
      '&:has(input:focus-visible)': {
        outline: `2px solid ${vars.color.focus}`,
        outlineOffset: 2,
      },
    },
    '@media': {
      '(prefers-reduced-motion: reduce)': { transition: 'none' },
    },
  })
);

/** 선택된 카드를 청록 테두리와 옅은 청록 바탕으로 표시한다. */
export const selected = style(
  layered({
    borderColor: vars.color.accent,
    background: vars.color.selected,
    boxShadow: `inset 0 0 0 1px ${vars.color.accent}`,
    selectors: { '&:hover': { borderColor: vars.color.accent } },
  })
);

const check = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m5 12 5 5 9-10'/%3E%3C/svg%3E")`;

/** 체크 표시가 있는 카드는 표시 자리만큼 왼쪽 여백을 둔다. */
export const withIndicator = style(
  layered({ paddingLeft: `calc(${vars.space.sm} + 30px)` })
);

/** 카드 왼쪽 위의 18px 체크 표시이며 카드가 선택되면 청록으로 채워진다. */
export const indicator = style(
  layered({
    position: 'absolute',
    top: vars.space.compact,
    left: vars.space.compact,
    width: 18,
    height: 18,
    border: `1.5px solid ${vars.color.inputBorder}`,
    borderRadius: 5,
    background: vars.color.surface,
    selectors: {
      [`${selected} &`]: {
        borderColor: vars.color.accent,
        background: `${check} center / 14px no-repeat, ${vars.color.accent}`,
      },
    },
  })
);

/** 카드 전체를 덮는 투명 체크 상자로, 선택 상태와 이름을 보조 기술에 알린다. */
export const input = style(
  layered({
    position: 'absolute',
    inset: 0,
    zIndex: 1,
    width: '100%',
    height: '100%',
    margin: 0,
    opacity: 0,
    cursor: 'pointer',
    appearance: 'none',
  })
);
