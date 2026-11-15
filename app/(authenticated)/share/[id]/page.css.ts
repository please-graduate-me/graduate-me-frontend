import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 공유를 확인한 뒤 서비스 홈으로 돌아갈 수 있게 한다. */
export const back = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space.xs,
  minHeight: 44,
  color: vars.color.muted,
  fontSize: vars.fontSize.small,
});

/** 제목과 영상 확인 후 학습으로 이어지는 순서를 유지한다. */
export const page = style({
  maxWidth: 960,
  margin: '20px auto 0',
  display: 'grid',
  gap: 24,
  '@media': { '(max-width: 800px)': { marginTop: 16, gap: 20 } },
});

/** 긴 영상 제목이 공유 미리보기의 폭을 늘리지 않게 한다. */
export const info = style({
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.compact,
});

/** 공유 범위와 분류를 제목 아래에서 간결하게 표시한다. */
export const meta = style({
  fontSize: vars.fontSize.small,
  color: vars.color.muted,
  margin: 0,
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '8px 16px',
  '@media': { '(max-width: 800px)': { gap: '6px 12px' } },
});

/** 영상 분류를 공유 표지 옆에서 굵게 읽게 한다. */
export const category = style({ fontWeight: vars.fontWeight.bold });

/** 공유 구간을 숫자 글꼴과 시계 아이콘으로 표시한다. */
export const range = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space.xs,
  fontFamily: vars.font.numeric,
  fontWeight: vars.fontWeight.bold,
  color: vars.color.ink,
});
