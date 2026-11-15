import { style } from '@vanilla-extract/css';
import { layered } from '@/lib/styles/layers.css';
import { vars } from '@/lib/styles/theme.css';

const compact = 'screen and (max-width: 759px)';

/** 넓은 화면에서만 보이는 더보기 메뉴 자리다. */
export const desktop = style(
  layered({
    display: 'flex',
    '@media': { [compact]: { display: 'none' } },
  })
);

/** 주요 메뉴와 같은 모양의 더보기 버튼이며 전역 글자 초기화를 이기도록 글자 속성만 계층 밖에 둔다. */
export const trigger = style({
  color: vars.color.muted,
  fontSize: vars.fontSize.small,
  fontWeight: vars.fontWeight.bold,
  lineHeight: 1.2,
  selectors: {
    '&:hover, &[data-state="open"]': { color: vars.color.ink },
  },
  ...layered({
    display: 'inline-flex',
    alignItems: 'center',
    gap: vars.space.xxs,
    minHeight: 44,
    margin: 0,
    padding: `0 ${vars.space.compact}`,
    border: 0,
    borderBottom: '2px solid transparent',
    background: 'transparent',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
  }),
});

/** 접힌 패널 안에서 더보기 항목을 바로 펼쳐 보이는 목록이다. */
export const mobile = style(
  layered({
    display: 'none',
    '@media': {
      [compact]: {
        display: 'grid',
        gap: vars.space.xxs,
        marginTop: vars.space.xs,
        paddingTop: vars.space.sm,
        borderTop: `1px solid ${vars.color.line}`,
      },
    },
  })
);

/** 패널 안 더보기 묶음 제목이다. */
export const heading = style(
  layered({
    margin: 0,
    padding: `0 ${vars.space.compact}`,
    color: vars.color.subtle,
    fontSize: vars.fontSize.label,
    fontWeight: vars.fontWeight.bold,
    lineHeight: vars.lineHeight.caption,
  })
);

/** 패널 안 더보기 항목 목록이다. */
export const list = style(
  layered({
    display: 'grid',
    gap: vars.space.xxs,
    margin: 0,
    padding: 0,
    listStyle: 'none',
  })
);

/** 패널 안 더보기 항목 줄이며 버튼일 때도 전역 글자 초기화를 이기도록 글자 속성만 계층 밖에 둔다. */
export const link = style({
  color: vars.color.ink,
  fontSize: vars.fontSize.body,
  fontWeight: vars.fontWeight.bold,
  ...layered({
    display: 'flex',
    alignItems: 'center',
    gap: vars.space.sm,
    width: '100%',
    minHeight: 48,
    padding: `0 ${vars.space.compact}`,
    border: 0,
    borderRadius: vars.radius.small,
    background: 'transparent',
    textAlign: 'left',
    textDecoration: 'none',
    cursor: 'pointer',
    selectors: { '&:hover': { background: vars.color.canvas } },
  }),
});

/** 항목 앞 아이콘 자리다. */
export const icon = style(
  layered({ display: 'inline-flex', flexShrink: 0, color: vars.color.muted })
);

/** 항목 끝의 개수 배지 자리이며 라벨과 떨어뜨려 오른쪽 끝에 붙인다. */
export const end = style(
  layered({ display: 'inline-flex', flexShrink: 0, marginLeft: 'auto' })
);
