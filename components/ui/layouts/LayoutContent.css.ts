import { style } from '@vanilla-extract/css';
import { layered } from '@/lib/styles/layers.css';
import { vars } from '@/lib/styles/theme.css';

/** 남은 높이를 채우고 넘치는 내용은 이 영역 안에서만 스크롤한다. */
export const root = style(
  layered({
    flex: '1 1 auto',
    minHeight: 0,
    overflowY: 'auto',
    padding: `${vars.space.md} ${vars.space.lg}`,
  })
);
