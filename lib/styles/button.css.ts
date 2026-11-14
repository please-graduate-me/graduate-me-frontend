import { keyframes, style, styleVariants } from '@vanilla-extract/css';
import { layered } from './layers.css';
import { vars } from './theme.css';

const spin = keyframes({ to: { transform: 'rotate(360deg)' } });
const enabled = ':not(:disabled):not([aria-busy="true"])';
const reducedMotion = '(prefers-reduced-motion: reduce)';

/** 버튼형 조작의 알약 모양과 누름 반응이며, 전역 글자 초기화를 이기도록 글자 속성만 계층 밖에 둔다. */
export const base = style({
  fontWeight: vars.fontWeight.heavy,
  lineHeight: 1.2,
  ...layered({
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: vars.space.xs,
    flexShrink: 0,
    margin: 0,
    border: '1.5px solid transparent',
    borderRadius: vars.radius.pill,
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    userSelect: 'none',
    WebkitTapHighlightColor: 'transparent',
    transition: [
      `transform ${vars.motion.fast} ${vars.motion.easeOut}`,
      `filter ${vars.motion.base} ${vars.motion.easeOut}`,
      `background-color ${vars.motion.base} ${vars.motion.easeOut}`,
      `border-color ${vars.motion.base} ${vars.motion.easeOut}`,
    ].join(', '),
    selectors: {
      [`&:active${enabled}`]: { transform: 'translateY(2px) scale(0.99)' },
      '&:disabled': { cursor: 'not-allowed' },
      '&[aria-busy="true"]': { cursor: 'progress' },
    },
    '@media': {
      [reducedMotion]: {
        transition: 'none',
        selectors: { [`&:active${enabled}`]: { transform: 'none' } },
      },
    },
  }),
});

const pressedColor = { color: vars.color.accent };

const pressedBox = {
  background: vars.color.selected,
  borderColor: vars.color.accent,
};

const pressedHoverBox = { background: vars.color.selectedHover };
const disabledColor = { color: vars.color.subtle };

const disabledBox = {
  background: vars.color.neutral,
  borderColor: 'transparent',
};

/** 시안의 청록, 먹색, 흰 테두리, 투명, 위험 버튼 색이며 aria-pressed 선택 상태는 청록 칩으로 표시한다. */
export const variant = styleVariants({
  primary: {
    color: vars.color.onAccent,
    selectors: { '&:disabled': disabledColor },
    ...layered({
      background: vars.color.accent,
      selectors: {
        [`&:hover${enabled}`]: { background: vars.color.accentHover },
        [`&:active${enabled}`]: { background: vars.color.accentPressed },
        '&:disabled': { background: vars.color.neutral },
      },
    }),
  },
  ink: {
    color: vars.color.onAccent,
    selectors: {
      '&[aria-pressed="true"]': pressedColor,
      '&:disabled': disabledColor,
    },
    ...layered({
      background: vars.color.ink,
      selectors: {
        [`&:hover${enabled}`]: { filter: 'brightness(1.06)' },
        '&[aria-pressed="true"]': pressedBox,
        '&:disabled': disabledBox,
      },
    }),
  },
  secondary: {
    color: vars.color.ink,
    selectors: {
      '&[aria-pressed="true"]': pressedColor,
      '&:disabled': disabledColor,
    },
    ...layered({
      background: vars.color.surface,
      borderColor: vars.color.lineStrong,
      selectors: {
        [`&:hover${enabled}`]: {
          background: vars.color.canvas,
          borderColor: vars.color.inputBorder,
        },
        '&[aria-pressed="true"]': pressedBox,
        [`&[aria-pressed="true"]:hover${enabled}`]: pressedHoverBox,
        '&:disabled': disabledBox,
      },
    }),
  },
  ghost: {
    // 어두운 도구 막대 안에서도 읽히도록 부모 글자색을 따른다.
    color: 'inherit',
    selectors: {
      '&[aria-pressed="true"]': pressedColor,
      '&:disabled': { color: vars.color.subtle },
    },
    ...layered({
      background: 'transparent',
      selectors: {
        [`&:hover${enabled}`]: {
          background: 'color-mix(in srgb, currentColor 8%, transparent)',
        },
        '&[aria-pressed="true"]': { background: vars.color.selected },
        [`&[aria-pressed="true"]:hover${enabled}`]: pressedHoverBox,
      },
    }),
  },
  danger: {
    color: vars.color.onAccent,
    selectors: { '&:disabled': disabledColor },
    ...layered({
      background: vars.color.error,
      selectors: {
        [`&:hover${enabled}`]: { filter: 'brightness(1.08)' },
        '&:disabled': disabledBox,
      },
    }),
  },
});

/** 시안의 36·44·56px 높이 단계다. */
export const size = styleVariants({
  small: {
    fontSize: vars.fontSize.small,
    ...layered({ minHeight: 36, padding: '0 14px' }),
  },
  medium: {
    fontSize: vars.fontSize.small,
    ...layered({ minHeight: 44, padding: '0 20px' }),
  },
  large: {
    fontSize: vars.fontSize.body,
    ...layered({ minHeight: 56, padding: '0 28px' }),
  },
});

/** 아이콘만 있는 버튼은 높이와 같은 정원형으로 만든다. */
export const iconOnly = styleVariants({
  small: layered({ width: 36, height: 36, minHeight: 36, padding: 0 }),
  medium: layered({ width: 44, height: 44, minHeight: 44, padding: 0 }),
});

/** 처리 중에는 글자 폭을 유지한 채 숨겨 버튼 크기가 흔들리지 않게 한다. */
export const loadingContent = style(
  layered({
    display: 'inline-flex',
    alignItems: 'center',
    gap: vars.space.xs,
    visibility: 'hidden',
  })
);

/** 처리 중 표시다. */
export const spinner = style(
  layered({
    position: 'absolute',
    inset: 0,
    width: 18,
    height: 18,
    margin: 'auto',
    border: '2px solid currentColor',
    borderRightColor: 'transparent',
    borderRadius: '50%',
    animation: `${spin} 700ms linear infinite`,
    '@media': { [reducedMotion]: { animation: 'none' } },
  })
);
