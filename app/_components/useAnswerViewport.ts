import { useEffect, useRef } from 'react';

/** 모바일 키보드가 열려도 답안과 확인 버튼을 같은 가시 영역으로 이동한다. */
export function useAnswerViewport(focused: boolean) {
  const form = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!focused || !window.matchMedia('(max-width: 900px)').matches) return;
    let frame = 0;

    function align() {
      if (!form.current?.contains(document.activeElement)) return;
      cancelAnimationFrame(frame);

      frame = requestAnimationFrame(() =>
        form.current?.scrollIntoView({ block: 'center' })
      );
    }

    align();
    window.visualViewport?.addEventListener('resize', align);

    return () => {
      cancelAnimationFrame(frame);
      window.visualViewport?.removeEventListener('resize', align);
    };
  }, [focused]);

  return form;
}
