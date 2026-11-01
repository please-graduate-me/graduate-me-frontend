import { style, globalStyle } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';
/** 추천 항목 수와 화면 폭이 달라도 읽는 순서를 유지한다. */
export const cards = style([
  {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '18px',
  },
  {
    '@media': { '(max-width: 800px)': { gridTemplateColumns: '1fr' } },
  },
]);
/** 실패 메시지를 일반 안내와 시각적으로 구분한다. */
export const error = style([
  {
    padding: '14px 16px',
    borderRadius: '7px',
    margin: '16px 0',
    background: vars.color.notice,
  },
  {
    color: vars.color.error,
    background: vars.color.errorBackground,
  },
]);
/** 영역의 성격을 제목보다 낮은 위계로 전달한다. */
export const eyebrow = style([
  {
    color: vars.color.accent,
    fontWeight: '700',
    fontSize: '13px',
    marginBottom: '10px',
  },
]);
/** 학습 기록에 목록 기본 여백이 중복되지 않게 한다. */
export const history = style([
  { listStyle: 'none', margin: '0', padding: '0' },
]);
/** 보조 설명이 주요 행동보다 먼저 눈에 띄지 않게 한다. */
export const muted = style([{ color: vars.color.muted }]);

/** 버튼과 입력 부품이 좁은 화면에서 자연스럽게 줄바꿈되게 한다. */
export const row = style([
  {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
]);

/** 제목과 보조 조작을 한 영역으로 인식하게 한다. */
export const sectionHeading = style([
  {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '20px',
    marginBottom: '20px',
  },
  {
    '@media': {
      '(max-width: 800px)': {
        alignItems: 'flex-start',
        flexDirection: 'column',
      },
    },
  },
]);
/** 부가 정보가 본문과 같은 강조 수준을 갖지 않게 한다. */
export const small = style([{ fontSize: '13px' }]);
/** URL 입력 영역의 선택자가 다른 폼으로 퍼지지 않게 한다. */
export const urlForm = style({});

globalStyle(`.${sectionHeading} h1`, { marginBottom: '0' });
globalStyle(`.${sectionHeading} h2`, { marginBottom: '0' });

globalStyle(`.${urlForm} .${row}`, { flexWrap: 'nowrap', margin: '8px 0' });
globalStyle(`.${urlForm} input`, { flex: '1' });

/** 설명 길이가 달라도 추천 항목 내부의 세로 흐름을 유지한다. */
export const card = style({
  margin: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
});
/** 설명 길이가 달라도 추천 선택 버튼의 위치를 맞춘다. */
export const cardAction = style({ marginTop: 'auto' });

globalStyle(`.${history} li`, {
  padding: '18px 0',
  borderBottom: `1px solid ${vars.color.line}`,
  display: 'flex',
  justifyContent: 'space-between',
  gap: '16px',
});
globalStyle(`.${history} a`, { fontWeight: '600' });

globalStyle(`.${history} li`, {
  '@media': {
    '(max-width: 800px)': { alignItems: 'flex-start', flexDirection: 'column' },
  },
});
