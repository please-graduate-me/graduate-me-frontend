import { style } from '@vanilla-extract/css';
import { layered } from '@/lib/styles/layers.css';

/** 화면에서는 감추고 보조 기술에는 읽히게 하는 표준 clip 기법이다. */
export const root = style(
  layered({
    position: 'absolute',
    width: 1,
    height: 1,
    margin: -1,
    padding: 0,
    border: 0,
    overflow: 'hidden',
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    whiteSpace: 'nowrap',
  })
);
