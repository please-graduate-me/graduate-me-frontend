import { style } from '@vanilla-extract/css';
import { layered } from '@/lib/styles/layers.css';
import { vars } from '@/lib/styles/theme.css';

/** 도구 묶음을 한 줄에 두고 좁으면 줄바꿈한다. */
export const root = style(
  layered({
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: vars.space.xs,
    minWidth: 0,
  })
);

/** 앞쪽과 뒤쪽 도구 묶음이다. */
export const group = style(
  layered({
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: vars.space.xs,
    minWidth: 0,
  })
);

/** 뒤쪽 묶음을 오른쪽 끝으로 민다. */
export const end = style(layered({ marginInlineStart: 'auto' }));
