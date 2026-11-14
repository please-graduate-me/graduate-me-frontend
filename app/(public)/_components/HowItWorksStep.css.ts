import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 설명과 그림을 한 행에 두고 좁은 화면에서는 설명 아래로 그림을 내린다. */
export const row = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 48,
  '@media': { '(max-width: 800px)': { gap: 24 } },
});

/** 그림을 왼쪽에 두되 줄바꿈 시에는 DOM 순서대로 설명이 먼저 오게 방향만 뒤집는다. */
export const reversed = style({ flexDirection: 'row-reverse' });

/** 단계 번호, 제목, 설명을 세로로 쌓는다. */
export const copy = style({
  flex: '1 1 360px',
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  minWidth: 0,
});

/** 단계 번호를 청록 숫자로 작게 표시한다. */
export const number = style({
  color: vars.color.accent,
  fontSize: 13,
  fontWeight: 700,
  letterSpacing: '0.06em',
});

/** 설명 문단의 행간을 넓혀 읽기 편하게 한다. */
export const description = style({ lineHeight: 1.75 });

/** 단계 그림을 회색 둥근 판 위에 올린다. */
export const visual = style({
  flex: '1 1 360px',
  minWidth: 0,
  minHeight: 260,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 32,
  borderRadius: 24,
  background: '#F5F6F8',
  boxSizing: 'border-box',
  '@media': { '(max-width: 800px)': { minHeight: 200, padding: 20 } },
});
