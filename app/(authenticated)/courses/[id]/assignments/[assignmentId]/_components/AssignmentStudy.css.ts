import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 원본 음성을 답안과 같은 과제 영역에서 재생한다. */
export const player = style({
  width: '100%',
  aspectRatio: '16 / 9',
  maxWidth: 640,
  border: 0,
  borderRadius: vars.radius.control,
  background: vars.color.video,
});
