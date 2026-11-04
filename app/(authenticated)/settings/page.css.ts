import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 설정을 마친 뒤 개인 목록으로 돌아가게 한다. */
export const back = style({ fontSize: 14 });

/** 짧은 설정 목록의 읽는 폭을 제한한다. */
export const page = style({
  maxWidth: 800,
  margin: '36px auto 0',
  '@media': { '(max-width: 800px)': { marginTop: 28 } },
});

/** 설정 범위 안내를 조작부와 구분한다. */
export const intro = style({});

globalStyle(`.${intro} h1`, {
  fontSize: 34,
  lineHeight: 1.3,
  letterSpacing: '-1px',
  margin: '0 0 12px',
  '@media': { '(max-width: 800px)': { fontSize: 28 } },
});

globalStyle(`.${intro} p`, {
  margin: 0,
  color: vars.color.muted,
  fontSize: 14,
});

/** 관리자만 보는 보조 이동을 개인 설정 아래에 둔다. */
export const admin = style({ display: 'block', marginTop: 24, fontSize: 14 });
