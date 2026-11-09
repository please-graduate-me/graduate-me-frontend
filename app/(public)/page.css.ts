import { style, globalStyle } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 소개와 원문 예시를 Figma의 두 열 구성으로 보여 준다. */
export const hero = style({
  display: 'grid',
  gridTemplateColumns: '530px 550px',
  alignItems: 'center',
  gap: 80,
  padding: '70px 0 100px',
  minHeight: 740,
  margin: 0,
});

/** 소개 문구를 주 행동과 가까운 간격으로 정리한다. */
export const intro = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: 24,
});

globalStyle('.' + intro + ' h1', {
  fontSize: 32,
  lineHeight: '42px',
  margin: 0,
  letterSpacing: '-0.5px',
});

globalStyle('.' + intro + ' p', {
  color: vars.color.muted,
  fontSize: vars.fontSize.body,
  lineHeight: vars.lineHeight.body,
  margin: 0,
});

globalStyle('.' + intro + ' small', {
  color: vars.color.muted,
  fontSize: vars.fontSize.caption,
});

/** 학습 예시의 중립 배경으로 실제 원문 카드와 표현 카드를 묶는다. */
export const preview = style({
  width: 550,
  display: 'grid',
  gap: 24,
  padding: 30,
  borderRadius: 24,
  background: vars.color.neutral,
});

/** 학습용 문서는 제어 영역과 다른 종이 질감의 색을 사용한다. */
export const reading = style({
  padding: 28,
  border: '1px solid ' + vars.color.line,
  borderRadius: vars.radius.panel,
  background: '#fffefb',
});

globalStyle('.' + reading + ' small', {
  color: vars.color.documentInk,
  fontSize: vars.fontSize.caption,
});

/** 예시 원문의 세리프 서체와 넓은 행간을 유지한다. */
export const readingTitle = style({
  margin: '22px 0 18px',
  fontFamily: vars.font.document,
  fontSize: 32,
  lineHeight: 1.55,
  color: vars.color.documentInk,
});

/** 원문의 선택 구절을 배경색으로 구별한다. */
export const highlight = style({
  background: '#fff0b0',
  color: vars.color.documentInk,
  fontFamily: vars.font.document,
  fontSize: 20,
  padding: 8,
  margin: 0,
});

/** 표현 예시는 저장된 개인 데이터와 혼동하지 않도록 소개 안에 한정한다. */
export const expression = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: 12,
  padding: 24,
  border: '1px solid ' + vars.color.line,
  borderRadius: vars.radius.panel,
  background: vars.color.surface,
});

globalStyle('.' + expression + ' p', {
  margin: 0,
  fontSize: vars.fontSize.small,
  color: vars.color.muted,
});

/** 표현의 영문 제목과 저장 아이콘을 한 행에 놓는다. */
export const expressionTitle = style({
  display: 'flex',
  gap: 12,
  alignItems: 'center',
  color: vars.color.muted,
});

globalStyle('.' + expressionTitle + ' h2', {
  margin: 0,
  color: vars.color.ink,
  fontFamily: vars.font.body,
  fontSize: 28,
  lineHeight: '40px',
  fontWeight: 500,
});

/** 원문 출처의 아이콘과 페이지 문구를 작은 크기로 정렬한다. */
export const source = style({
  display: 'inline-flex',
  gap: 6,
  alignItems: 'center',
  fontSize: vars.fontSize.caption,
  color: vars.color.muted,
});

/** 시작과 체험 동작을 같은 행에서 비교하게 한다. */
export const accountActions = style({
  display: 'flex',
  alignItems: 'center',
  gap: 14,
});

/** 이동 행동도 같은 높이의 공통 색상 체계를 적용한다. */
export const primaryLink = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 6,
  background: vars.color.accent,
  color: vars.color.surface,
  border: '1px solid ' + vars.color.accent,
  borderRadius: vars.radius.control,
  padding: '10px 16px',
  textDecoration: 'none',
  fontSize: vars.fontSize.small,
  fontWeight: 500,
  minHeight: 44,
  selectors: { '&:hover': { background: vars.color.accentHover } },
});

/** 체험 진입은 로그인보다 낮은 위계로 표현한다. */
export const secondaryLink = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: vars.color.ink,
  border: '1px solid ' + vars.color.line,
  borderRadius: vars.radius.control,
  padding: '10px 16px',
  textDecoration: 'none',
  fontSize: vars.fontSize.small,
  minHeight: 44,
  selectors: { '&:hover': { background: vars.color.canvas } },
});

/** 예시 다음에 실제 사용 순서를 짧게 안내한다. */
export const steps = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: 48,
  padding: '40px 0',
  borderTop: '1px solid ' + vars.color.line,
  borderBottom: '1px solid ' + vars.color.line,
  marginBottom: 64,
  scrollMarginTop: 32,
});

globalStyle('.' + steps + ' span', {
  color: vars.color.accent,
  fontSize: vars.fontSize.caption,
});

globalStyle('.' + steps + ' h2', {
  margin: '12px 0 8px',
  fontSize: vars.fontSize.heading3,
});

globalStyle('.' + steps + ' p', {
  color: vars.color.muted,
  fontSize: vars.fontSize.small,
  margin: 0,
});

/** 기존의 실제 영상 체험을 소개 아래에 연결한다. */
export const demo = style({ scrollMarginTop: 32, marginBottom: 64 });

/** 체험 목적과 체험 모드를 본문 위에서 정리한다. */
export const demoHeading = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-end',
  marginBottom: 24,
});

globalStyle('.' + demoHeading + ' h2', {
  margin: '16px 0 8px',
  fontSize: vars.fontSize.heading2,
});

globalStyle('.' + demoHeading + ' p', {
  color: vars.color.muted,
  margin: 0,
  fontSize: vars.fontSize.small,
});

/** 공개 체험의 범위를 보조 문구로 표시한다. */
export const demoNote = style({
  color: vars.color.muted,
  fontSize: vars.fontSize.caption,
});

/** 체험 이후의 로그인 진입을 하나의 영역에 모은다. */
export const account = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 24,
  padding: '32px 0',
  borderTop: '1px solid ' + vars.color.line,
  margin: 0,
});

globalStyle('.' + account + ' h2', { margin: '0 0 8px' });

globalStyle('.' + account + ' p', {
  margin: 0,
  color: vars.color.muted,
  fontSize: vars.fontSize.small,
});

/** 로그인 실패를 주변 소개 문구와 분리한다. */
export const error = style({
  padding: '14px 16px',
  borderRadius: vars.radius.control,
  color: vars.color.error,
  background: vars.color.errorBackground,
});

/** 로그인 준비 상태를 실제 응답에 맞춰 안내한다. */
export const notice = style({
  padding: '14px 16px',
  borderRadius: vars.radius.control,
  background: vars.color.notice,
  fontSize: vars.fontSize.small,
});
