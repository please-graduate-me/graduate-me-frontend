import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 순위 카드 안 머리와 목록의 간격, 가리킬 때 떠오르는 움직임만 정한다. */
export const root = style({
  display: 'grid',
  gap: vars.space.compact,
  paddingBottom: vars.space.compact,
  transition: 'transform 180ms ease, box-shadow 180ms ease',
  selectors: {
    '&:hover': { transform: 'translateY(-2px)', boxShadow: vars.shadow.lift },
  },
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      transition: 'none',
      selectors: { '&:hover': { transform: 'none' } },
    },
  },
});

/** 표지, 제목, 이동 화살표를 한 줄에 둔다. */
export const header = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.compact,
});

/** 긴 문구가 화살표를 밀지 않게 남은 폭만 쓴다. */
export const heading = style({ flex: '1 1 auto', minWidth: 0 });

/** 시안의 14px 카드 제목이다. */
export const title = style({ fontSize: vars.fontSize.small });

/** 이번 주 XP와 남은 날을 12px로 둔다. */
export const meta = style({
  marginTop: 2,
  fontSize: vars.fontSize.caption,
});

/** 랭킹 이동은 44px 누름 영역의 화살표 링크다. */
export const more = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  width: 44,
  height: 44,
  borderRadius: vars.radius.control,
  color: vars.color.muted,
  selectors: { '&:hover': { background: vars.color.canvas } },
});

/** 순위 세 줄의 기본 목록 모양을 없앤다. */
export const list = style({
  display: 'grid',
  gap: 2,
  margin: 0,
  padding: 0,
  listStyle: 'none',
});

/** 순위, 아바타, 닉네임, XP를 한 줄에 두고 내 줄은 청록 바탕으로 구분한다. */
export const row = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
  padding: 8,
  borderRadius: vars.radius.control,
  selectors: { '&[data-me]': { background: vars.color.selected } },
});

/** 순위 숫자는 숫자 서체로 폭을 맞춘다. */
export const rank = style({
  width: 20,
  fontFamily: vars.font.numeric,
  fontSize: vars.fontSize.label,
  fontWeight: vars.fontWeight.bold,
  fontVariantNumeric: 'tabular-nums',
  color: vars.color.subtle,
  selectors: { [`${row}[data-me] &`]: { color: vars.color.accent } },
});

/** 긴 닉네임은 한 줄에서 말줄임한다. */
export const name = style({
  flex: '1 1 auto',
  minWidth: 0,
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  fontSize: vars.fontSize.small,
  fontWeight: 600,
  selectors: { [`${row}[data-me] &`]: { fontWeight: vars.fontWeight.heavy } },
});

/** XP는 숫자 서체로 오른쪽 끝에 둔다. */
export const xp = style({
  fontFamily: vars.font.numeric,
  fontSize: vars.fontSize.label,
  fontWeight: vars.fontWeight.bold,
  fontVariantNumeric: 'tabular-nums',
  color: vars.color.muted,
  selectors: { [`${row}[data-me] &`]: { color: vars.color.accent } },
});

/** 순위가 없을 때 안내 문구 간격이다. */
export const empty = style({ margin: 0 });
