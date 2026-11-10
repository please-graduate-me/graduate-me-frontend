import { style, styleVariants } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 작은 상태 문구를 제목과 구분하면서 한 줄로 유지한다. */
export const root = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  padding: '4px 10px',
  minHeight: 28,
  borderRadius: vars.radius.control,
  fontSize: vars.fontSize.caption,
  lineHeight: vars.lineHeight.caption,
  whiteSpace: 'nowrap',
  fontWeight: 400,
});

/** 검토·오류·성공의 의미가 화면마다 달라지지 않게 한다. */
export const tones = styleVariants({
  neutral: { background: '#f2f5fc', color: vars.color.muted },
  brand: { background: vars.color.selected, color: vars.color.accent },
  success: { background: vars.color.success, color: vars.color.match },
  warning: { background: vars.color.notice, color: vars.color.warning },
  error: { background: vars.color.errorBackground, color: vars.color.error },
  review: { background: vars.color.reviewBackground, color: vars.color.review },
});
