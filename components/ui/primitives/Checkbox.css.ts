import { style } from '@vanilla-extract/css';
import { layered } from '@/lib/styles/layers.css';
import { vars } from '@/lib/styles/theme.css';

const check = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m5 12 5 5 9-10'/%3E%3C/svg%3E")`;

/** 상자와 라벨을 한 줄로 묶어 라벨 전체를 눌러도 선택되게 한다. */
export const root = style(
  layered({
    display: 'inline-flex',
    alignItems: 'flex-start',
    gap: vars.space.sm,
    minHeight: 24,
    color: vars.color.ink,
    fontSize: vars.fontSize.small,
    lineHeight: '24px',
    cursor: 'pointer',
  })
);

/** 청록으로 채워지는 체크 상자다. */
export const box = style(
  layered({
    appearance: 'none',
    flexShrink: 0,
    width: 22,
    height: 22,
    margin: '1px 0 0',
    border: `1.5px solid ${vars.color.inputBorder}`,
    borderRadius: vars.radius.small,
    background: vars.color.surface,
    cursor: 'inherit',
    transition: `background-color ${vars.motion.fast} ${vars.motion.easeOut}, border-color ${vars.motion.fast} ${vars.motion.easeOut}`,
    selectors: {
      '&:hover:not(:disabled)': { borderColor: vars.color.accent },
      '&:checked': {
        borderColor: vars.color.accent,
        background: `${check} center / 16px no-repeat, ${vars.color.accent}`,
      },
      '&:disabled': {
        borderColor: vars.color.lineStrong,
        background: vars.color.canvas,
        cursor: 'not-allowed',
      },
      '&:checked:disabled': {
        background: `${check} center / 16px no-repeat, ${vars.color.inputBorder}`,
      },
    },
    '@media': {
      '(prefers-reduced-motion: reduce)': { transition: 'none' },
    },
  })
);

/** 비활성 상태의 라벨 글자다. */
export const disabled = style(
  layered({ color: vars.color.subtle, cursor: 'not-allowed' })
);
