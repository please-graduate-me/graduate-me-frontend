import { afterEach, describe, expect, it, vi } from 'vitest';
import { createReplayScheduler } from './replayScheduler';

afterEach(() => vi.useRealTimers());

describe('구절 자동 미리듣기 예약', () => {
  it('설정한 실제 시간 이후 한 번만 재생한다', () => {
    vi.useFakeTimers();

    const waiting = vi.fn(),
      replay = vi.fn();

    const scheduler = createReplayScheduler(waiting);

    scheduler.schedule(replay, 3);
    vi.advanceTimersByTime(2000);
    scheduler.schedule(replay, 3);
    vi.advanceTimersByTime(999);
    expect(replay).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(replay).toHaveBeenCalledTimes(1);
    expect(waiting.mock.calls).toEqual([[true], [false]]);
  });

  it('일시정지나 옵션 해제 시 취소한 예약은 재생하지 않는다', () => {
    vi.useFakeTimers();

    const scheduler = createReplayScheduler(vi.fn()),
      replay = vi.fn();

    scheduler.schedule(replay);
    scheduler.cancel();
    vi.advanceTimersByTime(5000);
    expect(replay).not.toHaveBeenCalled();
    expect(scheduler.waiting).toBe(false);
  });

  it('첫 미리듣기는 추가 반복 횟수에 포함하지 않는다', () => {
    vi.useFakeTimers();

    const scheduler = createReplayScheduler(vi.fn()),
      replay = vi.fn();

    scheduler.schedule(replay, 1, 3, false);
    vi.advanceTimersByTime(1000);

    for (let i = 0; i < 5; i++) {
      scheduler.schedule(replay, 1, 3);
      vi.advanceTimersByTime(1000);
    }

    expect(replay).toHaveBeenCalledTimes(4);
  });

  it('다른 구절로 이동하면 이전 예약과 횟수를 초기화한다', () => {
    vi.useFakeTimers();

    const scheduler = createReplayScheduler(vi.fn()),
      previous = vi.fn(),
      next = vi.fn();

    scheduler.schedule(previous, 1, 1);
    scheduler.reset();
    scheduler.schedule(next, 1, 1);
    vi.advanceTimersByTime(1000);
    expect(previous).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
    scheduler.reset();
    scheduler.schedule(next, 1, 1);
    vi.advanceTimersByTime(1000);
    expect(next).toHaveBeenCalledTimes(2);
  });

  it('계속 반복은 지정 횟수 없이 예약할 수 있다', () => {
    vi.useFakeTimers();

    const scheduler = createReplayScheduler(vi.fn()),
      replay = vi.fn();

    for (let i = 0; i < 12; i++) {
      scheduler.schedule(replay, 1, null);
      vi.advanceTimersByTime(1000);
    }

    expect(replay).toHaveBeenCalledTimes(12);
  });
});
