import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 공개 화면에도 공통 브랜드 선과 배경을 적용한다. */
export const root = style({
  borderTop: '4px solid ' + vars.color.accent,
  minHeight: '100vh',
});

/** 데스크톱 공개 탐색을 본문과 같은 기준선에 정렬한다. */
export const header = style({
  height: 104,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 32px',
});

/** 서비스 로고의 글꼴과 강조색을 학생 앱과 맞춘다. */
export const brand = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 20,
  textDecoration: 'none',
  fontSize: 23,
  fontWeight: 700,
  lineHeight: '30px',
});

/** 원문을 읽는 서비스의 마크를 텍스트 브랜드와 함께 표시한다. */
export const mark = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 32,
  height: 32,
  borderRadius: 9,
  background: vars.color.accent,
  color: vars.color.surface,
});

globalStyle('.' + header + ' nav', {
  display: 'flex',
  alignItems: 'center',
  gap: 32,
  fontSize: vars.fontSize.small,
});

globalStyle('.' + header + ' nav a', {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  textDecoration: 'none',
});

/** 체험과 소개가 같은 데스크톱 읽기 폭을 사용하게 한다. */
export const main = style({
  maxWidth: 1440,
  margin: '0 auto',
  padding: '0 70px 64px',
});

/** 하단 브랜드와 학습 진입을 낮은 시각적 위계로 정리한다. */
export const footer = style({
  maxWidth: 1248,
  margin: '0 auto',
  padding: '28px 0',
  borderTop: '1px solid ' + vars.color.line,
  display: 'flex',
  alignItems: 'center',
  gap: 24,
  fontSize: vars.fontSize.caption,
  color: vars.color.muted,
});

globalStyle('.' + footer + ' a', {
  display: 'inline-flex',
  gap: 6,
  alignItems: 'center',
  marginLeft: 'auto',
  textDecoration: 'none',
});
