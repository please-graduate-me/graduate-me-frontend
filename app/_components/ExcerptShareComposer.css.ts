import { keyframes, style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

const rise = keyframes({
  from: { opacity: 0, transform: 'translateY(6px)' },
  to: { opacity: 1, transform: 'none' },
});

const reducedMotion = '(prefers-reduced-motion: reduce)';

const enter = {
  animation: `${rise} 300ms ${vars.motion.easeOut}`,
  '@media': { [reducedMotion]: { animation: 'none' } },
};

/** 발췌 미리보기, 공유 설정, 기존 링크를 읽는 순서대로 쌓는다. */
export const body = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.comfortable,
  minWidth: 0,
});

/** 공유할 발췌를 캡션과 인용이 함께 담긴 따뜻한 카드로 먼저 확인하게 한다. */
export const excerpt = style({
  margin: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  padding: '18px 20px',
  border: `1px solid ${vars.color.quoteLine}`,
  borderRadius: vars.radius.panel,
  background: vars.color.quote,
});

/** 자료 제목과 위치를 인용 위에 작게 표시한다. */
export const caption = style({
  fontSize: vars.fontSize.caption,
  fontWeight: vars.fontWeight.heavy,
  color: vars.color.warning,
  overflowWrap: 'anywhere',
});

/** 위치 정보는 제목보다 낮은 위계로 둔다. */
export const captionMeta = style({
  fontWeight: vars.fontWeight.bold,
  color: vars.color.subtle,
});

/** 인용문을 문서 글꼴로 크게 읽게 하고 긴 발췌는 줄바꿈을 유지한다. */
export const quote = style({
  margin: 0,
  color: vars.color.documentInk,
  fontFamily: vars.font.document,
  overflowWrap: 'anywhere',
  fontSize: 19,
  fontWeight: 600,
  lineHeight: 1.55,
  whiteSpace: 'pre-wrap',
});

/** 공유 설정 입력 사이 간격이다. */
export const form = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 18,
  minWidth: 0,
});

/** 계정 지정 입력이 나타날 때 위로 떠오르게 한다. */
export const appear = style(enter);

/** 공개되는 내용과 공개되지 않는 내용을 한 상자 안에서 나눠 보여 준다. */
export const scope = style({
  borderRadius: vars.radius.panel,
  border: `1px solid ${vars.color.quoteLine}`,
  background: vars.color.quote,
  overflow: 'hidden',
});

/** 공개 범위 한 줄이며 두 번째 줄부터 구분선을 둔다. */
export const scopeRow = style({
  margin: 0,
  display: 'flex',
  gap: vars.space.compact,
  padding: '14px 16px',
  fontSize: vars.fontSize.small,
  lineHeight: 1.6,
  selectors: {
    '& + &': { borderTop: `1px solid ${vars.color.quoteLine}` },
  },
});

/** 공개되는 항목을 청록 표시로 구분한다. */
export const scopeShown = style({ color: vars.color.accent, marginTop: 1 });

/** 공개하지 않는 항목을 주황 표시로 구분한다. */
export const scopeHidden = style({ color: vars.color.warning, marginTop: 1 });

/** 공개 내용 머리말을 본문보다 진하게 둔다. */
export const scopeTitle = style({ color: vars.color.ink });

/** 생성한 주소와 복사 버튼을 청록 띠 안에 묶는다. */
export const created = style({
  ...enter,
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: vars.space.sm,
  padding: vars.space.compact,
  borderRadius: vars.radius.panel,
  background: vars.color.selected,
});

/** 주소 입력이 복사 버튼을 뺀 남은 폭을 쓴다. */
export const createdField = style({ flex: '1 1 240px', minWidth: 0 });

/** 기존 공유 링크 목록을 구분선 아래에 둔다. */
export const links = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xs,
  paddingTop: 18,
  borderTop: `1px solid ${vars.color.line}`,
});

/** 목록 제목 크기다. */
export const linksTitle = style({ fontSize: 15 });

/** 목록 기본 들여쓰기를 없앤다. */
export const list = style({
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.xxs,
});

/** 공유 링크 한 줄의 회색 띠다. */
export const item = style({
  ...enter,
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: vars.space.sm,
  minHeight: 52,
  padding: '4px 4px 4px 12px',
  borderRadius: vars.radius.control,
  background: vars.color.canvas,
});

/** 수신 범위와 상태 표지를 묶는다. */
export const itemLabel = style({
  flex: '1 1 auto',
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: vars.space.xs,
  fontSize: vars.fontSize.small,
  fontWeight: vars.fontWeight.bold,
});
