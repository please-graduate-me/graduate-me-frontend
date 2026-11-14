import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 원문 선택 위치에 공식 도구 모음을 배치하고 테마 그림자를 사용한다. */
export const root = style({
  position: 'absolute',
  zIndex: 4,
  borderRadius: vars.radius.panel,
  background: vars.color.surface,
  boxShadow: vars.shadow.popover,
});
