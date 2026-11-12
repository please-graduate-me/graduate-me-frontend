import { keyframes, style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

const appear = keyframes({
  from: { opacity: 0, transform: 'translateY(16px)' },
  to: { opacity: 1, transform: 'translateY(0)' },
});

/** 보상은 문서를 가리지 않는 모서리에 두고 작은 화면에도 맞춘다. */
export const toast = style({
  position: 'fixed',
  bottom: 24,
  right: 24,
  zIndex: 1000,
  width: 'min(380px, calc(100vw - 32px))',
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.md,
  padding: vars.space.comfortable,
  borderRadius: vars.radius.panel,
  border: '1px solid ' + vars.color.line,
  background: vars.color.surface,
  color: vars.color.ink,
  boxShadow: vars.shadow.popover,
  animation: `${appear} 220ms ease-out both`,
  '@media': {
    '(prefers-reduced-motion: reduce)': { animation: 'none' },
    '(max-width: 600px)': { bottom: 16, right: 16 },
  },
});

/** 지급량을 축하 문구보다 빠르게 알아볼 수 있게 강조한다. */
export const xp = style({
  color: vars.color.accent,
  fontWeight: 700,
  fontSize: vars.fontSize.heading2,
  margin: '6px 0',
});

/** 키보드로도 자동 종료 전에 알림을 닫을 수 있게 한다. */
export const close = style({
  alignSelf: 'start',
  border: 0,
  background: 'transparent',
  color: vars.color.muted,
  fontSize: 24,
  cursor: 'pointer',
  minWidth: 36,
  minHeight: 36,
});
