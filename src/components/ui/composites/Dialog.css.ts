import { style } from '@vanilla-extract/css';
import { layered } from '@/lib/styles/layers.css';
import { vars } from '@/lib/styles/theme.css';

/** 제목, 설명, 닫기 버튼을 한 줄에 둔다. */
export const header = style(
  layered({
    display: 'flex',
    alignItems: 'flex-start',
    gap: vars.space.md,
    padding: `${vars.space.lg} ${vars.space.lg} ${vars.space.md}`,
  })
);

/** 제목과 설명 묶음이다. */
export const heading = style(
  layered({
    display: 'grid',
    flex: '1 1 auto',
    gap: vars.space.xs,
    minWidth: 0,
  })
);

/** 대화상자 제목이다. */
export const title = style(
  layered({
    margin: 0,
    color: vars.color.ink,
    fontSize: vars.fontSize.heading3,
    fontWeight: vars.fontWeight.heavy,
    lineHeight: vars.lineHeight.heading,
  })
);

/** 제목 아래 보조 설명이다. */
export const description = style(
  layered({
    margin: 0,
    color: vars.color.muted,
    fontSize: vars.fontSize.small,
    lineHeight: vars.lineHeight.small,
  })
);

/** 닫기 버튼은 제목 첫 줄과 높이를 맞춘다. */
export const close = style(
  layered({
    // 공통 버튼의 여백 초기화보다 앞서도록 요소 선택자로 우선순위를 높인다.
    selectors: { 'button&': { marginTop: -8, marginRight: -8 } },
  })
);

/** 길어지면 이 영역만 스크롤하는 본문이다. */
export const content = style(
  layered({
    flex: '1 1 auto',
    minHeight: 0,
    padding: `0 ${vars.space.lg} ${vars.space.lg}`,
    overflowY: 'auto',
  })
);

/** 구분선 아래 오른쪽 정렬된 동작 버튼 줄이다. */
export const footer = style(
  layered({
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    gap: vars.space.sm,
    padding: `${vars.space.md} ${vars.space.lg}`,
    borderTop: `1px solid ${vars.color.line}`,
  })
);
