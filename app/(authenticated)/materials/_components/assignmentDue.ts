const dayMs = 24 * 60 * 60 * 1000;
const kstOffset = 9 * 60 * 60 * 1000;

// 마감 알약은 한국 날짜 기준이라 시각 차이가 아닌 달력 날짜 차이로 센다.
const kstDay = (time: number) => Math.floor((time + kstOffset) / dayMs);

/** 과제 마감까지 남은 한국 달력 날짜 수이며 이미 지났으면 음수다. */
export function daysUntilDue(dueAt: string, now = Date.now()) {
  const due = Date.parse(dueAt);

  if (due < now) return -1;

  return kstDay(due) - kstDay(now);
}

/** 남은 날 수를 D-day, D-n, 기한 지남 표지로 바꾼다. */
export const dueLabel = (days: number) =>
  days < 0 ? '기한 지남' : days === 0 ? 'D-day' : `D-${days}`;
