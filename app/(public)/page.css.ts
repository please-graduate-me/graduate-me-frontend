import { style, globalStyle } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 짧은 소개 뒤에서 체험을 바로 시작하게 한다. */
export const intro = style({
  padding: '20px 0 0',
  '@media': { '(max-width: 800px)': { paddingTop: 0 } },
});

globalStyle(`.${intro} h1`, {
  margin: 0,
  fontSize: 32,
  lineHeight: 1.3,
  letterSpacing: '-1px',
  '@media': { '(max-width: 900px)': { fontSize: 28 } },
});

globalStyle(`.${intro} p`, { color: vars.color.muted, margin: '12px 0' });

/** 체험 이후에 계정 학습으로 이어지는 행동을 제시한다. */
export const account = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 24,
  borderBlock: `1px solid ${vars.color.line}`,
  padding: '28px 0',
  marginTop: 40,
  '@media': {
    '(max-width: 900px)': { flexDirection: 'column', alignItems: 'flex-start' },
    '(max-width: 800px)': { marginTop: 32 },
  },
});

globalStyle(`.${account} h2`, { margin: '0 0 8px', fontSize: 21 });

globalStyle(`.${account} p`, {
  margin: 0,
  color: vars.color.muted,
  fontSize: 14,
});

/** 로그인한 사용자의 이동과 로그아웃을 함께 제공한다. */
export const accountActions = style({
  display: 'flex',
  alignItems: 'center',
  gap: 16,
  flexWrap: 'wrap',
});

/** 개인 목록 이동을 홈의 주 행동으로 구분한다. */
export const libraryLink = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: vars.color.accent,
  color: vars.color.surface,
  border: `1px solid ${vars.color.accent}`,
  borderRadius: vars.radius.control,
  padding: '10px 16px',
  textDecoration: 'none',
  fontWeight: 600,
  minHeight: 46,
  selectors: { '&:hover': { filter: 'brightness(.94)' } },
});

/** 로그인 실패 시 다시 시작할 수 있도록 원인을 표시한다. */
export const error = style({
  padding: '14px 16px',
  borderRadius: vars.radius.control,
  margin: '16px 0',
  color: vars.color.error,
  background: vars.color.errorBackground,
});

/** 로그인할 수 없어도 체험을 계속 이용할 수 있음을 알린다. */
export const notice = style({
  padding: '14px 16px',
  borderRadius: vars.radius.control,
  margin: '16px 0',
  background: vars.color.notice,
});
