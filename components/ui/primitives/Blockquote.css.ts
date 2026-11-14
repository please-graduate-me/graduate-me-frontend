import { style } from '@vanilla-extract/css';
import { layered } from '@/lib/styles/layers.css';
import { vars } from '@/lib/styles/theme.css';

/** 원문 인용을 따뜻한 바탕과 세리프 글꼴로 본문과 구분한다. */
export const root = style(
  layered({
    margin: 0,
    padding: `${vars.space.compact} ${vars.space.md}`,
    border: `1px solid ${vars.color.quoteLine}`,
    borderRadius: vars.radius.control,
    background: vars.color.quote,
    color: vars.color.documentInk,
    fontFamily: vars.font.document,
    fontSize: vars.fontSize.body,
    lineHeight: '1.6',
    overflowWrap: 'anywhere',
  })
);
