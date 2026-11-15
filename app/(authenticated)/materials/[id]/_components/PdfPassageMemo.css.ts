import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 라벨, 입력, 안내, 저장 버튼을 세로로 쌓는다. */
export const root = style({ display: 'grid', gap: vars.space.sm });

/** 공개 범위 안내는 작은 보조 글자로 둔다. */
export const note = style({ fontSize: 12 });

/** 저장 실패 원인을 입력 아래에 보여 준다. */
export const error = style({ color: vars.color.error });

/** 저장 버튼과 저장 완료 안내를 한 줄에 둔다. */
export const actions = style({
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.sm,
});
