/** 되감기가 현재 학습 구절의 범위를 벗어나지 않게 한다. */
export function rewindTarget(current: number, start: number, end: number) {
  return Math.max(start, Math.min(end, current) - 2);
}
/** 구절 종료 판정을 재생 제어에서 일관되게 사용한다. */
export function reachedEnd(current: number, end: number) {
  return current >= end;
}
