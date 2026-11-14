import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 질문과 답변 말풍선을 대화처럼 위아래로 쌓는다. */
export const root = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  width: '100%',
  maxWidth: 400,
});

const bubble = style({
  maxWidth: '80%',
  padding: '12px 16px',
  fontSize: 14,
  fontWeight: 700,
  lineHeight: 1.5,
});

/** 학습자의 질문은 왼쪽 흰 말풍선으로 둔다. */
export const question = style([
  bubble,
  {
    alignSelf: 'flex-start',
    borderRadius: '16px 16px 16px 4px',
    border: '1px solid ' + vars.color.line,
    background: '#FFFFFF',
    color: vars.color.ink,
  },
]);

/** 조교의 답변은 오른쪽 청록 말풍선으로 둔다. */
export const answer = style([
  bubble,
  {
    alignSelf: 'flex-end',
    borderRadius: '16px 16px 4px 16px',
    background: '#0B7A62',
    color: '#FFFFFF',
  },
]);

/** 답변 작성자가 조교임을 작은 표시로 붙인다. */
export const tag = style({
  alignSelf: 'flex-end',
  padding: '4px 10px',
  borderRadius: 6,
  background: '#E3F4EE',
  color: '#0B7A62',
  fontSize: 11,
  fontWeight: 800,
});
