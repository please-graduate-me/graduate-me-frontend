import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 학습 도구는 탐색 메뉴 없이 원본과 편집 영역에 전체 화면을 제공한다. */
export const immersive = style({
  minHeight: '100dvh',
  background: vars.color.background,
});

/** 탐색 UI 외형은 공통 TopNav에 맡기고 본문 폭과 반응형 여백만 조정한다. */
export const content = style({
  maxWidth: 1200,
  marginInline: 'auto',
  padding: '32px',
  minWidth: 0,
  '@media': { '(max-width: 800px)': { padding: '20px 16px' } },
});
