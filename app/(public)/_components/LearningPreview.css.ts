import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 원문 카드와 표현 카드를 그림판 안에 세로로 쌓는다. */
export const root = style({
  display: 'grid',
  gap: 16,
  width: '100%',
  maxWidth: 440,
});

/** 원문 카드의 긴 내용이 배치 너비를 밀어내지 않게 한다. */
export const reading = style({ minWidth: 0 });

globalStyle(`${reading} small`, {
  color: vars.color.documentInk,
  fontSize: vars.fontSize.caption,
});

/** 예시 원문의 세리프 서체와 넓은 행간을 유지한다. */
export const readingTitle = style({
  margin: '14px 0 12px',
  fontFamily: vars.font.document,
  fontSize: 24,
  lineHeight: 1.5,
  color: vars.color.documentInk,
});

/** 원문의 선택 구절을 배경색으로 구별한다. */
export const highlight = style({
  background: vars.color.notice,
  color: vars.color.documentInk,
  fontFamily: vars.font.document,
  fontSize: 16,
  padding: 8,
  margin: 0,
});

/** 표현 예시는 저장된 개인 데이터와 혼동하지 않도록 소개 안에 한정한다. */
export const expression = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: 10,
});

/** 표현의 영문 제목과 저장 아이콘을 한 행에 놓는다. */
export const expressionTitle = style({
  display: 'flex',
  gap: 12,
  alignItems: 'center',
  color: vars.color.muted,
});

/** 원문 출처의 아이콘과 페이지 문구를 작은 크기로 정렬한다. */
export const source = style({
  display: 'inline-flex',
  gap: 6,
  alignItems: 'center',
  fontSize: vars.fontSize.caption,
  color: vars.color.muted,
});
