import { createGlobalTheme } from '@vanilla-extract/css';

/** 공통 디자인 값이 화면마다 달라지지 않도록 한곳에서 관리한다. */
export const vars = createGlobalTheme(':root', {
  color: {
    ink: '#162b34',
    muted: '#596b72',
    line: '#d8e1e4',
    accent: '#146754',
    background: '#f5f7f7',
    surface: '#ffffff',
    focus: '#e9ae3f',
    inputBorder: '#a9b9bf',
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
  font: { body: 'Arial, "Apple SD Gothic Neo", "Malgun Gothic", sans-serif' },
  space: { xs: '6px', sm: '10px', md: '16px', lg: '24px', xl: '32px' },
  radius: { control: '7px', panel: '12px' },
});
