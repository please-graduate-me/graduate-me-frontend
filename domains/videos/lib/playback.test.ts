import { describe, expect, it } from 'vitest';
import { reachedEnd, rewindTarget, playbackPosition } from './playback';

describe('플레이어 경계', () => {
  it('되감기는 구절 범위를 넘지 않는다', () => {
    expect(rewindTarget(10.5, 10, 15)).toBe(10);
    expect(rewindTarget(100, 10, 15)).toBe(13);
    expect(rewindTarget(14, 10, 15)).toBe(12);
  });

  it('끝 시각부터 정지한다', () => {
    expect(reachedEnd(14.99, 15)).toBe(false);
    expect(reachedEnd(15, 15)).toBe(true);
  });
});

describe('재생 탐색과 학습 구절 연결', () => {
  const segments = [
    { start: 2, end: 5 },
    { start: 8, end: 12 },
  ];

  it('선택한 시각의 실제 구절과 위치를 복원한다', () => {
    expect(playbackPosition(10, segments)).toEqual({ index: 1, time: 10 });
    expect(playbackPosition(6, segments)).toEqual({ index: 0, time: 5 });
    expect(playbackPosition(100, segments)).toEqual({ index: 1, time: 12 });
  });

  it('유효한 구절이나 시각이 없으면 학습 위치를 만들지 않는다', () => {
    expect(playbackPosition(0, [])).toBeNull();
    expect(playbackPosition(NaN, segments)).toBeNull();
  });
});
