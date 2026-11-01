"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { reachedEnd, rewindTarget } from "@/lib/playback";

type Player = {
  getCurrentTime(): number; getPlayerState(): number; seekTo(seconds: number, allowSeekAhead: boolean): void;
  playVideo(): void; pauseVideo(): void; destroy(): void;
};
type YouTubeAPI = { Player: new (element: HTMLElement, options: Record<string, unknown>) => Player };
declare global { interface Window { YT?: YouTubeAPI; onYouTubeIframeAPIReady?: () => void } }
let apiPromise: Promise<YouTubeAPI> | null = null;
function loadAPI() {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (apiPromise) return apiPromise;
  apiPromise = new Promise((resolve, reject) => {
    const timer = setTimeout(() => { apiPromise = null; reject(new Error("영상 플레이어를 불러오지 못했습니다. 페이지를 새로고침해 주세요.")); }, 15000);
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => { clearTimeout(timer); previous?.(); resolve(window.YT!); };
    if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const script = document.createElement("script"); script.src = "https://www.youtube.com/iframe_api";
      script.onerror = () => { clearTimeout(timer); apiPromise = null; script.remove(); reject(new Error("YouTube에 연결하지 못했습니다.")); };
      document.head.appendChild(script);
    }
  });
  return apiPromise;
}
export function useYouTubePlayer(youtubeId: string, segment?: { id: string; start: number; end: number }) {
  const container = useRef<HTMLDivElement>(null);
  const player = useRef<Player | null>(null);
  const bounds = useRef(segment);
  bounds.current = segment;
  const engaged = useRef(false);
  const pendingSeek = useRef<{ target: number; at: number } | null>(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const [blocked, setBlocked] = useState(false);
  const seek = useCallback((target: number, play: boolean) => {
    const p = player.current;
    if (!p) return;
    pendingSeek.current = { target, at: Date.now() };
    p.seekTo(target, true);
    if (play) { engaged.current = true; setBlocked(false); p.playVideo(); }
    else p.pauseVideo();
  }, []);
  useEffect(() => {
    let disposed = false;
    loadAPI().then(api => {
      if (disposed || !container.current) return;
      const mount = document.createElement("div"); container.current.appendChild(mount);
      player.current = new api.Player(mount, {
        videoId: youtubeId, width: "100%", height: "100%",
        playerVars: { playsinline: 1, controls: 1, rel: 0, cc_load_policy: 0, origin: window.location.origin },
        events: {
          onReady: () => { if (!disposed) setReady(true); },
          onStateChange: (event: { data: number }) => { if (!disposed) { setPlaying(event.data === 1); if (event.data === 1) { engaged.current = true; setBlocked(false); } } },
          onAutoplayBlocked: () => { if (!disposed) setBlocked(true); },
          onError: (event: { data: number }) => { if (!disposed) setError([101, 150].includes(event.data) ? "이 영상은 외부 사이트에서 재생할 수 없습니다. 다른 영상을 선택해 주세요." : "영상을 재생하지 못했습니다. 삭제 또는 접근 제한 여부를 확인해 주세요."); },
        },
      });
    }).catch(error => { if (!disposed) setError(error.message); });
    const interval = setInterval(() => {
      const p = player.current, range = bounds.current;
      if (!p || !range || typeof p.getCurrentTime !== "function") return;
      const current = p.getCurrentTime();
      const pending = pendingSeek.current;
      if (pending) {
        if (Math.abs(current - pending.target) <= 0.75) pendingSeek.current = null;
        else if (Date.now() - pending.at < 4000) return;
        else { pendingSeek.current = null; p.pauseVideo(); setBlocked(true); return; }
      }
      if (p.getPlayerState() === 1 && reachedEnd(current, range.end)) p.pauseVideo();
    }, 50);
    return () => { disposed = true; clearInterval(interval); player.current?.destroy(); player.current = null; container.current?.replaceChildren(); };
  }, [youtubeId]);
  useEffect(() => {
    if (!ready) return;
    if (segment) seek(segment.start, engaged.current);
    else player.current?.pauseVideo();
  }, [ready, segment?.id, segment?.start, seek]);
  const replay = useCallback(() => { if (bounds.current) seek(bounds.current.start, true); }, [seek]);
  const pause = useCallback(() => player.current?.pauseVideo(), []);
  const prepareNext = useCallback(() => { engaged.current = true; player.current?.pauseVideo(); }, []);
  const toggle = useCallback(() => {
    const p = player.current, range = bounds.current;
    if (!p || !range) return;
    if (p.getPlayerState() === 1) p.pauseVideo();
    else if (p.getCurrentTime() < range.start || p.getCurrentTime() >= range.end) seek(range.start, true);
    else { engaged.current = true; setBlocked(false); p.playVideo(); }
  }, [seek]);
  const rewind = useCallback(() => {
    const p = player.current, range = bounds.current;
    if (p && range) seek(rewindTarget(p.getCurrentTime(), range.start, range.end), true);
  }, [seek]);
  return { container, ready, playing, error, blocked, replay, toggle, rewind, pause, prepareNext };
}
