import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 좁은 화면에서도 필터와 버튼을 줄바꿈해 접근하게 한다. */
export const controls = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '10px',
  margin: '12px 0',
});

/** 영상별 행동을 목록 안에서 묶어 보여 준다. */
export const list = style({ listStyle: 'none', padding: 0 });

/** 인접 영상의 조작을 구분할 여백을 확보한다. */
export const item = style({
  borderBottom: `1px solid ${vars.color.line}`,
  padding: '16px 0',
});

/** 진도와 분류를 제목보다 낮은 위계로 표시한다. */
export const description = style({
  color: vars.color.muted,
  fontSize: '13px',
  marginTop: '8px',
});
