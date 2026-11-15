import {
  createVar,
  fallbackVar,
  keyframes,
  style,
  styleVariants,
} from '@vanilla-extract/css';
import { layered } from './layers.css';
import { vars } from './theme.css';

const spin = keyframes({ to: { transform: 'rotate(360deg)' } });

const pop = keyframes({
  '0%': { transform: 'scale(0.6)' },
  '60%': { transform: 'scale(1.25)' },
  '100%': { transform: 'scale(1)' },
});

const roundedRadius = createVar();
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

/** 시안의 청록, 먹색, 흰 테두리, 투명, 위험, 회색, 점선, 흰 면, 외곽선 버튼 색이며 aria-pressed 선택 상태는 청록 칩으로 표시한다. */
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
  soft: {
    color: vars.color.ink,
    selectors: {
      '&[aria-pressed="true"]': pressedColor,
      '&:disabled': disabledColor,
    },
    ...layered({
      background: vars.color.canvas,
      selectors: {
        [`&:hover${enabled}`]: { background: vars.color.canvasHover },
        '&[aria-pressed="true"]': pressedBox,
        '&:disabled': disabledBox,
      },
    }),
  },
  dashed: {
    color: vars.color.ink,
    selectors: { '&:disabled': disabledColor },
    ...layered({
      borderStyle: 'dashed',
      borderWidth: 1,
      borderColor: vars.color.inputBorder,
      background: vars.color.surface,
      selectors: {
        [`&:hover${enabled}`]: { background: vars.color.quote },
        '&:disabled': { ...disabledBox, borderColor: vars.color.lineStrong },
      },
    }),
  },
  surface: {
    color: vars.color.ink,
    selectors: { '&:disabled': disabledColor },
    ...layered({
      background: vars.color.surface,
      boxShadow: '0 1px 2px rgba(22, 24, 29, 0.08)',
      selectors: {
        [`&:hover${enabled}`]: { background: vars.color.canvas },
        '&:disabled': { ...disabledBox, boxShadow: 'none' },
      },
    }),
  },
  'danger-outline': {
    color: vars.color.error,
    selectors: { '&:disabled': disabledColor },
    ...layered({
      background: vars.color.surface,
      borderWidth: 1,
      borderColor: vars.color.errorLine,
      selectors: {
        [`&:hover${enabled}`]: { background: vars.color.errorBackground },
        '&:disabled': disabledBox,
      },
    }),
  },
  'success-outline': {
    color: vars.color.accentPressed,
    selectors: { '&:disabled': disabledColor },
    ...layered({
      background: vars.color.surface,
      borderWidth: 1,
      borderColor: vars.color.accentLine,
      selectors: {
        [`&:hover${enabled}`]: { background: vars.color.selected },
        '&:disabled': disabledBox,
      },
    }),
  },
});

// 변형별 청록 선택 규칙보다 뒤에 선언해 같은 우선순위에서 먹색 선택이 이기게 한다.
const pressedInkTarget =
  '&[aria-pressed="true"], &[aria-current]:not([aria-current="false"])';

/** 사이드바·필터 칩처럼 선택 항목을 먹색 바탕 흰 글자로 강조하는 선택 표시다. */
export const pressedInk = style({
  selectors: { [pressedInkTarget]: { color: vars.color.onAccent } },
  ...layered({
    selectors: {
      [pressedInkTarget]: {
        background: vars.color.ink,
        borderColor: vars.color.ink,
        filter: 'none',
      },
      [`&[aria-pressed="true"]:hover${enabled}, &[aria-current]:not([aria-current="false"]):hover`]:
        { background: vars.color.ink },
    },
  }),
});

/** 둥근 사각 블록 모양으로, 모서리는 크기 단계가 정한 값을 따른다. */
export const rounded = style(
  layered({ borderRadius: fallbackVar(roundedRadius, vars.radius.control) })
);

/** 시안의 36·44·48·52·56px 높이 단계이며 둥근 사각 모양의 모서리도 함께 정한다. */
export const size = styleVariants({
  small: {
    fontSize: vars.fontSize.small,
    ...layered({
      vars: { [roundedRadius]: '10px' },
      minHeight: 36,
      padding: '0 14px',
    }),
  },
  medium: {
    fontSize: vars.fontSize.small,
    ...layered({
      vars: { [roundedRadius]: vars.radius.control },
      minHeight: 44,
      padding: '0 20px',
    }),
  },
  comfortable: {
    fontSize: '15px',
    ...layered({
      vars: { [roundedRadius]: vars.radius.control },
      minHeight: 48,
      padding: '0 22px',
    }),
  },
  prominent: {
    fontSize: vars.fontSize.body,
    ...layered({
      vars: { [roundedRadius]: '16px' },
      minHeight: 52,
      padding: '0 26px',
    }),
  },
  large: {
    fontSize: vars.fontSize.body,
    ...layered({
      vars: { [roundedRadius]: '16px' },
      minHeight: 56,
      padding: '0 28px',
    }),
  },
});

