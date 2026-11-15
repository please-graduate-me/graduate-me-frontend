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

/** 라벨 글자와 필수 표지를 한 줄에 둔다. */
export const labelRow = style(
  layered({
    display: 'inline-flex',
    alignItems: 'center',
    gap: vars.space.xs,
    minWidth: 0,
  })
);

/** 강조해야 하는 확인 입력의 큰 라벨이다. */
export const labelLarge = style(
  layered({ fontSize: '15px', fontWeight: vars.fontWeight.heavy })
);

/** 라벨 옆 회색 "필수" 표지다. */
export const requiredTag = style(
  layered({
    display: 'inline-flex',
    alignItems: 'center',
    padding: '1px 6px',
    borderRadius: 6,
    background: vars.color.neutral,
    color: vars.color.muted,
    fontSize: '11px',
    fontWeight: vars.fontWeight.heavy,
    lineHeight: '16px',
  })
);

/** 52px 높이의 큰 입력이다. */
export const controlLarge = style({
  fontSize: '15px',
  ...layered({ minHeight: 52, borderRadius: '14px' }),
});

/** 큰 검색 입력은 시안의 16px 둥근 회색 막대로 그린다. */
export const searchLarge = style(layered({ borderRadius: '16px' }));

/** 앞 아이콘과 입력을 겹쳐 두는 상자다. */
export const controlBox = style(
  layered({ position: 'relative', display: 'block', minWidth: 0 })
);

/** 입력 앞에 겹쳐 두는 아이콘으로, 누르면 입력에 초점이 가도록 포인터를 통과시킨다. */
export const startIcon = style(
  layered({
    position: 'absolute',
    top: '50%',
    left: 16,
    color: vars.color.muted,
    transform: 'translateY(-50%)',
    pointerEvents: 'none',
  })
);

/** 앞 아이콘 자리만큼 글자를 오른쪽으로 민다. */
export const withStartIcon = style(layered({ paddingLeft: 44 }));

/** 되돌릴 수 없는 작업의 확인 입력으로, 초점 고리를 위험 색으로 바꾼다. */
export const toneDanger = style(
  layered({
    selectors: {
      '&:focus': {
        borderColor: vars.color.error,
        boxShadow: `0 0 0 3px ${vars.color.errorLine}`,
      },
    },
  })
);

/** 생성된 주소처럼 결과 값을 담은 입력을 연청록 테두리로 구분한다. */
export const toneAccent = style(
  layered({ borderColor: vars.color.accentLine })
);

/** 어두운 면 위에 놓는 테두리 없는 입력이다. */
export const borderless = style(
  layered({
    borderColor: 'transparent',
    selectors: {
      '&:hover:not(:disabled):not(:focus)': { borderColor: 'transparent' },
    },
  })
);

/** 코드·주소·확인 문구처럼 글자를 하나씩 확인하는 값을 숫자 서체와 넓은 자간으로 보여 준다. */
export const numeric = style({
  fontFamily: vars.font.numeric,
  fontWeight: vars.fontWeight.bold,
  fontVariantNumeric: 'tabular-nums',
  letterSpacing: '0.04em',
});

/** 밑줄형 인라인 빈칸으로, 문장 글자 크기를 따르고 채운 글자는 숫자 서체 청록으로 보인다. */
export const blank = style({
  color: vars.color.accent,
  fontFamily: vars.font.numeric,
  fontSize: 'inherit',
  fontWeight: vars.fontWeight.bold,
  lineHeight: 1.2,
  selectors: {
    '&:focus-visible': { outline: '2px solid transparent', outlineOffset: 0 },
    '&[data-status="incorrect"]': { color: vars.color.warning },
    '&:disabled': { color: vars.color.subtle },
  },
  ...layered({
    display: 'inline-block',
    minWidth: 0,
    height: '1.85em',
    minHeight: 44,
    margin: '0 0.3em 0 0',
    padding: '0 10px',
    border: 0,
    borderBottom: `3px solid ${vars.color.inputBorder}`,
    borderRadius: '10px 10px 0 0',
    background: vars.color.canvas,
    textAlign: 'center',
    verticalAlign: 'middle',
    transition: `border-color ${vars.motion.fast} ${vars.motion.easeOut}, background-color ${vars.motion.fast} ${vars.motion.easeOut}`,
    selectors: {
      '&::placeholder': { color: vars.color.subtle, opacity: 1 },
      '&:focus': {
        borderBottomColor: vars.color.accent,
        background: vars.color.selected,
      },
      '&[data-status="correct"]': {
        borderBottomColor: vars.color.accent,
        background: vars.color.selected,
      },
      '&[data-status="incorrect"]': {
        borderBottomColor: vars.color.streak,
        background: vars.color.notice,
      },
      '&:disabled': { cursor: 'not-allowed' },
    },
    '@media': {
      '(prefers-reduced-motion: reduce)': { transition: 'none' },
    },
  }),
});
