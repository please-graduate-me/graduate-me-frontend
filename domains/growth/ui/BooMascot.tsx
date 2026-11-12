'use client';
import { lazy, Suspense, useSyncExternalStore } from 'react';
import type { BooReaction } from '@/domains/growth/model/mascot';
import { BooStill } from './BooStill';
import * as styles from './BooMascot.css';

const AnimatedBoo = lazy(() => import('./AnimatedBoo'));
const motionQuery = '(prefers-reduced-motion: reduce)';

function subscribe(listener: () => void) {
  const media = window.matchMedia(motionQuery);

  media.addEventListener('change', listener);

  return () => media.removeEventListener('change', listener);
}

function reducedMotion() {
  return window.matchMedia(motionQuery).matches;
}

function serverSnapshot() {
  return true;
}

/** 사용처는 반응과 사건만 전달하고 모션 축소 환경에서는 런타임을 생략한다. */
export function BooMascot({
  reaction = 'idle',
  eventId,
  size = 128,
}: {
  reaction?: BooReaction;
  eventId?: string;
  size?: number;
}) {
  const reduced = useSyncExternalStore(
    subscribe,
    reducedMotion,
    serverSnapshot
  );

  return (
    <span
      className={styles.frame}
      style={{ width: size, height: size }}
      role='img'
      aria-label='함께 학습하는 한국외국어대학교 캐릭터 부'>
      {reduced ? (
        <BooStill />
      ) : (
        <Suspense fallback={<BooStill />}>
          <AnimatedBoo
            reaction={reaction}
            eventId={eventId}
          />
        </Suspense>
      )}
    </span>
  );
}
