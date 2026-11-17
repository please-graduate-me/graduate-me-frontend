import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';

const voices = { en: 'en-US', th: 'th-TH' } as const;

const subscribe = () => () => undefined;

/** 브라우저 음성 합성으로 선택 문장을 자료 언어로 읽어 주며 미지원 브라우저에서는 supported가 거짓이다. */
export function useSpeechSynthesis(language: keyof typeof voices) {
  // 서버 렌더링에는 음성 합성이 없어 첫 화면은 미지원으로 그리고 브라우저에서만 다시 판단한다.
  const supported = useSyncExternalStore(
    subscribe,
    () => 'speechSynthesis' in window,
    () => false
  );

  const [speaking, setSpeaking] = useState(false);

  useEffect(
    () => () => {
      if (supported) window.speechSynthesis.cancel();
    },
    [supported]
  );

  const stop = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, [supported]);

  const speak = useCallback(
    (text: string) => {
      if (!supported || !text.trim()) return;
      // 이전 문장이 대기열에 남아 겹쳐 읽히지 않도록 먼저 비운다.
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);

      utterance.lang = voices[language];
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);
      setSpeaking(true);
      window.speechSynthesis.speak(utterance);
    },
    [language, supported]
  );

  return { supported, speaking, speak, stop };
}
