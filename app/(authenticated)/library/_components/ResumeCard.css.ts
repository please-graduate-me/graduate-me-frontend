import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 최근 학습은 뒤에 카드가 겹쳐 쌓인 모양으로 이어 할 학습이 더 있음을 보여 준다. */
export const root = style({
  padding: 18,
  marginBottom: 14,
  border: '1px solid ' + vars.color.line,
  borderRadius: vars.radius.panel,
  background: vars.color.surface,
  minWidth: 0,
  // 음수 spread 그림자 두 겹으로 아래쪽에 비치는 뒷장 카드 가장자리를 그린다.
  boxShadow: [
    `0 7px 0 -1px ${vars.color.surface}`,
    `0 7px 0 0 ${vars.color.line}`,
    `0 14px 0 -3px ${vars.color.surface}`,
    `0 14px 0 -2px ${vars.color.line}`,
  ].join(', '),
  transition: 'transform 180ms ease',
  selectors: { '&:hover': { transform: 'translateY(-2px)' } },
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      transition: 'none',
      selectors: { '&:hover': { transform: 'none' } },
    },
  },
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

/** 실제 진행 표시의 외형은 공통 ProgressBar에 맡기고 간격만 유지한다. */
export const progress = style({ marginTop: 18 });

/** 자료에서 확인한 실제 영상 썸네일을 표지 비율 안에 표시한다. */
export const thumbnail = style({
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});
