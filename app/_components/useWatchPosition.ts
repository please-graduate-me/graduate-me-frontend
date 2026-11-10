'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiError } from '@/lib/api/request';
import type { Lesson } from '@/domains/videos/model/contracts';
import { createWatchPositionRecorder } from '@/domains/videos/api/watchPosition';

/** 재생 시각 저장은 답안 저장·정답 진도와 독립시키며 실패해도 입력을 유지한다. */
export function useWatchPosition(
  videoId: string,
  initial: Lesson['progress'],
  position: number,
  script: boolean,
  ready: boolean,
  playing: boolean,
  enabled: boolean
) {
  const [recorder] = useState(() =>
    createWatchPositionRecorder(videoId, initial)
  );

  const latest = useRef({ position, script, ready });
  const [error, setError] = useState('');
  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    latest.current = { position, script, ready };
  }, [position, script, ready]);

  const save = useCallback(
    async (
      keepalive = false,
      overridePosition?: number,
      overrideScript?: boolean
    ) => {
      const value = latest.current;

      if (!enabled || !value.ready) return;

      try {
        await recorder.record(
          overridePosition ?? value.position,
          (overrideScript ?? value.script) ? 'script' : 'dictation',
          keepalive
        );

        setError('');
        setSessionExpired(false);
      } catch (error) {
        setError((error as Error).message);
        setSessionExpired(error instanceof ApiError && error.status === 401);
      }
    },
    [enabled, recorder]
  );

  useEffect(() => {
    if (!enabled) return;
    const timer = setInterval(() => void save(), 5000);
    const pagehide = () => void save(true);

    const visibility = () => {
      if (document.visibilityState === 'hidden') void save(true);
    };

    window.addEventListener('pagehide', pagehide);
    document.addEventListener('visibilitychange', visibility);

    return () => {
      clearInterval(timer);
      window.removeEventListener('pagehide', pagehide);
      document.removeEventListener('visibilitychange', visibility);
    };
  }, [enabled, save]);

  useEffect(() => {
    if (!ready || playing) return;
    const timer = setTimeout(() => void save(), 0);

    return () => clearTimeout(timer);
  }, [ready, playing, save]);

  async function resume() {
    try {
      await recorder.resume();
      await save();
    } catch (error) {
      setError((error as Error).message);
      setSessionExpired(error instanceof ApiError && error.status === 401);
    }
  }

  async function restart() {
    try {
      await recorder.restart();
      setError('');
    } catch (error) {
      setError((error as Error).message);
      setSessionExpired(error instanceof ApiError && error.status === 401);
    }
  }

  return {
    save,
    resume,
    restart,
    error,
    sessionExpired,
    positions: recorder.positions,
  };
}
