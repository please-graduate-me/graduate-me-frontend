import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 학습 홈의 본문 크기를 다른 학습 화면과 분리한다. */
export const root = style({ fontSize: vars.fontSize.small });

/** 실제 계정 인사와 자료 추가 행동을 한 행에 정렬한다. */
export const intro = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 24,
  marginBottom: 28,
});

globalStyle('.' + intro + ' h1', {
  fontSize: vars.fontSize.heading2,
  lineHeight: '34px',
  letterSpacing: '-0.5px',
  margin: 0,
});

globalStyle('.' + intro + ' p', {
  color: vars.color.muted,
  fontSize: vars.fontSize.caption,
  margin: '0 0 4px',
});
