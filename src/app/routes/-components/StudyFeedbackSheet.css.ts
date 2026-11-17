import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 시트의 주 버튼은 시안처럼 넓은 최소 폭으로 다음 행동을 분명히 한다. */
export const primaryAction = style({
  minWidth: 180,
  '@media': { '(max-width: 600px)': { minWidth: 0, flex: '1 1 auto' } },
});

/** 실제 지급된 XP는 숫자 서체로 탄성 있게 나타난다. */
export const xp = style({
  display: 'inline-block',
  fontFamily: vars.font.numeric,
  fontSize: vars.fontSize.small,
  fontWeight: vars.fontWeight.bold,
  color: vars.color.accent,
});

/** 오답 표시는 주황 원 안의 경고 아이콘으로 주의를 끈다. */
export const alertMark = style({
  display: 'grid',
  placeItems: 'center',
  width: 48,
  height: 48,
  borderRadius: '50%',
  background: vars.color.streakBright,
  color: vars.color.onAccent,
});

/** 차이 토큰이 긴 문장에서도 줄바꿈한다. */
export const differences = style({
  display: 'flex',
  gap: vars.space.xs,
  flexWrap: 'wrap',
  marginTop: vars.space.xs,
});

/** 채점 비교 토큰은 주황 시트 위에서 칩처럼 떠 보이게 한다. */
export const diff = style({
  padding: '3px 8px',
  borderRadius: vars.radius.control,
  fontWeight: vars.fontWeight.bold,
});

/** 일치한 단어를 수정 대상과 구분한다. */
export const match = style({
  color: vars.color.accentPressed,
  background: vars.color.surface,
});

/** 빠뜨린 단어는 정답과 함께 구분한다. */
export const missing = style({
  color: vars.color.warning,
  background: '#FFDCC2',
});

/** 교체할 단어는 정답과 함께 구분한다. */
export const replace = style({
  color: vars.color.warning,
  background: '#FFDCC2',
});

/** 추가한 단어를 누락된 단어와 구분한다. */
export const extra = style({
  color: vars.color.review,
  background: vars.color.reviewBackground,
});
