import { style, globalStyle } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 전체 집계와 개별 링크 목록을 구분한다. */
export const summary = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '24px',
});

/** 검색과 페이지 이동을 좁은 화면에서 줄바꿈한다. */
export const controls = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '12px',
  margin: '16px 0',
});

/** 모바일에서도 운영 표의 열 내용을 잘리지 않게 한다. */
export const tableWrapper = style({ overflowX: 'auto' });

/** 공유 지표의 열 정렬을 유지한다. */
export const table = style({
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: '14px',
});

globalStyle(`.${table} th, .${table} td`, {
  textAlign: 'left',
  padding: '12px',
  borderBottom: `1px solid ${vars.color.line}`,
  verticalAlign: 'top',
});
