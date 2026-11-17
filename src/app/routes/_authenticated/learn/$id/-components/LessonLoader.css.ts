import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 자료 준비 안내를 상태와 작업보다 낮은 위계로 표시한다. */
export const muted = style({ color: vars.color.muted });

/** 준비 상태와 복구 조작을 카드 안에서 구분한다. */
export const processing = style({
  display: 'grid',
  gap: vars.space.md,
  marginTop: vars.space.lg,
});
