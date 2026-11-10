import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** PDF를 끌어 놓거나 파일 선택으로 같은 등록 흐름을 시작한다. */
export const dropzone = style({
  display: 'grid',
  gap: vars.space.md,
  justifyItems: 'center',
  textAlign: 'center',
  padding: vars.space.xl,
  background: vars.color.canvas,
  border: `1px dashed ${vars.color.inputBorder}`,
  borderRadius: vars.radius.control,
});
