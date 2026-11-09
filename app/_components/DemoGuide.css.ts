import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 데모 안내는 실제 학습 공간 앞에서 짧은 가로 패널로 표시한다. */
export const guide = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.lg,
  padding: vars.space.lg,
  marginBottom: vars.space.lg,
  border: `1px solid ${vars.color.line}`,
  borderRadius: vars.radius.panel,
  background: vars.color.surface,
});

/** 현재 안내의 조작을 식별하는 아이콘을 표시한다. */
export const icon = style({
  display: 'grid',
  placeItems: 'center',
  width: 56,
  height: 56,
  flexShrink: 0,
  color: vars.color.accent,
  background: vars.color.selected,
  borderRadius: vars.radius.panel,
});

/** 안내 본문은 남는 폭을 사용한다. */
export const content = style({ flex: 1, display: 'grid', gap: vars.space.sm });

/** 이전과 다음 조작을 같은 위치에 유지한다. */
export const actions = style({
  display: 'flex',
  gap: vars.space.sm,
  flexShrink: 0,
});
