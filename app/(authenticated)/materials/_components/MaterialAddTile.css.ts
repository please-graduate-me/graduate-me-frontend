import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 격자 칸 높이에 맞춰 추가 타일이 늘어나게 한다. */
export const item = style({ display: 'flex', minWidth: 0 });

/** 투명 카드가 격자 칸을 채우게 한다. */
export const tile = style({ flex: 1, minWidth: 0 });

/** 목록 끝의 점선 영역으로 새 자료 등록을 이어서 권한다. */
export const body = style({
  height: '100%',
  minHeight: 190,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: vars.space.sm,
  padding: '22px 12px 16px',
  border: '1.5px dashed #B9BCC5',
  borderRadius: vars.radius.panel,
  color: vars.color.muted,
  fontSize: vars.fontSize.small,
  fontWeight: 800,
  textAlign: 'center',
  transition: 'border-color 180ms ease, color 180ms ease',
  selectors: {
    [`${tile}:hover &`]: {
      borderColor: vars.color.accent,
      color: vars.color.ink,
    },
  },
  '@media': { '(prefers-reduced-motion: reduce)': { transition: 'none' } },
});

/** 더하기 표시를 흰 원 안에 둔다. */
export const plus = style({
  width: 48,
  height: 48,
  display: 'grid',
  placeItems: 'center',
  borderRadius: '50%',
  border: `1px solid ${vars.color.line}`,
  background: vars.color.surface,
});
