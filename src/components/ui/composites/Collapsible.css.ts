import { keyframes, style } from '@vanilla-extract/css';
import { layered } from '@/lib/styles/layers.css';
import { vars } from '@/lib/styles/theme.css';

const reveal = keyframes({
  from: { opacity: 0, transform: 'translateY(-4px)' },
  to: { opacity: 1, transform: 'none' },
});

/** 펼침 영역 전체다. */
export const root = style(layered({ minWidth: 0 }));

/** 누르면 펼치고 접는 제목 줄이다. */
export const summary = style(
  layered({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: vars.space.sm,
    minHeight: 48,
    padding: `0 ${vars.space.compact}`,
    borderRadius: vars.radius.control,
    color: vars.color.ink,
    fontSize: vars.fontSize.small,
    fontWeight: vars.fontWeight.bold,
    lineHeight: vars.lineHeight.small,
    listStyle: 'none',
    cursor: 'pointer',
    userSelect: 'none',
    transition: `background-color ${vars.motion.fast} ${vars.motion.easeOut}`,
    selectors: {
      '&::-webkit-details-marker': { display: 'none' },
      '&::marker': { content: '""' },
      '&:hover': { background: vars.color.canvas },
    },
    '@media': {
      '(prefers-reduced-motion: reduce)': { transition: 'none' },
    },
  })
);

/** 제목 글자와 아이콘 묶음이다. */
export const trigger = style(
  layered({
    display: 'inline-flex',
    alignItems: 'center',
    gap: vars.space.xs,
    minWidth: 0,
  })
);

/** 알약 표시가 있는 제목 줄은 줄 전체 대신 알약만 가리킴에 반응한다. */
export const pillSummary = style(
  layered({
    padding: 0,
    selectors: { '&:hover': { background: 'transparent' } },
  })
);

/** 오른쪽의 "펼쳐 보기" 알약이다. */
export const pill = style(
  layered({
    display: 'inline-flex',
    alignItems: 'center',
    gap: vars.space.xs,
    flexShrink: 0,
    minHeight: 44,
    padding: '0 14px',
    border: `1px solid ${vars.color.line}`,
    borderRadius: vars.radius.pill,
    background: vars.color.surface,
    transition: `background-color ${vars.motion.fast} ${vars.motion.easeOut}`,
    selectors: {
      [`${pillSummary}:hover &`]: { background: vars.color.canvas },
    },
    '@media': {
      '(prefers-reduced-motion: reduce)': { transition: 'none' },
    },
  })
);

/** 접힌 상태에서만 보이는 알약 문구다. */
export const closedLabel = style(
  layered({
    selectors: { [`${root}[open] > ${summary} &`]: { display: 'none' } },
  })
);

/** 펼친 상태에서만 보이는 알약 문구다. */
export const openLabel = style(
  layered({
    selectors: { [`${root}:not([open]) > ${summary} &`]: { display: 'none' } },
  })
);

/** 펼치면 뒤집히는 화살표다. */
export const chevron = style(
  layered({
    color: vars.color.muted,
    transition: `transform ${vars.motion.base} ${vars.motion.easeOut}`,
    selectors: {
      [`${root}[open] > ${summary} &`]: { transform: 'rotate(180deg)' },
    },
    '@media': {
      '(prefers-reduced-motion: reduce)': { transition: 'none' },
    },
  })
);

/** 펼친 내용 영역이다. */
export const content = style(
  layered({
    display: 'grid',
    gap: vars.space.compact,
    padding: `${vars.space.xs} ${vars.space.compact} ${vars.space.md}`,
    animation: `${reveal} ${vars.motion.base} ${vars.motion.easeOut}`,
    '@media': {
      '(prefers-reduced-motion: reduce)': { animation: 'none' },
    },
  })
);
