import { keyframes, style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

const wobble = keyframes({
  '0%, 100%': { transform: 'rotate(-8deg)' },
  '50%': { transform: 'rotate(-14deg)' },
});

const dripping = keyframes({
  '0%': { opacity: 0, transform: 'translateY(-6px)' },
  '30%': { opacity: 1 },
  '100%': { opacity: 0, transform: 'translateY(18px)' },
});

const turn = keyframes({ to: { transform: 'rotate(360deg)' } });

const rising = keyframes({
  from: { opacity: 0, transform: 'translateY(20px)' },
  to: { opacity: 1, transform: 'none' },
});

const reducedMotion = '(prefers-reduced-motion: reduce)';

/** 번진 도장 그림과 재시도 안내를 가운데에 쌓는다. */
export const root = style({
  maxWidth: 1120,
  margin: '0 auto',
  padding: '72px 24px 96px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  '@media': { '(max-width: 760px)': { padding: '48px 16px 72px' } },
});

/** 잉크가 마른 도장과 스탬프 패드가 놓인 그림 영역이다. */
export const art = style({ position: 'relative', width: 280, height: 240 });

/** 번진 도장이 아래를 축으로 천천히 흔들린다. */
export const stamp = style({
  position: 'absolute',
  left: 66,
  top: 0,
  display: 'flex',
  transformOrigin: '50% 100%',
  transform: 'rotate(-8deg)',
  animation: `${wobble} 3.6s ease-in-out infinite`,
  '@media': { [reducedMotion]: { animation: 'none' } },
});

/** 도장에서 떨어지는 마지막 잉크 방울이다. */
export const drip = style({
  position: 'absolute',
  left: 136,
  top: 156,
  width: 8,
  height: 12,
  borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
  background: vars.color.inputBorder,
  animation: `${dripping} 2.4s ease-in infinite`,
  '@media': { [reducedMotion]: { animation: 'none' } },
});

/** 잉크가 거의 남지 않은 먹색 스탬프 패드다. */
export const pad = style({
  position: 'absolute',
  left: 40,
  bottom: 0,
  width: 200,
  height: 52,
  borderRadius: 14,
  background: vars.color.ink,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

/** 패드 안의 잉크 면이다. */
export const track = style({
  width: 168,
  height: 22,
  paddingLeft: 10,
  borderRadius: vars.radius.small,
  background: '#2B2F38',
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.xs,
});

/** 패드에 조금 남은 청록 잉크 자국이다. */
export const trail = style({
  width: 28,
  height: 6,
  borderRadius: 3,
  background: vars.color.accent,
  opacity: 0.5,
});

/** 더 옅게 남은 짧은 잉크 자국이다. */
export const trailShort = style({ width: 10, opacity: 0.3 });

/** 제목 위 여백이다. */
export const title = style({ marginTop: 36 });

/** 설명이 너무 길게 퍼지지 않게 폭을 제한한다. */
export const description = style({
  maxWidth: 560,
  marginTop: vars.space.md,
  lineHeight: 1.7,
});

/** 재시도 버튼 묶음을 안내 아래에 둔다. */
export const actions = style({ marginTop: vars.space.xl });

/** 재시도 버튼을 넉넉한 폭으로 둔다. */
export const action = style({ minWidth: 220 });

/** 재시도를 누르면 아이콘이 시계 방향으로 한 바퀴 돈다. */
export const spin = style({
  display: 'inline-flex',
  animation: `${turn} 600ms ${vars.motion.spring}`,
  '@media': { [reducedMotion]: { animation: 'none' } },
});

/** 제목이 아래에서 떠오르며 나타난다. */
export const rise = style({
  animation: `${rising} 700ms ${vars.motion.easeOut} both`,
  '@media': { [reducedMotion]: { animation: 'none' } },
});

/** 설명과 행동은 제목보다 한 박자 늦게 떠오른다. */
export const riseLate = style({
  animation: `${rising} 700ms ${vars.motion.easeOut} 120ms both`,
  '@media': { [reducedMotion]: { animation: 'none' } },
});
