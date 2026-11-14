import { style } from '@vanilla-extract/css';
import { vars } from '@/lib/styles/theme.css';

/** 자료 영역의 제목과 다음 학습 카드 사이를 일정하게 유지한다. */
export const root = style({ margin: '0 0 26px' });

/** 최근 자료 카드를 같은 크기로 배치하고 좁은 화면에서는 한 열로 내린다. */
export const resume = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: 18,
});

/** 목록 제목과 전체 보관함 이동을 같은 줄에 둔다. */
export const heading = style({
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'space-between',
  gap: 12,
});

/** 필터 아래의 목록과 간격만 정하고 조작 외형은 Astryx가 담당한다. */
export const tabs = style({ marginBottom: 20 });

/** 목록의 기본 들여쓰기를 제거한다. */
export const list = style({ listStyle: 'none', margin: 0, padding: 0 });

/** 활동 시각은 자료 제목보다 낮은 위계로 읽게 한다. */
export const updated = style({
  flex: 'none',
  maxWidth: 100,
  color: vars.color.muted,
  fontSize: vars.fontSize.caption,
  paddingTop: 2,
});

/** 목록이 요약임을 알려 전체 자료 수와 혼동하지 않게 한다. */
export const listNote = style({
  color: vars.color.muted,
  fontSize: vars.fontSize.caption,
  margin: '16px 0 0',
});

/** 데이터를 기다리는 상태를 빈 목록과 구분한다. */
export const loading = style({
  minHeight: 160,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: vars.color.muted,
  fontSize: vars.fontSize.small,
});

/** 삭제 확인 대상은 긴 제목도 줄바꿈한다. */
export const removalTitle = style({
  margin: 0,
  overflowWrap: 'anywhere',
  fontWeight: 500,
});
