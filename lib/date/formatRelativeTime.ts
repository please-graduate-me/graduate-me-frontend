const minute = 60_000;
const hour = 60 * minute;

const absoluteFormat = new Intl.DateTimeFormat('ko-KR', {
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

const fullFormat = new Intl.DateTimeFormat('ko-KR', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

/** 지난 활동 시각을 N분 전, N시간 전, 어제, 그 이전은 절대 날짜로 표시한다. */
export function formatRelativeTime(value: string | Date, now = new Date()) {
  const date = new Date(value);
  const elapsed = now.getTime() - date.getTime();

  // 기기 시계가 서버보다 늦어 미래 시각이 오면 음수 분 대신 방금 전으로 본다.
  if (elapsed < minute) return '방금 전';
  if (elapsed < hour) return `${Math.floor(elapsed / minute)}분 전`;
  if (elapsed < 24 * hour) return `${Math.floor(elapsed / hour)}시간 전`;

  const yesterday = new Date(now);

  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return '어제';

  return absoluteFormat.format(date);
}

/** 상대 시각 표시의 title에 넣을 연도까지 포함한 절대 시각이다. */
export const formatAbsoluteTime = (value: string | Date) =>
  fullFormat.format(new Date(value));
