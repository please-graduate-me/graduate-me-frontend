import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 네이티브 모달의 초점 잠금과 배경 비활성화를 유지한다. */
export const root = style({
  width: 600,
  maxWidth: 'calc(100vw - 64px)',
  maxHeight: 'calc(100vh - 80px)',
  padding: 0,
  border: `1px solid ${vars.color.line}`,
  borderRadius: vars.radius.panel,
  background: vars.color.surface,
  color: vars.color.ink,
  boxShadow: vars.shadow.popover,
  selectors: { '&::backdrop': { background: vars.color.overlay } },
});

/** 제목과 닫기 행동의 읽는 순서를 고정한다. */
export const header = style({
  display: 'flex',
  alignItems: 'start',
  justifyContent: 'space-between',
  gap: vars.space.md,
  padding: '24px 24px 0',
});

globalStyle(`.${header} h2`, {
  margin: '2px 0 8px',
  fontSize: vars.fontSize.heading3,
});

globalStyle(`.${header} p`, {
  marginBottom: 0,
  fontSize: vars.fontSize.small,
  color: vars.color.muted,
});

/** 폼 내용은 제목과 분리해 스크롤할 수 있게 한다. */
export const body = style({ padding: vars.space.lg });

/** 주 행동과 취소는 폼 아래에서 같은 순서로 표시한다. */
export const footer = style({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: vars.space.sm,
  padding: '16px 24px',
  borderTop: `1px solid ${vars.color.line}`,
});
