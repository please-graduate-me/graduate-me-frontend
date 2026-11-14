import { keyframes, style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

const rise = keyframes({
  from: { opacity: 0, transform: 'translateY(16px)' },
  to: { opacity: 1, transform: 'none' },
});

/** 채점 결과는 답안 아래에서 시트처럼 올라오고 모션 축소 설정에서는 바로 나타난다. */
export const sheet = style({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: vars.space.md,
  padding: `18px ${vars.space.comfortable}`,
  borderRadius: vars.radius.panel,
  animation: `${rise} 320ms cubic-bezier(0.2, 0.8, 0.2, 1)`,
  '@media': {
    '(prefers-reduced-motion: reduce)': { animation: 'none' },
  },
});

/** 정답은 브랜드 청록의 옅은 바탕으로 보여 준다. */
export const correct = style({
  background: vars.color.selected,
  color: vars.color.ink,
});

/** 오답은 다크 모드에서도 대비가 유지되도록 고정된 옅은 주황 바탕과 짙은 글자를 함께 쓴다. */
export const wrong = style({ background: '#FFF1E6', color: '#7C3205' });

/** 메시지는 남는 폭을 차지하고 좁은 화면에서 표시 아래로 줄바꿈한다. */
export const body = style({
  display: 'grid',
  gap: vars.space.sm,
  flex: '1 1 200px',
  minWidth: 0,
});

/** 정답 안내 문장은 한 단락으로 읽힌다. */
export const message = style({ margin: 0, fontSize: vars.fontSize.body });

/** 결과를 알리는 첫 문장을 시트에서 가장 강하게 보여 준다. */
export const title = style({
  margin: 0,
  fontSize: vars.fontSize.heading3,
  fontWeight: 800,
});

/** 정답 제목은 테마 강조색을 따른다. */
export const correctTitle = style({ color: vars.color.accent });

/** 오답 표시는 주황 원 안의 느낌표로 주의를 끈다. */
export const alertMark = style({
  display: 'grid',
  placeItems: 'center',
  flex: 'none',
  width: 48,
  height: 48,
  borderRadius: '50%',
  background: '#F97316',
  color: '#FFFFFF',
  fontSize: 24,
  fontWeight: 800,
  lineHeight: 1,
});

/** 차이 토큰이 긴 문장에서도 줄바꿈한다. */
export const differences = style({
  display: 'flex',
  gap: vars.space.xs,
  flexWrap: 'wrap',
});

/** 채점 비교 토큰은 주황 시트 위에서 칩처럼 떠 보이게 한다. */
export const diff = style({
  padding: '3px 8px',
  borderRadius: vars.radius.control,
  fontWeight: 600,
});

/** 일치한 단어를 수정 대상과 구분한다. */
export const match = style({ color: '#0B5C4A', background: '#FFFFFF' });

/** 빠뜨린 단어는 정답과 함께 구분한다. */
export const missing = style({ color: '#9A3F06', background: '#FFDCC2' });

/** 교체할 단어는 정답과 함께 구분한다. */
export const replace = style({ color: '#9A3F06', background: '#FFDCC2' });

/** 추가한 단어를 누락된 단어와 구분한다. */
export const extra = style({ color: '#4C3BB0', background: '#EEEAFB' });
