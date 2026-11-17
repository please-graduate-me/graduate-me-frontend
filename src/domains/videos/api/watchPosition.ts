import { z } from 'zod';
import {
  ApiError,
  browserTransport,
  jsonBody,
  request,
  type Transport,
} from '@/lib/api/request';
import { getLesson } from './videos';

const watchResultSchema = z.object({
  ok: z.literal(true),
  watchRevision: z.number().int().nonnegative(),
  playbackPosition: z.number(),
  scriptPosition: z.number(),
  scriptMaxPosition: z.number(),
});

type Snapshot = {
  watchVersion?: string;
  watchRevision?: number;
  playbackPosition?: number;
  scriptPosition?: number;
  scriptMaxPosition?: number;
  watchMode?: 'dictation' | 'script';
};
type PositionAction = {
  action: 'watchPosition';
  position: number;
  watchMode: 'dictation' | 'script';
  watchVersion: string;
  expectedRevision: number;
  requestId: string;
};

/** 재생 위치 저장을 직렬화하고 응답 유실·다중 창·원문 버전 충돌을 구분한다. */
export function createWatchPositionRecorder(
  videoId: string,
  initial: Snapshot,
  transport: Transport = browserTransport
) {
  let identity = {
    version: initial.watchVersion,
    revision: initial.watchRevision ?? 0,
  };

  let sourceVersion = identity.version;

  let positions = {
    playbackPosition: initial.playbackPosition ?? 0,
    scriptPosition: initial.scriptPosition ?? 0,
    scriptMaxPosition: initial.scriptMaxPosition ?? 0,
  };

  let lastMode = initial.watchMode;
  let pending: PositionAction | null = null;
  let blocked = false;
  let queue: Promise<unknown> = Promise.resolve();

  async function refresh(allowNewSource = false) {
    const lesson = await getLesson(videoId, transport);
    const progress = lesson.progress;

    // 초기화·원문 변경을 다른 기기의 단순 저장 경합으로 오인해 덮어쓰지 않는다.
    if (!allowNewSource && sourceVersion !== progress.watchVersion)
      throw new Error(
        '원문 또는 학습 회차가 변경되었습니다. 작성 중인 답안을 보존한 뒤 자료를 다시 열어 주세요.'
      );
    sourceVersion = progress.watchVersion;

    identity = {
      version: progress.watchVersion,
      revision: progress.watchRevision ?? 0,
    };

    positions = {
      playbackPosition: progress.playbackPosition ?? 0,
      scriptPosition: progress.scriptPosition ?? 0,
      scriptMaxPosition: progress.scriptMaxPosition ?? 0,
    };

    pending = null;
    blocked = false;
    lastMode = progress.watchMode;

    return positions;
  }

  async function send(keepalive: boolean) {
    if (!pending) return;

    try {
      const result = await request(
        `/api/videos/${encodeURIComponent(videoId)}/actions`,
        watchResultSchema,
        { ...jsonBody(pending), keepalive },
        transport
      );

      identity.revision = result.watchRevision;
      positions = result;
      lastMode = pending.watchMode;
      pending = null;
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        blocked = true;
        const lesson = await getLesson(videoId, transport);

        identity = {
          version: lesson.progress.watchVersion,
          revision: lesson.progress.watchRevision ?? 0,
        };

        pending = null;
        throw new Error(
          '다른 창의 저장 또는 원문 변경을 감지했습니다. 저장 위치를 다시 확인한 뒤 이 위치 저장을 선택해 주세요.'
        );
      }

      throw error;
    }
  }

  return {
    get positions() {
      return positions;
    },
    record(
      position: number,
      watchMode: 'dictation' | 'script',
      keepalive = false
    ) {
      const task = queue
        .catch(() => undefined)
        .then(async () => {
          if (!identity.version || !Number.isFinite(position)) return;
          if (blocked)
            throw new Error(
              '저장 위치 충돌을 먼저 확인해 주세요. 작성 중인 답안은 유지됩니다.'
            );
          // 응답이 유실된 요청을 먼저 같은 식별자로 확인한 뒤 다음 위치를 보낸다.
          if (pending) await send(keepalive);
          if (
            lastMode === watchMode &&
            positions[
              watchMode === 'script' ? 'scriptPosition' : 'playbackPosition'
            ] === position
          )
            return;

          pending = {
            action: 'watchPosition',
            position,
            watchMode,
            watchVersion: identity.version,
            expectedRevision: identity.revision,
            requestId: crypto.randomUUID(),
          };

          await send(keepalive);
        });

      queue = task;

      return task;
    },
    async resume() {
      await queue.catch(() => undefined);

      return refresh();
    },
    async restart() {
      await queue.catch(() => undefined);

      return refresh(true);
    },
  };
}
