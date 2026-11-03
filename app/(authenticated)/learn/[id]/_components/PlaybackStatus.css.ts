import { globalStyle, keyframes, style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

const pulse = keyframes({
  '0%, 100%': { transform: 'scaleY(0.3)' },
  '50%': { transform: 'scaleY(1)' },
});

/** 영상 영역을 가리지 않고 재생 상태를 별도 행에 표시한다. */
export const container = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  color: vars.color.muted,
  fontSize: '13px',
  fontWeight: '600',
  minHeight: '24px',
  marginBottom: '10px',
});

/** 움직임을 보지 못해도 색과 문구로 재생 상태를 구분하게 한다. */
export const active = style({ color: vars.color.accent });

/** 상태가 바뀌어도 영상 위치가 움직이지 않게 아이콘 크기를 고정한다. */
export const bars = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '3px',
  width: '18px',
  height: '18px',
});

/** 실제 음량 분석 없이 플레이어 재생 상태만 작은 움직임으로 표현한다. */
export const bar = style({
  width: '3px',
  height: '16px',
  borderRadius: '2px',
  background: 'currentColor',
  transform: 'scaleY(0.3)',
  animation: `${pulse} 900ms ease-in-out infinite`,
  animationPlayState: 'paused',
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      animation: 'none',
      transform: 'scaleY(0.6)',
    },
  },
});

globalStyle(`.${active} .${bar}`, { animationPlayState: 'running' });
globalStyle(`.${bar}:nth-child(2)`, { animationDelay: '-300ms' });
globalStyle(`.${bar}:nth-child(3)`, { animationDelay: '-600ms' });
