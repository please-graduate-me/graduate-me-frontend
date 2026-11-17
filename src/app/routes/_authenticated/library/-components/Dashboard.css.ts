import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 이어서 학습 묶음과 오늘의 복습을 한 열로 쌓는다. */
export const workspace = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr)',
  gap: 28,
});

/** 복습 제목과 카드 줄 사이 간격만 정한다. */
export const review = style({
  display: 'grid',
  gap: 14,
  margin: 0,
});

/** 시안의 18px 영역 제목 크기를 쓴다. */
export const reviewTitle = style({ fontSize: vars.fontSize.heading3 });

/** 세 복습 카드를 같은 폭으로 두고 좁으면 줄바꿈한다. */
export const reviewCards = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: 14,
});
