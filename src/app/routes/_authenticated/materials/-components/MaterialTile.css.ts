import { style, styleVariants } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 격자 칸 높이에 맞춰 타일이 늘어나게 한다. */
export const item = style({ display: 'flex', minWidth: 0 });

/** 격자 칸을 채우는 흰 카드이며 떠오름과 테두리 진해짐은 ClickableCard 옵션이 맡는다. */
export const tile = style({ flex: 1, minWidth: 0 });

/** 카드 안 내용을 가운데 정렬로 쌓고 요약 줄을 아래에 붙인다. */
export const body = style({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: vars.space.compact,
  padding: '10px 0 4px',
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

/** 진도 막대는 카드 폭을 모두 쓴다. */
export const progress = style({ alignSelf: 'stretch' });

/** "PDF · 18 / 28쪽" 같은 한 줄 요약은 카드 아래쪽에 붙인다. */
export const caption = style({
  marginTop: 'auto',
  fontSize: vars.fontSize.caption,
  fontWeight: vars.fontWeight.bold,
  fontVariantNumeric: 'tabular-nums',
});

/** 요약 줄은 기본 회색, 제출 완료는 청록, 마감 임박은 주황, 실패는 빨강이다. */
export const captionTone = styleVariants({
  muted: { color: vars.color.muted },
  accent: { color: vars.color.accent },
  warning: { color: vars.color.warning },
  error: { color: vars.color.error },
});

/** 이어서·마감 표지는 카드 오른쪽 위에 작은 알약으로 띄운다. */
export const pill = style({
  position: 'absolute',
  top: 10,
  right: 10,
  padding: '2px 8px',
  borderRadius: vars.radius.pill,
  fontSize: '11px',
  fontWeight: vars.fontWeight.heavy,
  lineHeight: '16px',
});

/** 이어서는 밝은 청록 바탕, 마감은 옅은 주황 바탕이다. */
export const pillTone = styleVariants({
  accent: { background: vars.color.accent, color: vars.color.onAccent },
  warning: { background: vars.color.notice, color: vars.color.warning },
});

/** 관리 메뉴는 카드 왼쪽 위 모서리에 띄워 오른쪽 알약과 겹치지 않게 한다. */
export const action = style({
  position: 'absolute',
  top: 6,
  left: 6,
  zIndex: 1,
});
