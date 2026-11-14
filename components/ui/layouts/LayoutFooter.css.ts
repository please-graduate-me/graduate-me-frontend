import { style } from '@vanilla-extract/css';
import { layered } from '@/lib/styles/layers.css';
import { vars } from '@/lib/styles/theme.css';

/** 바닥 동작을 오른쪽 끝에 모은다. */
export const root = style(
  layered({
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: vars.space.sm,
    flexShrink: 0,
    padding: `${vars.space.md} ${vars.space.lg}`,
  })
);

/** 본문과 바닥을 위 구분선으로 나눈다. */
export const divider = style(
  layered({ borderTop: `1px solid ${vars.color.line}` })
);
