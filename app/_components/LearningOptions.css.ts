import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 재생 옵션을 영상 조작과 구분하되 같은 영역에서 찾게 한다. */
export const container = style({
  border: `1px solid ${vars.color.line}`,
  borderRadius: '8px',
  padding: '12px',
  margin: '16px 0',
});

/** 모바일에서도 옵션이 자연스럽게 줄바꿈되게 한다. */
export const controls = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '12px',
  marginTop: '12px',
});

/** 옵션 이름과 입력을 가까이 배치한다. */
export const control = style({
  display: 'flex',
  gap: '8px',
  alignItems: 'center',
});

/** 저장 안내와 동작 설명이 재생 조작을 압도하지 않게 한다. */
export const description = style({
  color: vars.color.muted,
  fontSize: '13px',
  margin: '8px 0 0',
});
