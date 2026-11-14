import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 목록을 영상 제어 다음의 보조 탐색 영역으로 구분한다. */
export const root = style({
  borderTop: `1px solid ${vars.color.line}`,
  marginTop: '26px',
  paddingTop: '18px',
});

/** 전체 개수를 목록 제목과 함께 표시한다. */
export const heading = style({
  display: 'flex',
  justifyContent: 'space-between',
  color: vars.color.muted,
  fontSize: '12px',
  marginBottom: '10px',
});

/** 긴 영상도 목록 높이가 학습 영역을 무한히 늘리지 않게 한다. */
export const list = style({
  position: 'relative',
  listStyle: 'none',
  margin: 0,
  padding: 0,
  maxHeight: '210px',
  overflowY: 'auto',
});
