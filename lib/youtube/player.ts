/** 외부 SDK 전체 대신 재생에 필요한 기능만 의존한다. */
export type Player = {
  getCurrentTime(): number;
  getPlayerState(): number;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  playVideo(): void;
  pauseVideo(): void;
  destroy(): void;
};
type YouTubeAPI = {
  Player: new (
    element: HTMLElement,
    options: Record<string, unknown>
  ) => Player;
};
declare global {
  interface Window {
    YT?: YouTubeAPI;
    onYouTubeIframeAPIReady?: () => void;
  }
}
let apiPromise: Promise<YouTubeAPI> | null = null;
/** 여러 호출이 동일한 SDK 로딩 작업을 공유하게 한다. */
export function loadAPI() {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  // Strict Mode 재실행과 여러 플레이어가 스크립트를 중복 삽입하지 않게 한다.
  if (apiPromise) return apiPromise;
  apiPromise = new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      apiPromise = null;
      reject(
        new Error(
          '영상 플레이어를 불러오지 못했습니다. 페이지를 새로고침해 주세요.'
        )
      );
    }, 15000);
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      clearTimeout(timer);
      previous?.();
      resolve(window.YT!);
    };
    if (
      !document.querySelector(
        'script[src="https://www.youtube.com/iframe_api"]'
      )
    ) {
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.onerror = () => {
        clearTimeout(timer);
        apiPromise = null;
        script.remove();
        reject(new Error('YouTube에 연결하지 못했습니다.'));
      };
      document.head.appendChild(script);
    }
  });
  return apiPromise;
}
