import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 격자 칸 높이에 맞춰 타일이 늘어나게 한다. */
export const item = style({ display: 'flex', minWidth: 0 });

/** 격자 칸을 채우는 흰 카드이며 올리면 살짝 떠오른다. */
export const tile = style({
  flex: 1,
  minWidth: 0,
  transition: 'transform 180ms ease',
  selectors: {
    '&:hover, &:focus-within': { transform: 'translateY(-3px)' },
  },
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      transition: 'none',
      selectors: { '&:hover, &:focus-within': { transform: 'none' } },
    },
  },
});

/** 카드 안 내용을 가운데 정렬로 쌓고 상태 줄을 아래에 붙인다. */
export const body = style({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: vars.space.sm,
  paddingTop: 10,
  textAlign: 'center',
  overflowWrap: 'anywhere',
});

/** 자료 종류를 나타내는 장식 그림은 타일에 올리면 살짝 기울어진다. */
export const art = style({
  flex: 'none',
  transition: 'transform 250ms cubic-bezier(0.3, 1.4, 0.5, 1)',
  selectors: {
    [`${tile}:hover &, ${tile}:focus-within &`]: {
      transform: 'rotate(-4deg) scale(1.06)',
    },
  },
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      transition: 'none',
      selectors: {
        [`${tile}:hover &, ${tile}:focus-within &`]: { transform: 'none' },
      },
    },
  },
});

/** 실제 진도 막대는 카드 폭을 모두 사용한다. */
export const progress = style({ alignSelf: 'stretch' });

/** 언어·분량·공유 범위 같은 보조 정보를 작게 묶는다. */
export const details = style({
  display: 'grid',
  gap: 2,
  color: vars.color.muted,
  fontSize: vars.fontSize.caption,
  lineHeight: 1.5,
});

/** 준비 상태와 최근 활동일은 카드 아래쪽에 고정한다. */
export const status = style({
  marginTop: 'auto',
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  alignItems: 'center',
  gap: vars.space.xs,
  color: vars.color.muted,
  fontSize: vars.fontSize.caption,
});

/** 관리 메뉴와 바로가기는 카드 오른쪽 위 모서리에 띄워 둔다. */
export const action = style({
  position: 'absolute',
  top: 6,
  right: 6,
  zIndex: 1,
});
