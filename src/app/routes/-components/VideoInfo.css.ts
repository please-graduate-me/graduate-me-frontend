import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 영상 정보를 학습 조작과 분리한다. */
export const container = style({ marginBottom: '20px' });

/** 보조 정보가 학습 제목보다 강조되지 않게 한다. */
export const description = style({
  fontSize: '13px',
  color: vars.color.muted,
  margin: '8px 0',
});
