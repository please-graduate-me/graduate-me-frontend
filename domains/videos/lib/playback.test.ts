import { describe, expect, it } from 'vitest';
import { reachedEnd, rewindTarget } from './playback';
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
