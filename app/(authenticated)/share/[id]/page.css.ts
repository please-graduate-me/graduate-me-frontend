import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 공유를 확인한 뒤 서비스 홈으로 돌아갈 수 있게 한다. */
export const back = style({ fontSize: 14 });

/** 제목과 영상 확인 후 학습으로 이어지는 순서를 유지한다. */
export const page = style({
  maxWidth: 960,
  margin: '28px auto 0',
  display: 'grid',
  gap: 24,
  '@media': { '(max-width: 800px)': { marginTop: 24, gap: 20 } },
});

/** 긴 영상 제목이 공유 미리보기의 폭을 늘리지 않게 한다. */
export const info = style({ minWidth: 0 });

globalStyle(`.${info} h1`, {
  fontSize: 28,
  lineHeight: 1.35,
  letterSpacing: '-0.7px',
  margin: 0,
  textWrap: 'balance',
  overflowWrap: 'anywhere',
  '@media': { '(max-width: 800px)': { fontSize: 23, letterSpacing: '-0.5px' } },
});

/** 공유 범위와 분류를 제목 아래에서 간결하게 표시한다. */
export const meta = style({
  fontSize: 14,
  color: vars.color.muted,
  margin: '12px 0 0',
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px 16px',
  '@media': { '(max-width: 800px)': { gap: '6px 12px' } },
});

/** 실제 영상의 비율을 모든 화면 너비에서 유지한다. */
export const player = style({
  width: '100%',
  aspectRatio: '16 / 9',
  border: 0,
  display: 'block',
  background: vars.color.video,
  borderRadius: vars.radius.panel,
  overflow: 'hidden',
});
