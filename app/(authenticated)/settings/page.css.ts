import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 계정과 학습 설정을 여유 있는 데스크톱 읽기 폭에 배치한다. */
export const page = style({ maxWidth: 920 });

/** 설정 목적을 제목 가까이에 표시한다. */
export const intro = style({ marginBottom: 32 });

globalStyle('.' + intro + ' h1', { margin: '0 0 8px' });

globalStyle('.' + intro + ' p', {
  margin: 0,
  fontSize: vars.fontSize.small,
  color: vars.color.muted,
});

/** 실제 계정 정보와 로그아웃을 한 영역에서 확인하게 한다. */
export const account = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 24,
  padding: 24,
  border: '1px solid ' + vars.color.line,
  borderRadius: vars.radius.panel,
  margin: '0 0 32px',
});

globalStyle('.' + account + ' h2', {
  margin: '0 0 16px',
  fontSize: vars.fontSize.body,
});

globalStyle('.' + account + ' strong', { fontSize: vars.fontSize.small });

globalStyle('.' + account + ' p', {
  fontSize: vars.fontSize.caption,
  color: vars.color.muted,
  margin: '4px 0 0',
});

/** 계정 상태와 종료 행동의 간격을 일정하게 유지한다. */
export const accountActions = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: 16,
});

/** 학습 옵션의 전체 범위를 하나의 설정 영역으로 묶는다. */
export const learning = style({
  padding: 24,
  border: '1px solid ' + vars.color.line,
  borderRadius: vars.radius.panel,
  margin: '0 0 32px',
});

globalStyle('.' + learning + ' h2', {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  fontSize: vars.fontSize.body,
  margin: '0 0 8px',
});

globalStyle('.' + learning + ' > p', {
  color: vars.color.muted,
  fontSize: vars.fontSize.small,
  margin: 0,
});

/** 도우미와 운영자의 작업이 학생 학습 설정과 다름을 안내한다. */
export const workplace = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 24,
  padding: 24,
  background: vars.color.canvas,
  borderRadius: vars.radius.panel,
});

globalStyle('.' + workplace + ' h2', {
  fontSize: vars.fontSize.body,
  margin: '0 0 8px',
});

globalStyle('.' + workplace + ' p', {
  color: vars.color.muted,
  fontSize: vars.fontSize.caption,
  margin: 0,
});

globalStyle('.' + workplace + ' a', {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  whiteSpace: 'nowrap',
  fontSize: vars.fontSize.small,
  textDecoration: 'none',
});
