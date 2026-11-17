import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 인증 입력과 오류 안내를 하나의 읽기 순서로 배치한다. */
export const form = style({
  display: 'grid',
  gap: vars.space.md,
  maxWidth: '28rem',
  width: '100%',
});

/** 코드 재발송과 이메일 변경 동작을 구분해 배치한다. */
export const actions = style({
  display: 'flex',
  gap: vars.space.sm,
  flexWrap: 'wrap',
});
