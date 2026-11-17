import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 미리보기 배치만 정하고 카드 선택 상태는 공통 SelectableCard가 표현한다. */
export const root = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: vars.space.xs,
  marginBottom: vars.space.compact,
  width: '100%',
});

/** 축소한 페이지를 종이처럼 감싸고 현재 쪽만 짙은 테두리로 구분한다. */
export const frame = style({
  display: 'block',
  borderRadius: 8,
  overflow: 'hidden',
  // 테두리 대신 그림자 선을 써서 선택이 바뀌어도 미리보기 크기가 흔들리지 않게 한다.
  boxShadow: `0 0 0 1px ${vars.color.line}`,
  transition: 'box-shadow 0.15s ease, transform 0.15s ease',
  selectors: {
    '&[data-selected="true"]': { boxShadow: '0 0 0 2px #16181D' },
    [`${root}:hover &`]: { transform: 'translateY(-2px)' },
  },
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      transition: 'none',
      selectors: { [`${root}:hover &`]: { transform: 'none' } },
    },
  },
});

/** 쪽 번호는 작게 두고 현재 쪽만 진하게 표시한다. */
export const number = style({
  fontSize: 12,
  fontWeight: 700,
  fontVariantNumeric: 'tabular-nums',
  color: vars.color.muted,
  selectors: { '&[data-selected="true"]': { color: vars.color.ink } },
});
