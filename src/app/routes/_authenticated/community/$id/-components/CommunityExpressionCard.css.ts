import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 제목, 발췌, 안내와 저장 동작을 일정한 간격으로 쌓는다. */
export const root = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.compact,
});

/** 보조 열 제목은 본문 제목보다 작은 15px로 둔다. */
export const title = style({ margin: 0, fontSize: 15 });

/** 저장할 발췌는 숫자 글꼴의 굵은 글자로 보이고 길면 세 줄에서 자른다. */
export const quote = style({
  margin: 0,
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 3,
  overflow: 'hidden',
  fontFamily: vars.font.numeric,
  fontSize: vars.fontSize.body,
  fontWeight: vars.fontWeight.bold,
  overflowWrap: 'anywhere',
});

/** 범위 조정 안내는 발췌보다 작은 회색 글자로 둔다. */
export const note = style({ fontSize: 13, lineHeight: 1.6 });

/** 저장 완료 안내는 청록 글자로 버튼 자리를 대신한다. */
export const saved = style({
  color: vars.color.accent,
  fontSize: vars.fontSize.small,
  fontWeight: vars.fontWeight.bold,
});
