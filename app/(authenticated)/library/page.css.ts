import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 확정 시안의 본문 크기를 목록 화면에 한정한다. */
export const root = style({ fontSize: 15 });

/** 화면 제목과 계정 행동을 한 행에서 구별한다. */
export const intro = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 16,
  marginBottom: 32,
  '@media': { '(max-width: 800px)': { marginBottom: 24 } },
});

globalStyle(`.${intro} h1`, {
  fontSize: 36,
  lineHeight: 1.3,
  letterSpacing: '-1px',
  margin: 0,
  '@media': { '(max-width: 800px)': { fontSize: 28 } },
});

globalStyle(`.${intro} p`, { color: vars.color.muted, margin: '8px 0 0' });

/** 로그아웃이 좁은 화면에서 줄바꿈되지 않게 한다. */
export const auth = style({
  flexShrink: 0,
  '@media': { '(max-width: 800px)': { fontSize: 12 } },
});
