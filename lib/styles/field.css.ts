import { style } from '@vanilla-extract/css';
import { layered } from './layers.css';
import { vars } from './theme.css';

/** 라벨, 입력, 안내 문구를 세로로 묶는다. */
export const field = style(
  layered({ display: 'grid', gap: vars.space.xs, minWidth: 0 })
);

/** 입력 위에 보이는 라벨이다. */
export const label = style(
  layered({
    color: vars.color.ink,
    fontSize: vars.fontSize.small,
    fontWeight: vars.fontWeight.bold,
    lineHeight: vars.lineHeight.small,
  })
);

/** 입력 아래 보조 설명이다. */
export const hint = style(
  layered({
    margin: 0,
    color: vars.color.muted,
    fontSize: vars.fontSize.label,
    lineHeight: vars.lineHeight.caption,
  })
);

/** 입력 오류 문구다. */
export const error = style(
  layered({
    margin: 0,
    color: vars.color.error,
    fontSize: vars.fontSize.label,
    fontWeight: vars.fontWeight.bold,
    lineHeight: vars.lineHeight.caption,
  })
);

/** 한 줄·여러 줄·선택 입력의 공통 테두리와 청록 초점 고리이며, 전역 글자 초기화를 이기도록 글자 속성만 계층 밖에 둔다. */
export const control = style({
  color: vars.color.ink,
  fontSize: vars.fontSize.body,
  lineHeight: vars.lineHeight.body,
  selectors: {
    // 전역 초점 외곽선 대신 테두리와 고리로 표시하고 고대비 모드용 투명 외곽선만 남긴다.
    '&:focus-visible': { outline: '2px solid transparent', outlineOffset: 0 },
    '&:disabled': { color: vars.color.subtle },
  },
  ...layered({
    display: 'block',
    width: '100%',
    minWidth: 0,
    minHeight: 48,
    margin: 0,
    padding: '0 14px',
    border: `1px solid ${vars.color.lineStrong}`,
    borderRadius: vars.radius.control,
    background: vars.color.surface,
    fontFamily: 'inherit',
    transition: `border-color ${vars.motion.fast} ${vars.motion.easeOut}, box-shadow ${vars.motion.fast} ${vars.motion.easeOut}`,
    selectors: {
      '&::placeholder': { color: vars.color.subtle, opacity: 1 },
      '&:hover:not(:disabled):not(:focus)': {
        borderColor: vars.color.inputBorder,
      },
      '&:focus': {
        borderColor: vars.color.accent,
        boxShadow: `0 0 0 3px ${vars.color.accentLine}`,
      },
      '&[aria-invalid="true"]': { borderColor: vars.color.error },
      '&[aria-invalid="true"]:focus': {
        boxShadow: `0 0 0 3px ${vars.color.errorBackground}`,
      },
      '&[readonly]': { background: vars.color.canvas },
      '&:disabled': {
        background: vars.color.canvas,
        cursor: 'not-allowed',
      },
    },
    '@media': {
      '(prefers-reduced-motion: reduce)': { transition: 'none' },
    },
  }),
});

/** 검색 입력은 테두리 대신 옅은 바탕으로 구분한다. */
export const search = style(
  layered({
    background: vars.color.canvas,
    borderColor: 'transparent',
    selectors: { '&:focus': { background: vars.color.surface } },
  })
);

/** 여러 줄 입력은 줄 수에 맞춰 늘고 세로로만 크기를 바꾼다. */
export const multiline = style(
  layered({ minHeight: 96, padding: '12px 14px', resize: 'vertical' })
);
