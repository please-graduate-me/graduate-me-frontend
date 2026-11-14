import {
  createVar,
  fallbackVar,
  keyframes,
  style,
  styleVariants,
} from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

const tilt = createVar();
const angle = fallbackVar(tilt, '0deg');

const float = keyframes({
  '0%, 100%': { transform: `translateY(0) rotate(${angle})` },
  '50%': { transform: `translateY(-10px) rotate(${angle})` },
});

/** 장식 요소를 소개 문구 뒤에 깔고 문구와 겹칠 수 있는 좁은 화면에서는 숨긴다. */
export const root = style({
  position: 'absolute',
  inset: 0,
  display: 'none',
  pointerEvents: 'none',
  '@media': { '(min-width: 1180px)': { display: 'block' } },
});

const floating = style({
  position: 'absolute',
  transform: `rotate(${angle})`,
  animation: `${float} 5s ease-in-out infinite`,
  '@media': { '(prefers-reduced-motion: reduce)': { animation: 'none' } },
});

const chip = style([
  floating,
  {
    padding: '10px 16px',
    borderRadius: 14,
    border: '1.5px solid #DADCE1',
    borderBottomWidth: 4,
    background: '#FFFFFF',
    color: vars.color.ink,
    fontSize: 17,
    fontWeight: 700,
    lineHeight: 1.3,
  },
]);

/** 떠 있는 요소마다 위치, 기울기, 박자를 달리해 함께 움직이지 않게 한다. */
export const item = styleVariants({
  wordLeft: [chip, { left: '7%', top: 92, vars: { [tilt]: '-6deg' } }],
  wordRight: [
    chip,
    {
      right: '8%',
      top: 120,
      borderColor: '#12A47F',
      background: '#E3F4EE',
      color: '#0B7A62',
      animationDuration: '6s',
      animationDelay: '-2s',
      vars: { [tilt]: '5deg' },
    },
  ],
  wave: [
    floating,
    {
      left: '12%',
      bottom: 120,
      display: 'flex',
      alignItems: 'flex-end',
      gap: 5,
      padding: '12px 14px',
      borderRadius: 14,
      background: '#FFF1E6',
      animationDuration: '5.5s',
      animationDelay: '-1s',
    },
  ],
  stamp: [
    floating,
    {
      right: '9%',
      bottom: 96,
      lineHeight: 0,
      animationDuration: '6.5s',
      animationDelay: '-3s',
    },
  ],
});

const bar = style({ width: 6, borderRadius: 3, background: '#F97316' });

/** 음성 파형 막대의 높이를 들쭉날쭉하게 나눈다. */
export const bars = styleVariants({
  first: [bar, { height: 14 }],
  second: [bar, { height: 28 }],
  third: [bar, { height: 20 }],
  fourth: [bar, { height: 34 }],
  fifth: [bar, { height: 16 }],
});
