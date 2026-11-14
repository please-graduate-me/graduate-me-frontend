import { style } from '@vanilla-extract/css';
import { layered } from '@/lib/styles/layers.css';
import { vars } from '@/lib/styles/theme.css';

/** 스위치와 라벨을 한 줄로 묶는다. */
export const root = style(
  layered({
    display: 'inline-flex',
    alignItems: 'center',
    gap: vars.space.sm,
    minHeight: 28,
    color: vars.color.ink,
    fontSize: vars.fontSize.small,
    cursor: 'pointer',
  })
);

/** 켜지면 청록으로 채워지고 손잡이가 오른쪽으로 이동하는 막대다. */
export const track = style(
  layered({
    appearance: 'none',
    position: 'relative',
    flexShrink: 0,
    width: 44,
    height: 26,
    margin: 0,
    border: 0,
    borderRadius: vars.radius.pill,
    background: vars.color.inputBorder,
    cursor: 'inherit',
    transition: `background-color ${vars.motion.base} ${vars.motion.easeOut}`,
    selectors: {
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 3,
        left: 3,
        width: 20,
        height: 20,
        borderRadius: '50%',
        background: vars.color.surface,
        boxShadow: vars.shadow.card,
        transition: `transform ${vars.motion.base} ${vars.motion.spring}`,
      },
      '&:checked': { background: vars.color.accent },
      '&:checked::before': { transform: 'translateX(18px)' },
      '&:disabled': { opacity: 0.48, cursor: 'not-allowed' },
    },
    '@media': {
      '(prefers-reduced-motion: reduce)': {
        transition: 'none',
        selectors: { '&::before': { transition: 'none' } },
      },
    },
  })
);

/** 비활성 상태의 라벨 글자다. */
export const disabled = style(
  layered({ color: vars.color.subtle, cursor: 'not-allowed' })
);
