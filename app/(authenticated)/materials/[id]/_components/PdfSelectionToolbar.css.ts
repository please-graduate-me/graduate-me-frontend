import { keyframes, style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

const popIn = keyframes({
  from: { opacity: 0, transform: 'translateY(6px) scale(0.92)' },
  to: { opacity: 1, transform: 'none' },
});

/** 원문 선택 위치에 짙은 떠 있는 도구 모음을 두고 처음 나타날 때만 튀어 오르게 한다. */
export const root = style({
  position: 'absolute',
  zIndex: 4,
  padding: 6,
  borderRadius: 14,
  background: vars.color.ink,
  // ghost 버튼은 부모 글자색을 따르므로 막대에 흰 글자를 주면 어두운 바탕에서도 읽힌다.
  color: vars.color.onAccent,
  boxShadow: '0 10px 24px rgb(22 24 29 / 24%)',
  transformOrigin: 'center bottom',
  animation: `${popIn} 0.3s cubic-bezier(0.3, 1.5, 0.5, 1)`,
  '@media': {
    '(prefers-reduced-motion: reduce)': { animation: 'none' },
  },
});
