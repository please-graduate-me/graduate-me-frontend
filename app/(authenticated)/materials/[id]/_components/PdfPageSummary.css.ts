import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 진행 알약, 요약, 단어 칩을 패널 위쪽에 촘촘히 쌓는다. */
export const root = style({
  display: 'grid',
  justifyItems: 'start',
  gap: vars.space.compact,
});

/** 번역 진행 알약은 숫자 서체로 쪽수를 맞춘다. */
export const progress = style({
  fontFamily: vars.font.numeric,
  fontVariantNumeric: 'tabular-nums',
});

/** 현재 쪽 요약 제목이다. */
export const heading = style({ fontSize: 16 });

/** 핵심 단어 제목은 요약 제목보다 한 단계 작게 둔다. */
export const subheading = style({ fontSize: 14, marginTop: vars.space.xs });

/** 요약 본문은 패널 폭 안에서 넉넉한 줄 간격으로 읽힌다. */
export const summary = style({
  fontSize: 14,
  lineHeight: 1.7,
  whiteSpace: 'pre-wrap',
});

/** 단어 칩은 목록 기호 없이 줄바꿈되는 알약 묶음이다. */
export const chips = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: vars.space.xs,
  margin: 0,
  padding: 0,
  listStyle: 'none',
});

/** 단어는 숫자 서체로 시안의 알약 칩처럼 조금 크게 둔다. */
export const chip = style({
  fontFamily: vars.font.numeric,
  fontSize: 13,
  paddingBlock: vars.space.xs,
  paddingInline: vars.space.compact,
});
