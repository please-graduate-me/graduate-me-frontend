import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 먹색 문제 풀기 버튼 안의 예상 XP를 밝은 청록 숫자로 덧붙이며 이 버튼에만 쓰는 색이다. */
export const practiceXp = style({
  marginInlineStart: vars.space.sm,
  fontFamily: vars.font.numeric,
  fontSize: vars.fontSize.label,
  fontWeight: vars.fontWeight.bold,
  color: '#7FE0C2',
});
