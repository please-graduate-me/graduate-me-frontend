import { style } from '@vanilla-extract/css';
import { layered } from '@/lib/styles/layers.css';
import { vars } from '@/lib/styles/theme.css';

/** 이전·현재·다음을 가운데 한 줄로 둔다. */
export const root = style(
  layered({
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: vars.space.sm,
  })
);

/** 숫자 서체로 쓴 현재 페이지 표기다. */
export const current = style(
  layered({
    minWidth: 72,
    color: vars.color.ink,
    fontFamily: vars.font.numeric,
    fontSize: vars.fontSize.small,
    fontWeight: vars.fontWeight.bold,
    fontVariantNumeric: 'tabular-nums',
    textAlign: 'center',
  })
);
