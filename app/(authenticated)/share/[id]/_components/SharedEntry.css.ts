import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 영상 확인 뒤의 주 행동을 데스크톱에서는 오른쪽에 둔다. */
export const entry = style({
  minWidth: 0,
  textAlign: 'right',
  '@media': { '(max-width: 800px)': { textAlign: 'left' } },
});

/** 모바일에서는 학습 진입 버튼을 전체 너비로 제공한다. */
export const start = style({
  minHeight: 48,
  padding: '12px 20px',
  '@media': { '(max-width: 800px)': { width: '100%', whiteSpace: 'normal' } },
});

/** 구절 이동과 기존 답안 보존을 시작 버튼 가까이에서 알린다. */
export const note = style({
  fontSize: 13,
  color: vars.color.muted,
  margin: '10px 0 0',
  '@media': { '(max-width: 800px)': { lineHeight: 1.7 } },
});

/** 시작 실패 시 재시도할 수 있도록 오류를 행동 아래에 표시한다. */
export const error = style({
  color: vars.color.error,
  fontSize: 13,
  margin: '12px 0 0',
  overflowWrap: 'anywhere',
});
