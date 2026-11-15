import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 방패, 제목, 규칙 문구를 가운데 모아 화면의 시작점을 만든다. */
export const root = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  gap: vars.space.compact,
  paddingBlock: '8px 4px',
});

/** 세 등급 방패를 아래 끝에 맞춰 나란히 둔다. */
export const shields = style({
  display: 'flex',
  alignItems: 'flex-end',
  gap: 18,
});

/** 남은 기간은 본문색 굵은 글자로 강조한다. */
export const remaining = style({ color: vars.color.ink });
