import { style } from '@vanilla-extract/css';
import { layered } from '@/lib/styles/layers.css';
import { vars } from '@/lib/styles/theme.css';

const selected =
  '&[aria-current]:not([aria-current="false"]), &[aria-pressed="true"]';

const selectedHover =
  '&[aria-current]:not([aria-current="false"]):hover, &[aria-pressed="true"]:hover';

/** 아이콘, 라벨, 개수를 한 줄에 두는 사이드바 항목이며 선택되면 먹색 바탕 흰 글자가 된다. */
export const item = style({
  color: vars.color.muted,
  fontSize: vars.fontSize.small,
  fontWeight: vars.fontWeight.bold,
  lineHeight: 1.3,
  selectors: {
    '&:hover': { color: vars.color.ink },
    [selected]: { color: vars.color.onAccent },
    [selectedHover]: { color: vars.color.onAccent },
  },
  ...layered({
    display: 'flex',
    alignItems: 'center',
    gap: vars.space.sm,
    width: '100%',
    minHeight: 44,
    margin: 0,
    padding: `0 ${vars.space.compact}`,
    border: 0,
    borderRadius: vars.radius.control,
    background: 'transparent',
    textAlign: 'start',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: `background-color ${vars.motion.fast} ${vars.motion.easeOut}`,
    selectors: {
      '&:hover': { background: vars.color.canvas },
      [selected]: { background: vars.color.ink },
      [selectedHover]: { background: vars.color.ink },
    },
    '@media': {
      '(prefers-reduced-motion: reduce)': { transition: 'none' },
    },
  }),
});

/** 라벨은 남은 폭을 채우고 길면 줄바꿈한다. */
export const label = style(
  layered({ flex: '1 1 auto', minWidth: 0, overflowWrap: 'anywhere' })
);

/** 오른쪽 개수·배지 자리이며 선택된 먹색 바탕 위에서는 밝은 회색으로 바뀐다. */
export const end = style(
  layered({
    display: 'inline-flex',
    alignItems: 'center',
    flexShrink: 0,
    color: vars.color.muted,
    fontFamily: vars.font.numeric,
    fontSize: vars.fontSize.label,
    fontVariantNumeric: 'tabular-nums',
    selectors: {
      [`${item}[aria-current]:not([aria-current="false"]) &, ${item}[aria-pressed="true"] &`]:
        { color: vars.color.lineStrong },
    },
  })
);
