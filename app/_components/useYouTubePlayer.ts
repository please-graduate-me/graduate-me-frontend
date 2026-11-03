'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { reachedEnd, rewindTarget } from '@/domains/videos/lib/playback';
import type { LearningSettings } from '@/domains/users/model/settings';
import { createReplayScheduler } from '@/domains/videos/lib/replayScheduler';

import { loadAPI, type Player } from '@/lib/youtube/player';

/** 외부 플레이어의 수명 주기와 구절 재생을 화면 상태에서 분리한다. */
export function useYouTubePlayer(
  youtubeId: string,
  segment: { id: string; start: number; end: number } | undefined,
  settings: LearningSettings
) {
  const container = useRef<HTMLDivElement>(null);
  const player = useRef<Player | null>(null);
  const bounds = useRef(segment);

  useEffect(() => {
    bounds.current = segment;
  }, [segment]);

  const engaged = useRef(false);
  const settingsRef = useRef(settings);
  const manuallyPaused = useRef(false);
  const [waiting, setWaiting] = useState(false);
  const [scheduler] = useState(() => createReplayScheduler(setWaiting));

  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  const pendingSeek = useRef<{ target: number; at: number } | null>(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [error, setError] = useState('');
  const [blocked, setBlocked] = useState(false);
  const [availableRates, setAvailableRates] = useState<number[]>([1]);
  const [actualRate, setActualRate] = useState(1);

  const seek = useCallback(
    (target: number, play: boolean, manual = true) => {
      if (manual) scheduler.reset();
      else scheduler.cancel();
      manuallyPaused.current = !play;
      const p = player.current;

      if (!p || typeof p.seekTo !== 'function') return;
      pendingSeek.current = { target, at: Date.now() };
      p.seekTo(target, true);
      if (play) {
        engaged.current = true;
        setBlocked(false);
        p.playVideo();
      } else p.pauseVideo();
    },
    [scheduler]
  );

  const scheduleReplay = useCallback(
    (initial = false) => {
      const range = bounds.current;
      const options = settingsRef.current;

      if (!options.autoReplay || !range || manuallyPaused.current) return;

      scheduler.schedule(
        () => {
          // 예약 중 이동한 구절을 이전 구절의 예약으로 재생하지 않는다.
          if (
            settingsRef.current.autoReplay &&
            bounds.current?.id === range.id &&
            !manuallyPaused.current
          )
            seek(range.start, true, false);
        },
        options.replayDelay,
        options.replayCount,
        !initial
      );
    },
    [scheduler, seek]
  );

  useEffect(() => {
    let disposed = false;
    const containerElement = container.current;

    loadAPI()
      .then((api) => {
        if (disposed || !containerElement) return;
        const mount = document.createElement('div');

        containerElement.appendChild(mount);

        player.current = new api.Player(mount, {
          videoId: youtubeId,
          width: '100%',
          height: '100%',
          playerVars: {
            playsinline: 1,
            controls: 1,
            rel: 0,
            cc_load_policy: 0,
            origin: window.location.origin,
          },
          events: {
            onReady: () => {
              if (!disposed) {
                setAvailableRates(
                  player.current?.getAvailablePlaybackRates() ?? [1]
                );

                setActualRate(player.current?.getPlaybackRate() ?? 1);
                setReady(true);
              }
            },
            onStateChange: (event: { data: number }) => {
              if (!disposed) {
                setPlaying(event.data === 1);
                setBuffering(event.data === 3);

                if (event.data === 1) {
                  scheduler.cancel();
                  engaged.current = true;
                  manuallyPaused.current = false;
                  setBlocked(false);
                }

                if (event.data === 0) scheduleReplay();
              }
            },
            onPlaybackRateChange: (event: { data: number }) => {
              if (!disposed) setActualRate(event.data);
            },
            onAutoplayBlocked: () => {
              if (!disposed) {
                scheduler.cancel();
                setBlocked(true);
              }
            },
            onError: (event: { data: number }) => {
              scheduler.cancel();
              if (!disposed)
                setError(
                  [101, 150].includes(event.data)
                    ? '이 영상은 외부 사이트에서 재생할 수 없습니다. 다른 영상을 선택해 주세요.'
                    : '영상을 재생하지 못했습니다. 삭제 또는 접근 제한 여부를 확인해 주세요.'
                );
            },
          },
        });
      })
      .catch((error) => {
        if (!disposed) setError(error.message);
      });

    const interval = setInterval(() => {
      const p = player.current,
        range = bounds.current;

      if (!p || !range || typeof p.getCurrentTime !== 'function') return;
      const current = p.getCurrentTime();
      const pending = pendingSeek.current;

      // 탐색 직후의 이전 재생 시각으로 구절 종료를 오판하지 않는다.
      if (pending) {
        if (Math.abs(current - pending.target) <= 0.75)
          pendingSeek.current = null;
        else if (Date.now() - pending.at < 4000) return;
        else {
          pendingSeek.current = null;
          scheduler.cancel();
          manuallyPaused.current = true;
          p.pauseVideo();
          setBlocked(true);

          return;
        }
      }

      if (p.getPlayerState() === 1 && reachedEnd(current, range.end)) {
        p.pauseVideo();
        scheduleReplay();
      }
    }, 50);

    return () => {
      // 화면을 떠난 뒤 도착한 SDK 응답이 새 플레이어를 만들지 않게 한다.
      disposed = true;
      clearInterval(interval);
      scheduler.cancel();
      player.current?.destroy();
      player.current = null;
      containerElement?.replaceChildren();
    };
  }, [youtubeId, scheduleReplay, scheduler]);

  useEffect(() => {
    if (!ready) return;
    scheduler.reset();
    if (segment) {
      // 첫 재생 전 탐색과 일시정지는 YouTube의 썸네일을 검은 화면으로 바꾼다.
      if (engaged.current) seek(segment.start, true);
      manuallyPaused.current = false;
      if (!engaged.current) scheduleReplay(true);
    } else player.current?.pauseVideo();

    return () => scheduler.cancel();
  }, [ready, segment, seek, scheduler, scheduleReplay]);

  useEffect(() => {
    scheduler.reset();

    if (ready && settings.autoReplay && bounds.current) {
      manuallyPaused.current = false;
      if (player.current?.getPlayerState() !== 1) scheduleReplay(true);
    }
  }, [
    ready,
    settings.autoReplay,
    settings.replayDelay,
    settings.replayCount,
    scheduleReplay,
    scheduler,
  ]);

  useEffect(() => {
    if (ready)
      player.current?.setPlaybackRate(
        availableRates.includes(settings.playbackRate)
          ? settings.playbackRate
          : 1
      );
  }, [ready, settings.playbackRate, availableRates]);

  const replay = useCallback(() => {
    if (bounds.current) seek(bounds.current.start, true);
  }, [seek]);

  const pause = useCallback(() => {
    manuallyPaused.current = true;
    scheduler.cancel();
    player.current?.pauseVideo?.();
  }, [scheduler]);

  const resetPlayback = useCallback(
    (start: number) => {
      engaged.current = false;
      seek(start, false);
    },
    [seek]
  );

  const prepareNext = useCallback(() => {
    scheduler.cancel();
    engaged.current = true;
    player.current?.pauseVideo();
  }, [scheduler]);

  const toggle = useCallback(() => {
    const p = player.current,
      range = bounds.current;

    if (!p || !range) return;

    if (p.getPlayerState() === 1 || scheduler.waiting) {
      manuallyPaused.current = true;
      scheduler.cancel();
      p.pauseVideo();
    } else if (
      p.getCurrentTime() < range.start ||
      p.getCurrentTime() >= range.end
    )
      seek(range.start, true);
    else {
      manuallyPaused.current = false;
      scheduler.reset();
      engaged.current = true;
      setBlocked(false);
      p.playVideo();
    }
  }, [seek, scheduler]);

  const rewind = useCallback(() => {
    const p = player.current,
      range = bounds.current;

    if (p && range)
      seek(rewindTarget(p.getCurrentTime(), range.start, range.end), true);
  }, [seek]);

  const mount = useCallback((element: HTMLDivElement | null) => {
    container.current = element;
  }, []);

  return {
    mount,
    ready,
    playing,
    buffering,
    waiting,
    availableRates,
    actualRate,
    error,
    blocked,
    replay,
    toggle,
    rewind,
    pause,
    resetPlayback,
    prepareNext,
  };
}
