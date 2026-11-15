import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

const frameBox = {
  width: '100%',
  aspectRatio: '16 / 9',
  borderRadius: vars.radius.tray,
  overflow: 'hidden',
  background: vars.color.video,
} as const;

/** 재생을 누른 뒤의 실제 영상이며 포스터와 같은 비율과 모서리를 쓴다. */
export const frame = style({ ...frameBox, display: 'block', border: 0 });

/** 재생 전 포스터이며 썸네일이 없어도 어두운 바탕으로 자리를 유지한다. */
export const poster = style({
  ...frameBox,
  position: 'relative',
  backgroundImage: 'linear-gradient(160deg, #2B2F38 0%, #16181D 70%)',
});

/** 썸네일은 컨트롤 글자가 읽히도록 살짝 어둡게 깐다. */
export const image = style({ objectFit: 'cover', opacity: 0.72 });

/** 재생 버튼을 포스터 정가운데에 고정한다. */
export const play = style({
  position: 'absolute',
  left: '50%',
  top: '50%',
  margin: '-42px 0 0 -42px',
});

/** 아래쪽 그라데이션 위에 재생 표시, 진행 막대, 시간을 한 줄로 둔다. */
export const controls = style({
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  gap: 14,
  padding: '18px 22px',
  color: vars.color.onAccent,
  backgroundImage:
    'linear-gradient(0deg, rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0))',
  pointerEvents: 'none',
});

/** 전체 길이를 나타내는 반투명 진행 막대다. */
export const track = style({
  position: 'relative',
  flex: '1 1 auto',
  height: 6,
  borderRadius: 3,
  background: 'rgba(255, 255, 255, 0.25)',
});

/** 공유 구간을 막대보다 조금 두꺼운 청록 띠로 강조한다. */
export const segment = style({
  position: 'absolute',
  top: -2,
  height: 10,
  borderRadius: 4,
  background: vars.color.accentBright,
});

/** 현재 위치와 전체 시간을 숫자 글꼴로 표시한다. */
export const time = style({
  fontFamily: vars.font.numeric,
  fontSize: vars.fontSize.label,
  fontWeight: vars.fontWeight.bold,
  fontVariantNumeric: 'tabular-nums',
});
