import { style, styleVariants } from '@vanilla-extract/css';
import { layered } from '@/lib/styles/layers.css';
import { vars } from '@/lib/styles/theme.css';

/** 투명한 네이티브 파일 입력을 덮어 클릭·키보드·끌어 놓기를 모두 받는 영역이다. */
export const zone = style(
  layered({
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: vars.space.compact,
    minWidth: 0,
    border: `1.5px dashed ${vars.color.inputBorder}`,
    borderRadius: vars.radius.panel,
    background: vars.color.surface,
    color: vars.color.ink,
    transition: `border-color ${vars.motion.fast} ${vars.motion.easeOut}, background-color ${vars.motion.fast} ${vars.motion.easeOut}`,
    selectors: {
      '&:hover:not([data-disabled])': {
        borderColor: vars.color.accent,
        background: vars.color.canvas,
      },
      '&:has(input:focus-visible)': {
        borderColor: vars.color.accent,
        boxShadow: `0 0 0 3px ${vars.color.accentLine}`,
      },
      '&[data-dragging]': {
        borderColor: vars.color.accent,
        background: vars.color.selected,
      },
      '&[data-invalid]': { borderColor: vars.color.error },
      '&[data-disabled]': {
        background: vars.color.canvas,
        color: vars.color.subtle,
      },
    },
    '@media': {
      '(prefers-reduced-motion: reduce)': { transition: 'none' },
    },
  })
);

/** 끌어 놓기 영역은 크게, 입력 줄은 한 줄 높이로 보인다. */
export const mode = styleVariants({
  dropzone: layered({
    flexDirection: 'column',
    justifyContent: 'center',
    minHeight: 160,
    padding: vars.space.lg,
    textAlign: 'center',
  }),
  input: layered({
    minHeight: 52,
    padding: `0 ${vars.space.xs} 0 ${vars.space.md}`,
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: vars.radius.control,
  }),
});

/** 영역 전체를 덮는 투명 입력이다. */
export const input = style(
  layered({
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    margin: 0,
    opacity: 0,
    cursor: 'pointer',
    selectors: { '&:disabled': { cursor: 'not-allowed' } },
  })
);

/** 업로드 아이콘이다. */
export const icon = style(layered({ color: vars.color.accent }));

/** 안내 문구 묶음이다. */
export const text = style(
  layered({
    display: 'grid',
    gap: vars.space.xxs,
    minWidth: 0,
    flex: '1 1 auto',
  })
);

/** 선택한 파일 이름이나 선택 안내다. */
export const primary = style(
  layered({
    overflow: 'hidden',
    fontSize: vars.fontSize.body,
    fontWeight: vars.fontWeight.bold,
    lineHeight: vars.lineHeight.body,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  })
);

/** 형식과 크기 제한 안내다. */
export const secondary = style(
  layered({
    color: vars.color.muted,
    fontSize: vars.fontSize.label,
    lineHeight: vars.lineHeight.caption,
  })
);

/** 지우기 버튼은 투명 입력보다 위에 둔다. */
export const clear = style(
  layered({ selectors: { 'button&': { position: 'relative', zIndex: 1 } } })
);
