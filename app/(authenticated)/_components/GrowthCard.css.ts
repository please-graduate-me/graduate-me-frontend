import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 홈의 학습 흐름 위에서 개인 성장과 목표를 한 줄로 보여 준다. */
export const card = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space.lg,
});

/** 영역의 의미를 레벨 수치와 구분해 안내한다. */
export const eyebrow = style({
  color: vars.color.muted,
  fontSize: vars.fontSize.small,
});

/** 진행률의 외형과 접근성은 Astryx에 맡기고 폭만 제한한다. */
export const progress = style({
  width: 'min(280px, 100%)',
});

/** 개인 성장에서 선택 공개 랭킹으로 이동할 수 있게 한다. */
export const link = style({ color: vars.color.accent, fontWeight: 700 });
