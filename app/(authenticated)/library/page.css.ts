import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 성장 현황 열과 학습 본문을 나란히 두고 좁은 화면에서는 본문 아래로 내린다. */
export const root = style({
  display: 'flex',
  flexWrap: 'wrap-reverse',
  // wrap-reverse에서는 flex-start가 아래쪽이 되므로 쓰기 방향 기준 start로 위에 맞춘다.
  alignItems: 'start',
  gap: vars.space.xl,
  fontSize: vars.fontSize.small,
});

/** 성장 카드는 고정 폭 열로 두어 본문 폭 변화에 흔들리지 않게 한다. */
export const aside = style({ flex: '1 1 260px', maxWidth: 320 });

/** 긴 자료 제목이 왼쪽 열을 밀지 않게 본문이 남은 폭을 차지한다. */
export const main = style({ flex: '999 1 560px', minWidth: 0 });

/** 실제 계정 인사와 자료 추가 행동을 한 행에 정렬한다. */
export const intro = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 24,
  marginBottom: 28,
});