/** 아이콘만 있는 버튼은 높이와 같은 정원형으로 만든다. */
export const iconOnly = styleVariants({
  small: layered({ width: 36, height: 36, minHeight: 36, padding: 0 }),
  medium: layered({ width: 44, height: 44, minHeight: 44, padding: 0 }),
});

/** 아이콘 단독 버튼의 테두리형으로, 흰 바탕 1px 테두리에 누르면 살짝 줄어든다. */
export const iconOutline = style({
  color: vars.color.ink,
  ...layered({
    borderWidth: 1,
    borderColor: vars.color.lineStrong,
    background: vars.color.surface,
    selectors: {
      [`&:hover${enabled}`]: { background: vars.color.canvas },
      [`&:active${enabled}`]: { transform: 'scale(0.96)' },
    },
  }),
});

/** 선택되는 순간 버튼 아이콘이 튀어 오르게 하는 표시이며 실제 움직임은 icon 스타일이 맡는다. */
export const pressedPop = style({});

/** 버튼 글자 앞뒤에 두는 아이콘 자리이며 튀어 오름 표시가 있으면 선택 순간에 반응한다. */
export const icon = style(
  layered({
    flexShrink: 0,
    selectors: {
      [`${pressedPop}[aria-pressed="true"] &`]: {
        animation: `${pop} 360ms ${vars.motion.spring}`,
      },
    },
    '@media': {
      [reducedMotion]: {
        selectors: {
          [`${pressedPop}[aria-pressed="true"] &`]: { animation: 'none' },
        },
      },
    },
  })
);

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

// 채점 상태가 붙은 칩은 채점 뒤 비활성이어도 정답·오답 색을 보이도록 선택·비활성 규칙에서 뺀다.
const raisedSelected =
  '&[aria-pressed="true"]:not([data-status]), &:has(input:checked)';

const raisedDisabled = '&:disabled:not([data-status]), &:has(input:disabled)';

/** 아래 4px 두께 테두리로 떠 보이고 누르면 내려앉는 보기 칩·선택 타일이며 선택되면 청록으로 바뀐다. */
export const raised = style({
  color: vars.color.ink,
  fontSize: '15px',
  fontWeight: vars.fontWeight.heavy,
  lineHeight: 1.3,
  selectors: {
    [raisedSelected]: { color: vars.color.accent },
    [raisedDisabled]: { color: vars.color.subtle },
  },
  ...layered({
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: vars.space.compact,
    minWidth: 0,
    minHeight: 52,
    margin: 0,
    padding: `${vars.space.sm} ${vars.space.md}`,
    border: `1.5px solid ${vars.color.lineStrong}`,
    borderBottomWidth: 4,
    borderRadius: '14px',
    background: vars.color.surface,
    textAlign: 'start',
    cursor: 'pointer',
    userSelect: 'none',
    WebkitTapHighlightColor: 'transparent',
    transition: [
      `transform ${vars.motion.fast} ${vars.motion.easeOut}`,
      `border-color ${vars.motion.base} ${vars.motion.easeOut}`,
      `background-color ${vars.motion.base} ${vars.motion.easeOut}`,
    ].join(', '),
    selectors: {
      '&:hover': { background: vars.color.canvas },
      [`&:active:not(:disabled):not(:has(input:disabled))`]: {
        transform: 'translateY(2px)',
        borderBottomWidth: 2,
      },
      [raisedSelected]: {
        borderColor: vars.color.accent,
        background: vars.color.selected,
      },
      '&[aria-pressed="true"]:not([data-status]):hover, &:has(input:checked):hover':
        {
          background: vars.color.selectedHover,
        },
      // 라벨 안에 숨긴 라디오가 초점을 받으면 타일 전체에 초점 고리를 그린다.
      '&:has(input:focus-visible)': {
        outline: `2px solid ${vars.color.focus}`,
        outlineOffset: 2,
      },
      [raisedDisabled]: {
        borderColor: vars.color.line,
        background: vars.color.canvas,
        cursor: 'not-allowed',
      },
    },
    '@media': {
      [reducedMotion]: {
        transition: 'none',
        selectors: {
          '&:active:not(:disabled):not(:has(input:disabled))': {
            transform: 'none',
            borderBottomWidth: 4,
          },
        },
      },
    },
  }),
});
