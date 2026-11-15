import { keyframes, style } from '@vanilla-extract/css';
import { layered } from './layers.css';
import { vars } from './theme.css';

const reducedMotion = '(prefers-reduced-motion: reduce)';

/** 작게 시작해 살짝 넘쳤다가 제자리로 오는 탄성 확대 움직임이다. */
export const popFrames = keyframes({
  '0%': { transform: 'scale(0.6)', opacity: 0 },
  '60%': { transform: 'scale(1.12)', opacity: 1 },
  '100%': { transform: 'scale(1)' },
});

/** 좌우로 짧게 흔드는 오답 움직임이다. */
export const shakeFrames = keyframes({
  '0%, 100%': { transform: 'translateX(0)' },
  '25%': { transform: 'translateX(-6px)' },
  '75%': { transform: 'translateX(6px)' },
});

const floatFrames = keyframes({
  '0%, 100%': { transform: 'translateY(0)' },
  '50%': { transform: 'translateY(-6px)' },
});

const bobFrames = keyframes({
  '0%, 100%': { transform: 'translateY(0)' },
  '50%': { transform: 'translateY(-5px)' },
});

const stackInFrames = keyframes({
  from: { opacity: 0, transform: 'translateY(16px)' },
  to: { opacity: 1, transform: 'none' },
});

const riseFrames = keyframes({
  from: { opacity: 0, transform: 'translateY(6px)' },
  to: { opacity: 1, transform: 'none' },
});

const slideInFrames = keyframes({
  from: { opacity: 0, transform: 'translateX(12px)' },
  to: { opacity: 1, transform: 'none' },
});

const glowFrames = keyframes({
  '0%, 100%': { boxShadow: '0 0 0 0 rgba(18, 164, 127, 0.5)' },
  '50%': { boxShadow: '0 0 0 5px rgba(18, 164, 127, 0)' },
});

/** 모든 공용 움직임을 모션 축소 설정에서 멈추도록 한 규칙으로 감싼다. */
function motion(animation: string) {
  return style(
    layered({
      animation,
      '@media': { [reducedMotion]: { animation: 'none' } },
    })
  );
}

/** XP 획득처럼 보상이 탄성 있게 커지며 나타난다. */
export const pop = motion(`${popFrames} 500ms cubic-bezier(0.3, 1.6, 0.5, 1)`);

/** 오답을 좌우로 짧게 흔든다. */
export const shake = motion(`${shakeFrames} 350ms ease`);

/** 장식 그림이 4초 주기로 위아래로 떠다닌다. */
export const float = motion(`${floatFrames} 4s ease-in-out infinite`);

/** 리그 방패처럼 현재 상태 표지가 천천히 들썩인다. */
export const bob = motion(`${bobFrames} 3.2s ease-in-out infinite`);

/** 겹친 카드 묶음이 아래에서 올라오며 나타난다. */
export const stackIn = motion(
  `${stackInFrames} 500ms ${vars.motion.easeOut} both`
);

/** 새로 생긴 안내나 버튼이 살짝 떠오르며 나타난다. */
export const rise = motion(`${riseFrames} 300ms ${vars.motion.easeOut}`);

/** 탭을 바꾼 패널이 오른쪽 12px에서 미끄러져 들어온다. */
export const slideIn = motion(`${slideInFrames} 280ms ${vars.motion.easeOut}`);

/** 공유 구간처럼 눈길을 끌어야 하는 표시를 청록 빛으로 맥동시킨다. */
export const glow = motion(`${glowFrames} 2.4s ease-in-out infinite`);
