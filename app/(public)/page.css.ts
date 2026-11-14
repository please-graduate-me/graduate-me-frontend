import { keyframes, style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

const rise = keyframes({
  from: { opacity: 0, transform: 'translateY(20px)' },
  to: { opacity: 1, transform: 'none' },
});

const riseIn = style({
  animation: `${rise} 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) both`,
  '@media': { '(prefers-reduced-motion: reduce)': { animation: 'none' } },
});

/** 소개 문구를 가운데에 두고 떠 있는 장식의 기준 상자가 된다. */
export const hero = style({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  margin: 0,
  padding: '96px 24px 72px',
  '@media': { '(max-width: 800px)': { padding: '40px 0 48px' } },
});

/** 소개 문구가 장식 위에 오도록 쌓임 순서를 올린다. */
export const intro = style({
  position: 'relative',
  zIndex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
});

/** 작은 머리표를 가장 먼저 떠오르게 한다. */
export const riseFirst = riseIn;

/** 제목을 머리표 바로 뒤에 떠오르게 한다. */
export const riseSecond = style([riseIn, { animationDelay: '0.12s' }]);

/** 설명과 시작 동작을 마지막에 떠오르게 한다. */
export const riseThird = style([riseIn, { animationDelay: '0.24s' }]);

/** 소개 제목을 화면 폭에 맞춰 크고 굵게 키운다. */
export const title = style([
  riseSecond,
  {
    marginTop: 24,
    fontSize: 'clamp(34px, 6.4vw, 64px)',
    fontWeight: 900,
    lineHeight: 1.15,
    letterSpacing: '-0.04em',
    // 한국어 어절 중간에서 줄이 끊기지 않게 한다.
    wordBreak: 'keep-all',
  },
]);

/** 제목 둘째 줄을 브랜드 청록으로 강조한다. */
export const titleAccent = style({ color: vars.color.accent });

/** 설명 문단을 읽기 좋은 폭으로 제한한다. */
export const subtitle = style([
  riseThird,
  { maxWidth: 520, marginTop: 24, lineHeight: 1.7, wordBreak: 'keep-all' },
]);

/** 시작과 체험 동작을 가운데에서 나란히 비교하게 한다. */
export const accountActions = style([
  riseThird,
  {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginTop: 36,
  },
]);

/** 지원 자료 범위를 시작 동작 아래 보조 문구로 둔다. */
export const supportNote = style([
  riseThird,
  {
    marginTop: 16,
    color: vars.color.muted,
    fontSize: vars.fontSize.caption,
  },
]);

/** 로그인 안내를 가운데 영역 폭 안에 두되 본문은 왼쪽 정렬한다. */
export const notices = style({
  display: 'grid',
  gap: 12,
  width: '100%',
  maxWidth: 560,
  marginTop: 24,
  textAlign: 'start',
});

/** 학습 순서를 가운데 제목 아래 엇갈린 행으로 나열한다. */
export const steps = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 72,
  maxWidth: 1080,
  marginInline: 'auto',
  marginBlock: 0,
  padding: '96px 0',
  scrollMarginTop: 32,
  '@media': { '(max-width: 800px)': { gap: 48, padding: '56px 0' } },
});

/** 기존의 실제 영상 체험을 둥근 테두리 판 안에 묶는다. */
export const demo = style({
  scrollMarginTop: 32,
  margin: '0 0 64px',
  padding: 32,
  border: '1px solid ' + vars.color.line,
  borderRadius: 28,
  background: vars.color.surface,
  '@media': { '(max-width: 800px)': { padding: 16, borderRadius: 20 } },
});

/** 체험 목적과 체험 모드를 본문 위에서 정리한다. */
export const demoHeading = style({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  alignItems: 'flex-end',
  gap: 16,
});

/** 체험 머리표, 제목, 설명을 세로로 쌓는다. */
export const demoIntro = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: 10,
});

/** 공개 체험의 범위를 보조 문구로 표시한다. */
export const demoNote = style({
  color: vars.color.muted,
  fontSize: vars.fontSize.caption,
});

/** 체험 이후의 로그인 진입을 어두운 띠 하나에 모은다. */
export const account = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 20,
  margin: 0,
  padding: '72px 24px',
  borderRadius: 28,
  background: '#16181D',
  color: '#FFFFFF',
  textAlign: 'center',
  '@media': {
    '(max-width: 800px)': { padding: '48px 20px', borderRadius: 20 },
  },
});

/** 어두운 띠의 설명을 제목보다 한 단계 옅게 둔다. */
export const accountText = style({
  maxWidth: 520,
  color: 'rgba(255, 255, 255, 0.72)',
  wordBreak: 'keep-all',
});
