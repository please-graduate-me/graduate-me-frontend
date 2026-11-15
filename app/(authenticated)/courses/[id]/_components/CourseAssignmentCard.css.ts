import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 카드에 올리거나 초점을 두면 살짝 떠올라 열어 볼 수 있는 과제임을 알린다. */
export const card = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-start',
  gap: vars.space.md,
  transition: `transform ${vars.motion.base} ease, filter ${vars.motion.base} ease`,
  selectors: {
    '&:hover, &:focus-within': {
      transform: 'translateY(-2px)',
      // 공통 Card의 테두리 외형을 덮지 않도록 그림자는 filter로 더한다.
      filter: 'drop-shadow(0 10px 24px rgba(22, 24, 29, 0.07))',
    },
  },
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      transition: 'none',
      selectors: { '&:hover, &:focus-within': { transform: 'none' } },
    },
  },
});

/** 자료 종류 그림은 줄어들지 않게 고정한다. */
export const kind = style({ flex: '0 0 auto' });

/** 영상 그림의 먹색 바탕이다. */
export const videoBack = style({ fill: vars.color.ink });

/** 영상 그림의 재생 표시다. */
export const videoPlay = style({ fill: vars.color.accentBright });

/** PDF 그림의 보라 바탕이다. */
export const pdfBack = style({ fill: vars.color.reviewBackground });

/** PDF 그림의 뒤쪽 종이다. */
export const pdfSheetBack = style({ fill: '#C9C2FB' });

/** PDF 그림의 앞쪽 종이다. */
export const pdfSheet = style({ fill: '#8B7CF6' });

/** PDF 종이 위 글줄이다. */
export const pdfLine = style({ fill: vars.color.onAccent });

/** 제목, 자료 정보와 제출 조건을 세로로 묶는다. */
export const body = style({
  flex: '1 1 260px',
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
});

/** 과제 이름은 카드 제목 크기로 둔다. */
export const title = style({ fontSize: 17, lineHeight: 1.4 });

/** 자료, 풀이 방식과 버전 정보는 낮은 위계의 굵은 보조 글자로 둔다. */
export const meta = style({
  margin: 0,
  fontSize: vars.fontSize.label,
  fontWeight: vars.fontWeight.bold,
  color: vars.color.muted,
});

/** 제출 조건을 회색 알약으로 한 줄에 흘린다. */
export const conditions = style({
  listStyle: 'none',
  margin: '2px 0 0',
  padding: 0,
  display: 'flex',
  flexWrap: 'wrap',
  gap: 6,
});

/** 제출 조건 하나의 회색 알약이다. */
export const condition = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  padding: '4px 10px',
  borderRadius: vars.radius.pill,
  background: vars.color.canvas,
  color: vars.color.ink,
  fontSize: vars.fontSize.caption,
  fontWeight: vars.fontWeight.bold,
});

/** 제출 상태와 이동 동작을 카드 오른쪽 끝에 세로로 둔다. */
export const side = style({
  marginLeft: 'auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: vars.space.sm,
});
