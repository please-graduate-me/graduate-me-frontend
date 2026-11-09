import type { SourceInput } from '@/domains/materials/model/source';

/** 실제 활동 시각을 한국어 날짜로 표시한다. */
export const formatDate = (value: string) =>
  new Intl.DateTimeFormat('ko-KR', {
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));

/** 선택한 자료 위치를 원문과 같은 기준으로 표시한다. */
export const sourceLabel = (source: SourceInput & { start?: number }) =>
  source.kind === 'pdf'
    ? `PDF · ${source.page}페이지`
    : `영상 · ${Math.floor((source.start ?? 0) / 60)}:${String(Math.floor((source.start ?? 0) % 60)).padStart(2, '0')}`;
