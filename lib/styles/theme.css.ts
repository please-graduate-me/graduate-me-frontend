import { createGlobalTheme } from '@vanilla-extract/css';

/** 공통 디자인 값이 화면마다 달라지지 않도록 한곳에서 관리한다. */
export const vars = createGlobalTheme(':root', {
  color: {
    ink: '#24314b',
    muted: '#576985',
    line: '#d5def1',
    accent: '#254fca',
    background: '#ffffff',
    surface: '#ffffff',
    focus: '#254fca',
    inputBorder: '#acbce5',
    notice: '#fff5df',
    error: '#9b2c2c',
    errorBackground: '#fff0ee',
    success: '#e8f4ed',
    match: '#276243',
    differenceBackground: '#fde3d5',
    differenceText: '#8c2c16',
    extraBackground: '#e5e6fa',
    extraText: '#3d3880',
    video: '#19292e',
  },
  font: { body: '"DM Sans", "Noto Sans KR", sans-serif' },
  space: { xs: '6px', sm: '10px', md: '16px', lg: '24px', xl: '32px' },
  radius: { control: '7px', panel: '12px' },
});
