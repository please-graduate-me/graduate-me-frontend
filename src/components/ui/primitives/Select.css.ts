import { style } from '@vanilla-extract/css';
import { layered } from '@/lib/styles/layers.css';
import { vars } from '@/lib/styles/theme.css';

/** 화살표 아이콘을 선택 상자 위에 겹치기 위한 기준 상자다. */
export const box = style(layered({ position: 'relative', minWidth: 0 }));

/** 브라우저 기본 화살표를 지우고 아이콘 자리만큼 오른쪽 여백을 둔다. */
export const select = style(
  layered({
    // 공통 입력 여백보다 항상 앞서도록 요소 선택자로 우선순위를 높인다.
    selectors: {
      'select&': {
        appearance: 'none',
        paddingInlineEnd: 44,
        cursor: 'pointer',
        textOverflow: 'ellipsis',
      },
    },
  })
);

/** 선택 상자 오른쪽의 펼침 화살표다. */
export const chevron = style(
  layered({
    position: 'absolute',
    top: '50%',
    right: 14,
    color: vars.color.muted,
    transform: 'translateY(-50%)',
    pointerEvents: 'none',
  })
);
