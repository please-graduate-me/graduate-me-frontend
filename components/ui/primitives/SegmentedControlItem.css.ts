import { style, styleVariants } from '@vanilla-extract/css';
import { layered } from '@/lib/styles/layers.css';
import { vars } from '@/lib/styles/theme.css';

/** 선택되면 흰 바탕으로 떠오르는 알약 항목이며 전역 글자 초기화를 이기도록 글자 속성만 계층 밖에 둔다. */
export const item = style({
  color: vars.color.muted,
  fontSize: vars.fontSize.small,
  fontWeight: vars.fontWeight.bold,
  lineHeight: 1.2,
  selectors: {
    '&:hover:not(:disabled)': { color: vars.color.ink },
    '&[aria-checked="true"]': { color: vars.color.ink },
    '&:disabled': { color: vars.color.subtle },
  },
  ...layered({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: vars.space.xs,
    flexShrink: 0,
    minHeight: 36,
    margin: 0,
    padding: `0 ${vars.space.md}`,
    border: 0,
    borderRadius: vars.radius.pill,
    background: 'transparent',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    transition: `background-color ${vars.motion.fast} ${vars.motion.easeOut}, box-shadow ${vars.motion.fast} ${vars.motion.easeOut}`,
    selectors: {
      '&[aria-checked="true"]': {
        background: vars.color.surface,
        boxShadow: vars.shadow.lift,
      },
      '&:disabled': { cursor: 'not-allowed' },
    },
    '@media': {
      '(prefers-reduced-motion: reduce)': { transition: 'none' },
    },
  }),
});

/** 블록은 칸을 3등분한 44px 사각 항목, 칩은 테두리 있는 44px 알약이며 선택되면 청록으로 바뀐다. */
export const variant = styleVariants({
  pill: {},
  block: layered({
    flex: '1 1 0',
    minWidth: 0,
    minHeight: 44,
    padding: `0 ${vars.space.compact}`,
    borderRadius: vars.radius.control,
    selectors: {
      '&[aria-checked="true"]': {
        boxShadow: `0 0 0 1px ${vars.color.lineStrong}, 0 1px 2px rgba(22, 24, 29, 0.08)`,
      },
    },
  }),
  chip: {
    selectors: { '&[aria-checked="true"]': { color: vars.color.accent } },
    ...layered({
      minHeight: 44,
      border: `1px solid ${vars.color.lineStrong}`,
      background: vars.color.surface,
      transition: `border-color ${vars.motion.fast} ${vars.motion.easeOut}, background-color ${vars.motion.fast} ${vars.motion.easeOut}`,
      selectors: {
        '&:hover:not(:disabled)': { borderColor: vars.color.inputBorder },
        '&[aria-checked="true"]': {
          // 테두리 두께 변화로 글자가 밀리지 않게 바깥 1.5px은 안쪽 그림자로 보탠다.
          borderColor: vars.color.accent,
          background: vars.color.selected,
          boxShadow: `inset 0 0 0 0.5px ${vars.color.accent}`,
        },
      },
      '@media': {
        '(prefers-reduced-motion: reduce)': { transition: 'none' },
      },
    }),
  },
});
