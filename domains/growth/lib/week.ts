const dayMs = 24 * 60 * 60 * 1000;

/** 서버가 준 한국 날짜 today 기준으로 월요일 weekStart에서 시작한 주의 남은 날을 오늘 포함으로 센다. */
export function daysLeftInWeek(weekStart: string, today: string) {
  const elapsed = (Date.parse(today) - Date.parse(weekStart)) / dayMs;

  // 날짜 형식이 깨졌거나 다른 주면 남은 날을 지어내지 않고 표시를 생략하게 한다.
  if (!Number.isInteger(elapsed) || elapsed < 0 || elapsed > 6) return null;

  return 7 - elapsed;
}
