import { keyframes, style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

const spin = keyframes({ to: { transform: 'rotate(360deg)' } });

const rise = keyframes({
  from: { opacity: 0, transform: 'translateY(6px)' },
  to: { opacity: 1, transform: 'none' },
});

const reducedMotion = '(prefers-reduced-motion: reduce)';

/** 영상 확인 뒤의 주 행동을 데스크톱에서는 오른쪽에 둔다. */
export const entry = style({
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: vars.space.sm,
  textAlign: 'right',
  '@media': {
    '(max-width: 800px)': { alignItems: 'stretch', textAlign: 'left' },
  },
});

/** 모바일에서는 학습 진입 버튼을 전체 너비로 제공한다. */
export const start = style({
  gap: vars.space.sm,
  '@media': { '(max-width: 800px)': { width: '100%', whiteSpace: 'normal' } },
});

/** 학습 준비 중임을 버튼 글자 앞의 회전 고리로 알린다. */
export const spinner = style({
  width: 16,
  height: 16,
  flex: 'none',
  borderRadius: '50%',
  border: '2.5px solid rgba(255, 255, 255, 0.35)',
  borderTopColor: vars.color.onAccent,
  animation: `${spin} 900ms linear infinite`,
  '@media': { [reducedMotion]: { animation: 'none' } },
});

/** 구절 이동과 기존 답안 보존을 시작 버튼 가까이에서 알린다. */
export const note = style({
  fontSize: vars.fontSize.label,
  lineHeight: 1.7,
  color: vars.color.muted,
  margin: 0,
});

/** 시작 실패 시 재시도할 수 있도록 오류를 행동 아래에 떠올린다. */
export const error = style({
  maxWidth: 460,
  textAlign: 'left',
  animation: `${rise} 300ms ${vars.motion.easeOut}`,
  '@media': { [reducedMotion]: { animation: 'none' } },
});
