import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 공개 화면도 학습 공간과 같은 공통 배경과 본문 폭을 따른다. */
export const root = style({
  minHeight: '100dvh',
  background: vars.color.background,
});

/** 소개와 체험 콘텐츠를 읽기 좋은 폭으로 배치한다. */
export const main = style({
  maxWidth: 1440,
  marginInline: 'auto',
  padding: '40px 48px',
  '@media': { '(max-width: 800px)': { padding: '24px 16px' } },
});

/** 하단 안내는 콘텐츠 폭과 같은 기준선에 둔다. */
export const footer = style({
  maxWidth: 1344,
  marginInline: 'auto',
  padding: '24px',
  borderTop: '1px solid ' + vars.color.line,
});
