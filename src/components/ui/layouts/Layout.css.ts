import { style } from '@vanilla-extract/css';
import { layered } from '@/lib/styles/layers.css';

/** 머리, 본문, 바닥을 세로로 두고 본문만 남은 높이를 차지한다. */
export const root = style(
  layered({
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0,
    maxHeight: '100%',
  })
);
