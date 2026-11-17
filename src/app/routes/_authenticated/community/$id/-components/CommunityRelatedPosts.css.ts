import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 제목과 글 목록을 좁은 간격으로 쌓는다. */
export const root = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xxs,
});

/** 보조 열 제목은 본문 제목보다 작은 15px로 둔다. */
export const title = style({ margin: '0 0 8px', fontSize: 15 });

/** 글 제목 링크를 목록 표식 없이 쌓는다. */
export const list = style({ margin: 0, padding: 0, listStyle: 'none' });

/** 글 사이를 옅은 위 구분선으로 나눈다. */
export const item = style({ borderTop: `1px solid ${vars.color.neutral}` });

/** 제목 링크는 줄 전체를 눌러 이동할 수 있게 블록으로 넓힌다. */
export const link = style({
  display: 'block',
  padding: '10px 0',
  color: vars.color.ink,
  fontSize: vars.fontSize.small,
  fontWeight: vars.fontWeight.bold,
  lineHeight: 1.5,
  textDecoration: 'none',
  overflowWrap: 'anywhere',
});
