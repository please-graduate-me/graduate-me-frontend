import { describe, expect, it, vi } from 'vitest';
import { createWatchPositionRecorder } from './watchPosition';
import { createDemoLesson } from '../lib/demoLesson';
import { demoYoutubeId } from '../model/demo';

const lesson = (version = 'version-1', revision = 0) => ({
  ...createDemoLesson({
    youtubeId: demoYoutubeId,
    status: 'ready',
    segments: [],
  }),
  progress: {
    currentIndex: 0,
    mode: 'blank',
    favorite: false,
    watchVersion: version,
    watchRevision: revision,
    playbackPosition: 10,
    scriptPosition: 20,
    scriptMaxPosition: 20,
    watchMode: 'dictation',
  },
});

describe('별도 시청 위치 저장', () => {
  it('응답 유실에는 동일 요청을 재전송하고 다음 위치는 갱신한 revision을 사용한다', async () => {
    const bodies: Record<string, unknown>[] = [];

    const transport = vi.fn(async (_path: string, init?: RequestInit) => {
      const input = JSON.parse(String(init?.body)) as Record<string, unknown>;

      bodies.push(input);
      if (bodies.length === 1) throw new Error('응답 유실');

      return Response.json({
        ok: true,
        watchRevision: bodies.length - 1,
        playbackPosition: input.position,
        scriptPosition: 0,
        scriptMaxPosition: 0,
      });
    });

    const recorder = createWatchPositionRecorder(
      'video',
      { watchVersion: 'version-1', watchRevision: 0 },
      transport
    );

    await expect(recorder.record(10, 'dictation')).rejects.toThrow(
      '응답을 받지 못했습니다.'
    );

    await recorder.record(12, 'dictation');

    expect(bodies).toHaveLength(3);
    expect(bodies[0].requestId).toBe(bodies[1].requestId);
    expect(bodies[2].requestId).not.toBe(bodies[1].requestId);
    expect(bodies.map((body) => body.expectedRevision)).toEqual([0, 0, 1]);
    expect(recorder.positions.playbackPosition).toBe(12);
  });

  it('충돌하면 GET으로 확인하고 명시적 복구 전에는 다른 기기 위치를 덮어쓰지 않는다', async () => {
    const bodies: Record<string, unknown>[] = [];

    const transport = vi.fn(async (path: string, init?: RequestInit) => {
      if (!path.endsWith('/actions'))
        return Response.json(lesson('version-1', 3));
      const input = JSON.parse(String(init?.body)) as Record<string, unknown>;

      bodies.push(input);
      if (bodies.length === 1)
        return Response.json({ error: '저장 충돌' }, { status: 409 });

      return Response.json({
        ok: true,
        watchRevision: 4,
        playbackPosition: 21,
        scriptPosition: 20,
        scriptMaxPosition: 20,
      });
    });

    const recorder = createWatchPositionRecorder(
      'video',
      { watchVersion: 'version-1', watchRevision: 0 },
      transport
    );

    await expect(recorder.record(21, 'dictation')).rejects.toThrow('다른 창');
    await expect(recorder.record(22, 'dictation')).rejects.toThrow('충돌');
    expect(bodies).toHaveLength(1);
    await recorder.resume();
    await recorder.record(21, 'dictation');
    expect(bodies[1].expectedRevision).toBe(3);
  });

  it('원문이나 초기화 회차가 바뀌면 이전 화면의 위치 저장을 차단한다', async () => {
    const transport = vi.fn(async (path: string) =>
      path.endsWith('/actions')
        ? Response.json({ error: '버전 변경' }, { status: 409 })
        : Response.json(lesson('version-2', 0))
    );

    const recorder = createWatchPositionRecorder(
      'video',
      { watchVersion: 'version-1', watchRevision: 0 },
      transport
    );

    await expect(recorder.record(10, 'script')).rejects.toThrow('다른 창');
    await expect(recorder.resume()).rejects.toThrow('원문 또는 학습 회차');

    expect(
      transport.mock.calls.filter(([path]) => path.endsWith('/actions'))
    ).toHaveLength(1);
  });
});
