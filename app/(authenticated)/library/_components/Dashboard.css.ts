import { style, globalStyle } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 이어 학습과 자료를 주 영역에, 복습과 질문을 보조 영역에 배치한다. */
export const workspace = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) 332px',
  gap: 28,
  alignItems: 'start',
});

/** 긴 자료 제목이 고정된 보조 영역을 밀지 않게 한다. */
export const library = style({ minWidth: 0 });

/** 보조 활동은 세로 흐름으로 조용히 구분한다. */
export const sidebar = style({ display: 'grid', gap: 26 });

/** 복습의 주 행동을 연한 브랜드 바탕에 묶는다. */
export const review = style({
  background: vars.color.selected,
  padding: 24,
  margin: 0,
});

globalStyle('.' + review + ' h2', {
  margin: '16px 0',
  fontSize: 18,
  lineHeight: '28px',
});

globalStyle('.' + review + ' p', {
  color: vars.color.muted,
  fontSize: vars.fontSize.caption,
  marginBottom: 18,
});

/** 복습 영역의 작은 표식을 제목보다 낮은 위계로 둔다. */
export const eyebrow = style({
  display: 'inline-flex',
  gap: 8,
  alignItems: 'center',
  color: vars.color.accent,
  fontSize: vars.fontSize.caption,
});

/** 학습 화면 이동에도 버튼과 같은 높이와 상태를 적용한다. */
export const primaryLink = style({
  display: 'inline-flex',
  gap: 8,
  alignItems: 'center',
  minHeight: 44,
  padding: '10px 16px',
  borderRadius: vars.radius.control,
  color: vars.color.surface,
  background: vars.color.accent,
  textDecoration: 'none',
  fontSize: vars.fontSize.small,
  fontWeight: 500,
  selectors: { '&:hover': { background: vars.color.accentHover } },
});

/** 새 답변과 최근 표현을 선과 여백으로 나눈다. */
export const sideSection = style({
  margin: 0,
  paddingBottom: 24,
  borderBottom: '1px solid ' + vars.color.line,
});

globalStyle('.' + sideSection + ' h2', {
  margin: '0 0 18px',
  fontSize: vars.fontSize.body,
  lineHeight: vars.lineHeight.body,
  fontWeight: 500,
});

/** 영역 제목과 전체 목록 이동을 같은 줄에 둔다. */
export const sectionHeading = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'baseline',
  gap: 12,
});

globalStyle('.' + sectionHeading + ' a', {
  color: vars.color.muted,
  fontSize: vars.fontSize.caption,
  textDecoration: 'none',
});

/** 실제 답변이 도착한 질문을 원문 이동과 함께 표시한다. */
export const answer = style({
  display: 'grid',
  justifyItems: 'start',
  gap: 12,
});

globalStyle('.' + answer + ' h3', {
  fontSize: vars.fontSize.small,
  lineHeight: vars.lineHeight.small,
  margin: 0,
});

globalStyle('.' + answer + ' h3 a', {
  color: vars.color.ink,
  textDecoration: 'none',
});

globalStyle('.' + answer + ' p', {
  fontSize: vars.fontSize.caption,
  color: vars.color.muted,
  margin: 0,
});

/** 표현 자체와 뜻을 다른 서체 크기로 보여 준다. */
export const savedExpression = style({
  display: 'grid',
  justifyItems: 'start',
  gap: 12,
});

globalStyle('.' + savedExpression + ' h3', {
  fontSize: vars.fontSize.body,
  fontWeight: 500,
  margin: 0,
  overflowWrap: 'anywhere',
});

globalStyle('.' + savedExpression + ' p', {
  fontSize: vars.fontSize.caption,
  color: vars.color.muted,
  margin: 0,
  overflowWrap: 'anywhere',
});

/** 비어 있는 보조 영역은 다음 행동을 간단히 안내한다. */
export const sideEmpty = style({
  color: vars.color.muted,
  fontSize: vars.fontSize.caption,
});

globalStyle('.' + sideEmpty + ' p', { margin: '12px 0' });

/** 출처는 자료 종류와 페이지 또는 재생 시각을 함께 표시한다. */
export const source = style({
  display: 'inline-flex',
  gap: 6,
  alignItems: 'center',
  color: vars.color.muted,
  fontSize: vars.fontSize.caption,
  textDecoration: 'none',
});

/** 질문과 표현의 상세 이동은 작은 글자 링크로 제공한다. */
export const textLink = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  fontSize: vars.fontSize.caption,
  textDecoration: 'none',
});

/** 요약 실패가 기존 영상 목록을 가리지 않게 한다. */
export const error = style({
  padding: 16,
  background: vars.color.errorBackground,
  color: vars.color.error,
  borderRadius: vars.radius.control,
  marginBottom: 24,
  fontSize: vars.fontSize.small,
});

globalStyle('.' + error + ' p', { margin: '0 0 12px' });
