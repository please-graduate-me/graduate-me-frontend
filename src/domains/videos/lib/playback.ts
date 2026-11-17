/** 되감기가 현재 학습 구절의 범위를 벗어나지 않게 한다. */
export function rewindTarget(current: number, start: number, end: number) {
  return Math.max(start, Math.min(end, current) - 2);
}

/** 구절 종료 판정을 재생 제어에서 일관되게 사용한다. */
export function reachedEnd(current: number, end: number) {
  return current >= end;
}

/** 구절 사이의 무음과 범위 바깥 탐색은 가장 가까운 실제 구절 경계로 맞춘다. */
export function playbackPosition(
  time: number,
  segments: { start: number; end: number }[]
) {
  if (!segments.length || !Number.isFinite(time)) return null;
  let best = { index: 0, time: segments[0].start };
  let distance = Infinity;

  for (const [index, segment] of segments.entries()) {
    const target = Math.max(segment.start, Math.min(segment.end, time));
    const difference = Math.abs(target - time);

    if (difference < distance) {
      best = { index, time: target };
      distance = difference;
    }

    if (difference === 0) return best;
  }

  return best;
}
