import { style, globalStyle } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 헤더에서 홈 진입점을 쉽게 구분하게 한다. */
export const brand = style([
  {
    fontSize: '23px',
    fontWeight: '800',
    textDecoration: 'none',
  },
]);

/** 화면 폭에 따라 공통 헤더와 본문의 정렬을 맞춘다. */
export const siteHeader = style([
  {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    padding: '20px max(24px, calc((100vw - 1344px) / 2))',
    borderBottom: `1px solid ${vars.color.line}`,
    borderTop: `4px solid ${vars.color.accent}`,
    flexWrap: 'wrap',
    background: vars.color.surface,
  },
]);

/** 넓은 화면에서 본문이 지나치게 길어지지 않게 한다. */
export const main = style([
  {
    maxWidth: '1440px',
    padding: '24px 64px 60px',
    margin: 'auto',
    minHeight: '80vh',
  },
  {
    '@media': { '(max-width: 800px)': { padding: '24px 16px' } },
  },
]);

/** 서비스 설명과 본문 콘텐츠의 경계를 드러낸다. */
export const footer = style([
  {
    padding: '24px',
    textAlign: 'center',
    color: vars.color.muted,
    borderTop: `1px solid ${vars.color.line}`,
    fontSize: '14px',
  },
]);

globalStyle(`.${siteHeader} span`, {
  color: vars.color.muted,
  fontSize: '14px',
});

globalStyle(`.${siteHeader} span`, {
  '@media': { '(max-width: 800px)': { display: 'none' } },
});
