import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 최근 학습은 얇은 테두리와 실제 진행 위치로 구별한다. */
export const root = style({
  padding: 18,
  border: '1px solid ' + vars.color.line,
  borderRadius: vars.radius.panel,
  background: vars.color.surface,
  minWidth: 0,
});

/** 표지와 제목을 두 열로 배치한다. */
export const row = style({
  display: 'grid',
  gridTemplateColumns: '100px minmax(0, 1fr)',
  gap: 18,
});

/** 사진이 없는 원문도 실제 제목과 페이지를 가진 문서 표지로 표현한다. */
export const cover = style({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  gap: 10,
  width: 100,
  minHeight: 142,
  padding: 14,
  background: vars.color.document,
  color: vars.color.documentInk,
  borderRadius: 7,
  textDecoration: 'none',
  overflow: 'hidden',
  selectors: {
    '&[data-kind="video"]': {
      background: vars.color.reviewBackground,
      color: vars.color.review,
      alignItems: 'center',
      justifyContent: 'center',
    },
  },
});

globalStyle('.' + cover + ' small', { fontSize: 10 });

globalStyle('.' + cover + ' strong', {
  fontSize: 28,
  fontWeight: 500,
  lineHeight: '36px',
});

globalStyle('.' + cover + ' span', {
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 2,
  overflow: 'hidden',
  fontSize: 10,
  lineHeight: '16px',
  overflowWrap: 'anywhere',
});

/** 짧은 제목과 이어 학습 동작이 카드 안에서 같은 위치를 사용하게 한다. */
export const information = style({
  minWidth: 0,
  display: 'flex',
  alignItems: 'flex-start',
  flexDirection: 'column',
  gap: 10,
});

globalStyle('.' + information + ' h3', {
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 2,
  overflow: 'hidden',
  margin: 0,
  minHeight: 44,
  fontSize: vars.fontSize.small,
  lineHeight: vars.lineHeight.small,
  fontWeight: 500,
  overflowWrap: 'anywhere',
});

globalStyle('.' + information + ' h3 a', {
  color: vars.color.ink,
  textDecoration: 'none',
});

globalStyle('.' + information + ' p', {
  color: vars.color.muted,
  fontSize: vars.fontSize.caption,
  margin: 0,
});

/** 진행률은 정확한 수치와 같은 비율로 표시한다. */
export const progress = style({
  height: 4,
  marginTop: 18,
  borderRadius: 4,
  background: vars.color.neutral,
  overflow: 'hidden',
});

globalStyle('.' + progress + ' span', {
  display: 'block',
  height: '100%',
  background: vars.color.accent,
  borderRadius: 4,
});

/** 자료에서 확인한 실제 영상 썸네일을 표지 비율 안에 표시한다. */
export const thumbnail = style({
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});
