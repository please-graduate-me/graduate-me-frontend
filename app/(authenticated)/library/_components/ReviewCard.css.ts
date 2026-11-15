import { style, styleVariants } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 세 카드가 같은 높이로 보이도록 내용을 위아래 끝에 붙인다. */
export const root = style({
  flex: '1 1 200px',
  minHeight: 120,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  gap: vars.space.compact,
  padding: 18,
});

/** 갈래를 구분하는 40px 둥근 사각 아이콘 자리다. */
export const icon = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 40,
  height: 40,
  borderRadius: vars.radius.control,
});

/** 표현은 보라, 받아쓰기는 주황, 답변은 청록으로 갈래를 구분한다. */
export const iconTone = styleVariants({
  review: { background: vars.color.reviewBackground, color: vars.color.review },
  streak: { background: vars.color.streakBackground, color: vars.color.streak },
  accent: { background: vars.color.selected, color: vars.color.accent },
});

/** 시안의 15px 굵은 카드 제목이다. */
export const title = style({ fontSize: '15px' });

/** 보조 문구는 제목 바로 아래 붙인다. */
export const description = style({
  marginTop: 2,
  fontSize: vars.fontSize.label,
});
