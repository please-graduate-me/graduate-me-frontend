'use client';
import { useEffect, useRef, useState } from 'react';
import { Fit, Layout, RuntimeLoader, useRive } from '@rive-app/react-canvas';
import type { BooReaction } from '@/domains/growth/model/mascot';
import { BooStill } from './BooStill';
import * as styles from './AnimatedBoo.css';

// 배포한 런타임과 같은 버전의 WASM만 사용해 외부 CDN 의존을 없앤다.
RuntimeLoader.setWasmUrl('/rive/2.50.0/rive.wasm');
RuntimeLoader.setWasmFallbackUrl('/rive/2.50.0/rive_fallback.wasm');

/** 상태 머신이 동작과 복귀를 담당하고 같은 보상은 다시 재생하지 않는다. */
export default function AnimatedBoo({
  reaction,
  eventId,
}: {
  reaction: BooReaction;
  eventId?: string;
}) {
  const [failed, setFailed] = useState(false);
  const lastEvent = useRef<string | null>(null);

  const { rive, RiveComponent } = useRive({
    src: '/characters/boo/boo.riv',
    artboard: 'Boo',
    stateMachine: 'BooController',
    autoBind: true,
    autoplay: true,
    layout: new Layout({ fit: Fit.Contain }),
    onLoadError: () => setFailed(true),
  });

  useEffect(() => {
    if (!rive || failed || reaction === 'idle' || !eventId) return;

    const key = `${reaction}:${eventId}`;
    const trigger = rive.viewModelInstance?.trigger(reaction);

    if (!trigger || lastEvent.current === key) return;
    trigger.trigger();
    lastEvent.current = key;
  }, [rive, failed, reaction, eventId]);

  const ready = rive !== null && !failed;

  return (
    <span aria-hidden='true'>
      {!ready && <BooStill />}
      <RiveComponent
        className={styles.canvas}
        style={{ visibility: ready ? 'visible' : 'hidden' }}
      />
    </span>
  );
}
