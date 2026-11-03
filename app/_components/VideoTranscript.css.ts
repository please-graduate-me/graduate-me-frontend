import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 넓은 화면에서는 영상 옆에, 좁은 화면에서는 아래에 대본을 배치한다. */
export const layout = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 2fr) minmax(260px, 1fr)',
  gap: vars.space.md,
  alignItems: 'stretch',
  marginBlock: vars.space.md,
  '@media': { '(max-width: 800px)': { gridTemplateColumns: 'minmax(0, 1fr)' } },
});

/** 영상의 최소 콘텐츠 너비가 대본을 화면 밖으로 밀지 않게 한다. */
export const video = style({ minWidth: 0 });

/** 누적 문장이 늘어도 영상 옆 영역의 높이를 늘리지 않는다. */
export const transcript = style({
  display: 'flex',
  flexDirection: 'column',
  minHeight: 0,
  minWidth: 0,
  height: 0,
  maxHeight: '560px',
  minBlockSize: '100%',
  border: `1px solid ${vars.color.line}`,
  borderRadius: vars.radius.control,
  background: vars.color.background,
  overflow: 'hidden',
  '@media': { '(max-width: 800px)': { height: '280px', minBlockSize: 0 } },
});

/** 제목과 누적 문장 수를 함께 읽게 한다. */
export const heading = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: `${vars.space.md} ${vars.space.md} 0`,
  gap: vars.space.sm,
});

/** 대본 제목의 기본 여백이 영상 높이에 영향을 주지 않게 한다. */
export const title = style({ margin: 0, fontSize: '16px' });

/** 누적 문장 수는 본문보다 낮은 위계로 표시한다. */
export const count = style({ color: vars.color.muted, fontSize: '13px' });

/** 대본이 채워지는 기준을 짧게 안내한다. */
export const description = style({
  margin: `${vars.space.sm} ${vars.space.md}`,
  color: vars.color.muted,
  fontSize: '13px',
});

/** 긴 대본은 패널 안에서만 스크롤한다. */
export const sentences = style({
  position: 'relative',
  overflowY: 'auto',
  minHeight: 0,
  margin: 0,
  padding: vars.space.sm,
  listStyle: 'none',
});

/** 현재 학습 중인 문장을 누적된 문장과 구분한다. */
export const sentence = style({
  padding: vars.space.sm,
  borderRadius: vars.radius.control,
  selectors: {
    '&[aria-current="true"]': {
      background: vars.color.success,
      boxShadow: `inset 3px 0 ${vars.color.accent}`,
    },
  },
});

/** 영상에서 문장이 등장한 위치를 보조 정보로 표시한다. */
export const time = style({
  fontSize: '12px',
  color: vars.color.muted,
  fontVariantNumeric: 'tabular-nums',
});

/** 긴 문장도 패널 너비 안에서 자연스럽게 줄바꿈한다. */
export const text = style({
  margin: '4px 0 0',
  lineHeight: 1.65,
  overflowWrap: 'anywhere',
});
