import { style, styleVariants } from '@vanilla-extract/css';
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

const reducedMotion = '(prefers-reduced-motion: reduce)';

/** 큰 확인 체크는 48px 줄에 15px 굵은 라벨을, 타일은 테두리 있는 44px 칸을 쓴다. */
export const variant = styleVariants({
  default: {},
  large: layered({
    alignItems: 'center',
    gap: vars.space.compact,
    minHeight: 48,
    padding: `0 ${vars.space.xxs}`,
    fontSize: '15px',
    fontWeight: vars.fontWeight.bold,
  }),
  tile: layered({
    display: 'flex',
    alignItems: 'center',
    minHeight: 44,
    padding: `${vars.space.xs} ${vars.space.compact}`,
    border: `1px solid ${vars.color.line}`,
    borderRadius: vars.radius.control,
    fontWeight: vars.fontWeight.bold,
    transition: `border-color ${vars.motion.fast} ${vars.motion.easeOut}, background-color ${vars.motion.fast} ${vars.motion.easeOut}`,
    selectors: {
      '&:hover:not(:has(input:disabled))': {
        borderColor: vars.color.inputBorder,
      },
      '&:has(input:checked)': { borderColor: vars.color.accentLine },
      '&:has(input:focus-visible)': {
        outline: `2px solid ${vars.color.focus}`,
        outlineOffset: 2,
      },
    },
    '@media': { [reducedMotion]: { transition: 'none' } },
  }),
});

/** 상자 크기 단계로, 큰 상자는 체크 표시가 스프링으로 튀어나온다. */
export const boxVariant = styleVariants({
  default: {},
  large: layered({
    width: 24,
    height: 24,
    margin: 0,
    borderWidth: 2,
    borderColor: vars.color.inputBorder,
    borderRadius: '7px',
    // 체크 그림을 0 크기로 두었다가 선택 시 키워 스프링 팝을 만든다.
    backgroundImage: check,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '0px',
    transition: `background-color ${vars.motion.fast} ${vars.motion.easeOut}, border-color ${vars.motion.fast} ${vars.motion.easeOut}, background-size 200ms cubic-bezier(0.3, 1.6, 0.5, 1)`,
    selectors: {
      '&:checked': {
        background: 'none',
        backgroundImage: check,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '16px',
        backgroundColor: vars.color.accent,
      },
      '&:checked:disabled': {
        background: 'none',
        backgroundImage: check,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '16px',
        backgroundColor: vars.color.inputBorder,
      },
    },
    '@media': { [reducedMotion]: { transition: 'none' } },
  }),
  tile: layered({ width: 18, height: 18, margin: 0 }),
});
