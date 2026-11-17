import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 영역 제목과 자료 묶음을 한 단위로 쌓는다. */
export const root = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.md,
  minWidth: 0,
});

/** 아이콘 타일과 제목·설명을 한 줄에 맞춘다. */
export const header = style({
  display: 'flex',
  alignItems: 'center',
  gap: 14,
});

/** 영역 성격을 색으로 구분하는 작은 아이콘 타일이다. */
export const iconTile = style({
  width: 44,
  height: 44,
  flex: 'none',
  display: 'grid',
  placeItems: 'center',
  borderRadius: 12,
  color: vars.color.accent,
  background: vars.color.selected,
  selectors: {
    '&[data-tone="muted"]': {
      color: vars.color.muted,
      background: vars.color.neutral,
    },
    '&[data-tone="info"]': {
      color: vars.color.info,
      background: vars.color.infoBackground,
    },
  },
});

/** 묶음 제목은 시안의 18px 단계를 쓴다. */
export const title = style({ fontSize: vars.fontSize.heading3 });

/** 제목 아래 설명은 한 단계 낮은 위계로 붙인다. */
export const description = style({ marginTop: 2 });

/** 자료 타일을 담는 연한 회색 받침이다. */
export const tray = style({
  listStyle: 'none',
  margin: 0,
  padding: 20,
  display: 'grid',
  // 좁은 화면에서 최소 폭이 받침보다 커져 가로 스크롤이 생기지 않게 100%로 상한을 둔다.
  gridTemplateColumns: 'repeat(auto-fill, minmax(min(150px, 100%), 1fr))',
  gap: vars.space.md,
  borderRadius: 22,
  background: vars.color.canvas,
  '@media': {
    '(max-width: 480px)': { padding: 12, gap: vars.space.compact },
  },
});
