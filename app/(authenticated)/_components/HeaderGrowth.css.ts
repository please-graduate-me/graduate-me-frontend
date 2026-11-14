import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 두 수치를 하나의 랭킹 링크로 묶어 탭 이동을 한 번으로 줄인다. */
export const root = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space.xs,
  minHeight: 44,
  color: vars.color.ink,
  textDecoration: 'none',
  '@media': { '(max-width: 640px)': { display: 'none' } },
});

/** 시안의 알약 모양 수치 표시를 유지한다. */
export const pill = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: vars.space.xs,
  height: 36,
  paddingInline: vars.space.compact,
  border: `1px solid ${vars.color.line}`,
  borderRadius: 999,
  fontSize: vars.fontSize.small,
  fontWeight: 700,
  fontVariantNumeric: 'tabular-nums',
  selectors: { [`${root}:hover &`]: { borderColor: vars.color.inputBorder } },
});

/** 연속 학습은 주황, XP는 브랜드 청록으로 구분한다. */
export const streakIcon = style({
  display: 'inline-flex',
  color: vars.color.streak,
});

/** XP 아이콘은 강조색을 따라 테마 변경에 함께 맞춰진다. */
export const xpIcon = style({
  display: 'inline-flex',
  color: vars.color.accent,
});
