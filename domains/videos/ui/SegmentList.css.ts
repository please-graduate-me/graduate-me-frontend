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

/** 현재 구절을 색뿐 아니라 상태 문구로도 구분한다. */
export const item = style({
  display: 'flex',
  width: '100%',
  gap: '14px',
  alignItems: 'center',
  textAlign: 'left',
  border: 0,
  borderBottom: `1px solid ${vars.color.line}`,
  background: 'transparent',
  color: vars.color.ink,
  padding: '14px 12px',
  minHeight: '48px',
  fontSize: '12px',
  cursor: 'pointer',
  selectors: {
    '&[aria-current="step"]': { background: '#e9effe', fontWeight: 700 },
    '&:disabled': { opacity: 0.5, cursor: 'not-allowed' },
  },
});

/** 구절 번호가 바뀌어도 상태 문구의 시작점을 유지한다. */
export const number = style({
  width: '22px',
  flexShrink: 0,
  fontVariantNumeric: 'tabular-nums',
});

/** 시간은 상태와 구별되는 오른쪽 기준선에 정렬한다. */
export const time = style({
  marginLeft: 'auto',
  whiteSpace: 'nowrap',
  color: vars.color.muted,
  fontVariantNumeric: 'tabular-nums',
});
