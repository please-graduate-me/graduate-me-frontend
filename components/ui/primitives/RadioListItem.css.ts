import { style } from '@vanilla-extract/css';
import { layered } from '@/lib/styles/layers.css';
import { vars } from '@/lib/styles/theme.css';

/** 선택되면 청록 테두리와 바탕으로 바뀌는 선택지 줄이다. */
export const item = style(
  layered({
    display: 'flex',
    alignItems: 'flex-start',
    gap: vars.space.compact,
    minHeight: 52,
    padding: `${vars.space.compact} ${vars.space.md}`,
    border: `1px solid ${vars.color.lineStrong}`,
    borderRadius: vars.radius.control,
    background: vars.color.surface,
    color: vars.color.ink,
    fontSize: vars.fontSize.body,
    lineHeight: vars.lineHeight.body,
    cursor: 'pointer',
    transition: `border-color ${vars.motion.fast} ${vars.motion.easeOut}, background-color ${vars.motion.fast} ${vars.motion.easeOut}`,
    selectors: {
      '&:hover:not(:has(input:disabled))': {
        borderColor: vars.color.inputBorder,
      },
      '&:has(input:checked)': {
        borderColor: vars.color.accent,
        background: vars.color.selected,
      },
      '&:has(input:disabled)': {
        color: vars.color.subtle,
        cursor: 'not-allowed',
      },
    },
    '@media': {
      '(prefers-reduced-motion: reduce)': { transition: 'none' },
    },
  })
);

/** 가운데 점이 채워지는 원형 라디오다. */
export const radio = style(
  layered({
    appearance: 'none',
    flexShrink: 0,
    width: 20,
    height: 20,
    margin: '3px 0 0',
    border: `1.5px solid ${vars.color.inputBorder}`,
    borderRadius: '50%',
    background: vars.color.surface,
    cursor: 'inherit',
    selectors: {
      '&:checked': {
        borderColor: vars.color.accent,
        boxShadow: `inset 0 0 0 4px ${vars.color.surface}`,
        background: vars.color.accent,
      },
      '&:disabled': { borderColor: vars.color.lineStrong },
    },
  })
);

/** 선택지 문구와 보조 설명 묶음이다. */
export const text = style(
  layered({ display: 'grid', gap: vars.space.xxs, minWidth: 0 })
);

/** 선택지 아래 보조 설명이다. */
export const description = style(
  layered({
    color: vars.color.muted,
    fontSize: vars.fontSize.small,
    lineHeight: vars.lineHeight.small,
  })
);
