import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 넓은 화면은 대본을 영상 옆에, 좁은 화면은 영상 뒤에 배치한다. */
export const layout = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 2fr) minmax(260px, 1fr)',
  gap: vars.space.md,
  alignItems: 'stretch',
  marginBlock: vars.space.md,
  '@media': { '(max-width: 800px)': { gridTemplateColumns: 'minmax(0, 1fr)' } },
});

/** 영상이 대본을 화면 밖으로 밀지 않게 한다. */
export const video = style({ minWidth: 0 });

/** 긴 대본은 카드 높이를 넘어 늘어나지 않게 한다. */
export const transcript = style({
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
  minHeight: 0,
  height: 0,
  maxHeight: 560,
  minBlockSize: '100%',
  overflow: 'hidden',
  gap: vars.space.sm,
  '@media': { '(max-width: 800px)': { height: 280, minBlockSize: 0 } },
});

/** 제목과 누적 문장 수를 같은 행에 둔다. */
export const heading = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: vars.space.sm,
});

/** 제목이 대본 높이에 불필요한 여백을 더하지 않게 한다. */
export const title = style({ margin: 0 });

/** 문장 수는 보조 정보의 위계를 따른다. */
export const count = style({ color: vars.color.muted });

/** 대본이 채워지는 기준을 짧게 안내한다. */
export const description = style({ color: vars.color.muted });

/** 현재 문장으로 이동할 기준은 목록 내부에 둔다. */
export const sentences = style({
  position: 'relative',
  overflowY: 'auto',
  minHeight: 0,
});
