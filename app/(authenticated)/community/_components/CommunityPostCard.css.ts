import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 카드에 올리거나 초점을 두면 살짝 떠올라 누를 수 있는 글임을 알린다. */
export const card = style({
  minWidth: 0,
  transition: 'transform 180ms ease, filter 180ms ease',
  selectors: {
    '&:hover, &:focus-within': {
      transform: 'translateY(-2px)',
      // Astryx 카드의 box-shadow 목록을 건드리지 않도록 그림자는 filter로 더한다.
      filter: 'drop-shadow(0 10px 24px rgba(22, 24, 29, 0.07))',
    },
  },
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      transition: 'none',
      selectors: { '&:hover, &:focus-within': { transform: 'none' } },
    },
  },
});

/** 카드 안 요소를 읽는 순서대로 일정한 간격으로 쌓는다. */
export const content = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 14,
  minWidth: 0,
});

/** 글 종류 배지와 작성 시각을 한 줄 양 끝에 둔다. */
export const header = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 8,
});

/** 작성 시각은 배지보다 낮은 위계로 오른쪽 끝에 붙인다. */
export const time = style({
  marginLeft: 'auto',
  color: vars.color.muted,
  fontSize: vars.fontSize.caption,
  fontWeight: 700,
});

/** 공유 원문은 따뜻한 바탕의 본문 서체 인용으로 질문과 구분한다. */
export const quote = style({
  margin: 0,
  padding: '12px 16px',
  borderRadius: 12,
  background: '#FFF8EE',
  color: '#33363F',
  fontFamily: vars.font.document,
  fontSize: 15,
  lineHeight: 1.6,
  overflowWrap: 'anywhere',
});

/** 긴 발췌가 목록을 늘리지 않게 세 줄까지만 보이고 따옴표는 표시로만 붙인다. */
export const quoteText = style({
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 3,
  overflow: 'hidden',
  whiteSpace: 'pre-wrap',
  quotes: '"“" "”"',
  selectors: {
    '&::before': { content: 'open-quote' },
    '&::after': { content: 'close-quote' },
  },
});

/** 자료 제목과 위치는 인용보다 작은 본문 서체로 덧붙인다. */
export const quoteSource = style({
  display: 'block',
  marginTop: 6,
  fontFamily: vars.font.body,
  fontSize: vars.fontSize.caption,
  fontWeight: 700,
  color: vars.color.muted,
});

/** 작성자, 태그된 조교와 반응 수를 카드 아래 한 줄에 모은다. */
export const footer = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 14,
  fontSize: 13,
  fontWeight: 700,
  color: vars.color.muted,
});

/** 작성자 이름은 머리글자 아바타와 함께 본문 색으로 둔다. */
export const author = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  color: vars.color.ink,
});

/** 태그된 조교는 테두리만 있는 알약 표시로 구분한다. */
export const tag = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  padding: '3px 10px',
  borderRadius: 999,
  border: `1px solid ${vars.color.line}`,
});

/** 추천과 댓글 수는 오른쪽 끝에 붙인다. */
export const stats = style({
  marginLeft: 'auto',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 14,
});

/** 수치 앞의 아이콘과 글자를 붙여 둔다. */
export const stat = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  fontVariantNumeric: 'tabular-nums',
});
