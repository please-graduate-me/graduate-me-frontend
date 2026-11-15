import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 빈칸 문장 아래에 보기 타일 줄을 가운데 정렬로 쌓는다. */
export const root = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 18,
  maxWidth: '100%',
});

/** 예시 문장은 숫자 글꼴로 크게 보여 풀이 화면처럼 읽히게 한다. */
export const sentence = style({
  margin: 0,
  fontFamily: vars.font.numeric,
  fontSize: 22,
  fontWeight: 700,
  textAlign: 'center',
});

/** 채워진 빈칸은 청록 밑줄과 글자로 정답 자리임을 보여 준다. */
export const blank = style({
  display: 'inline-block',
  minWidth: 110,
  borderBottom: `3px solid ${vars.color.accent}`,
  color: vars.color.accent,
});

/** 보기 타일을 한 줄에 흘려 두고 좁은 화면에서는 줄바꿈한다. */
export const tiles = style({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: 10,
});

/** 아래 테두리를 두껍게 한 흰 단어 타일로 누를 수 있는 보기처럼 보이게 한다. */
export const tile = style({
  padding: '8px 14px',
  borderRadius: vars.radius.control,
  border: `1.5px solid ${vars.color.lineStrong}`,
  borderBottomWidth: 4,
  background: vars.color.surface,
  fontFamily: vars.font.numeric,
  fontSize: 15,
  fontWeight: 700,
});

/** 고른 정답 타일은 청록 테두리와 옅은 청록 바탕으로 구분한다. */
export const tileCorrect = style({
  borderColor: vars.color.accent,
  background: vars.color.selected,
  color: vars.color.accent,
});
