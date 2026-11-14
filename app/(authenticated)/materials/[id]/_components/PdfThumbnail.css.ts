import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 미리보기 배치만 정하고 선택 상태는 Astryx가 표현한다. */
export const root = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: vars.space.sm,
  marginBottom: vars.space.sm,
  width: '100%',
});
