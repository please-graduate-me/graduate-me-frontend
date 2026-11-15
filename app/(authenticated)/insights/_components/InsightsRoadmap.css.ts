import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 로드맵 열이며 좁은 화면에서는 전체 폭을 쓴다. */
export const root = style({
  flex: '1 1 300px',
  maxWidth: 360,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.md,
  padding: 22,
  borderRadius: vars.radius.tray,
  '@media': { '(max-width: 960px)': { maxWidth: 'none' } },
});

/** 로드맵 제목이다. */
export const title = style({ fontSize: 17 });

/** 학년 단계를 세로 선으로 잇는다. */
export const steps = style({
  display: 'flex',
  flexDirection: 'column',
  margin: 0,
  padding: 0,
  listStyle: 'none',
});

/** 단계 번호와 내용을 나란히 둔다. */
export const step = style({ display: 'flex', gap: 14 });

/** 번호 원과 다음 단계로 잇는 선을 세로로 둔다. */
export const rail = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

/** 학년 번호 원이다. */
export const number = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 32,
  height: 32,
  boxSizing: 'border-box',
  border: `2px solid ${vars.color.ink}`,
  borderRadius: '50%',
  fontFamily: vars.font.numeric,
  fontSize: vars.fontSize.small,
  fontWeight: vars.fontWeight.bold,
});

/** 시작 단계 번호는 먹색으로 채워 현재 위치처럼 보이게 한다. */
export const numberCurrent = style({
  background: vars.color.ink,
  color: vars.color.onAccent,
});

/** 다음 단계로 잇는 선이며 마지막 단계에는 그리지 않는다. */
export const line = style({
  flex: '1 1 auto',
  width: 2,
  minHeight: 18,
  background: vars.color.line,
  selectors: { [`${step}:last-child &`]: { display: 'none' } },
});

/** 단계 제목과 목표이며 다음 단계와 간격을 둔다. */
export const body = style({
  paddingBottom: vars.space.md,
  selectors: { [`${step}:last-child &`]: { paddingBottom: 0 } },
});

/** 단계 제목이다. */
export const stepTitle = style({
  display: 'block',
  fontSize: 15,
  fontWeight: vars.fontWeight.heavy,
});

/** 단계 목표다. */
export const goal = style({
  marginTop: vars.space.xxs,
  fontSize: vars.fontSize.label,
  lineHeight: 1.55,
});

/** 설정 이동 링크는 카드 폭을 채운다. */
export const settings = style({ width: '100%' });
