'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { reachedEnd, rewindTarget } from '@/domains/videos/lib/playback';

import { loadAPI, type Player } from '@/lib/youtube/player';
/** 외부 플레이어의 수명 주기와 구절 재생을 화면 상태에서 분리한다. */
export function useYouTubePlayer(
  youtubeId: string,
  segment?: { id: string; start: number; end: number }
) {
  const container = useRef<HTMLDivElement>(null);
  const player = useRef<Player | null>(null);
  const bounds = useRef(segment);
  useEffect(() => {
    bounds.current = segment;
  }, [segment]);
  const engaged = useRef(false);
  const pendingSeek = useRef<{ target: number; at: number } | null>(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState('');
  const [blocked, setBlocked] = useState(false);
  const seek = useCallback((target: number, play: boolean) => {
    const p = player.current;
    if (!p) return;
    pendingSeek.current = { target, at: Date.now() };
    p.seekTo(target, true);
    if (play) {
      engaged.current = true;
      setBlocked(false);
      p.playVideo();
    } else p.pauseVideo();
  }, []);
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
              if (!disposed) setReady(true);
            },
            onStateChange: (event: { data: number }) => {
              if (!disposed) {
                setPlaying(event.data === 1);
                if (event.data === 1) {
                  engaged.current = true;
                  setBlocked(false);
                }
              }
            },
            onAutoplayBlocked: () => {
              if (!disposed) setBlocked(true);
            },
            onError: (event: { data: number }) => {
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
          p.pauseVideo();
          setBlocked(true);
          return;
        }
      }
      if (p.getPlayerState() === 1 && reachedEnd(current, range.end))
        p.pauseVideo();
    }, 50);
    return () => {
      // 화면을 떠난 뒤 도착한 SDK 응답이 새 플레이어를 만들지 않게 한다.
      disposed = true;
      clearInterval(interval);
      player.current?.destroy();
      player.current = null;
      containerElement?.replaceChildren();
    };
  }, [youtubeId]);
  useEffect(() => {
    if (!ready) return;
    if (segment) seek(segment.start, engaged.current);
    else player.current?.pauseVideo();
  }, [ready, segment, seek]);
  const replay = useCallback(() => {
    if (bounds.current) seek(bounds.current.start, true);
  }, [seek]);
  const pause = useCallback(() => player.current?.pauseVideo(), []);
  const resetPlayback = useCallback(
    (start: number) => {
      engaged.current = false;
      seek(start, false);
    },
    [seek]
  );
  const prepareNext = useCallback(() => {
    engaged.current = true;
    player.current?.pauseVideo();
  }, []);
  const toggle = useCallback(() => {
    const p = player.current,
      range = bounds.current;
    if (!p || !range) return;
    if (p.getPlayerState() === 1) p.pauseVideo();
    else if (
      p.getCurrentTime() < range.start ||
      p.getCurrentTime() >= range.end
    )
      seek(range.start, true);
    else {
      engaged.current = true;
      setBlocked(false);
      p.playVideo();
    }
  }, [seek]);
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
