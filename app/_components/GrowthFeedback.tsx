'use client';
import { useEffect, useRef, useState } from 'react';
import { rewardEventName } from '@/domains/growth/lib/rewardEvents';
import { rewardReaction } from '@/domains/growth/lib/rewardReaction';
import { BooMascot } from '@/domains/growth/ui/BooMascot';
import {
  rewardReceiptSchema,
  type RewardReceipt,
} from '@/domains/growth/model/contracts';
import * as styles from './GrowthFeedback.css';

/** 보상 저장과 독립된 짧은 축하로 다음 문제 입력을 방해하지 않는다. */
export function GrowthFeedback() {
  const [receipts, setReceipts] = useState<RewardReceipt[]>([]);
  const seen = useRef(new Set<string>());
  const receipt = receipts[0];

  useEffect(() => {
    function receive(event: Event) {
      const result = rewardReceiptSchema.safeParse(
        (event as CustomEvent<unknown>).detail
      );

      if (!result.success || seen.current.has(result.data.id)) return;
      seen.current.add(result.data.id);
      setReceipts((previous) => [...previous, result.data]);
    }

    window.addEventListener(rewardEventName, receive);

    return () => window.removeEventListener(rewardEventName, receive);
  }, []);

  useEffect(() => {
    if (!receipt) return;

    const timer = window.setTimeout(
      () => setReceipts((previous) => previous.slice(1)),
      4500
    );

    return () => window.clearTimeout(timer);
  }, [receipt]);

  if (!receipt) return null;
  const levelUp = receipt.level > receipt.previousLevel;

  return (
    <aside
      key={receipt.id}
      className={styles.toast}
      aria-label='학습 보상'>
      <BooMascot
        reaction={rewardReaction(receipt)}
        eventId={receipt.id}
        size={80}
      />
      <div
        role='status'
        aria-live='polite'
        aria-atomic='true'>
        <strong>
          {levelUp
            ? `레벨 ${receipt.level}로 성장했어요!`
            : receipt.dailyBonus
              ? '오늘의 학습 목표를 달성했어요!'
              : '한 걸음 더 성장했어요'}
        </strong>
        <p className={styles.xp}>+{receipt.xp + receipt.dailyBonus} XP</p>
        <small>
          {receipt.dailyBonus
            ? `목표 보너스 ${receipt.dailyBonus} XP 포함 · `
            : ''}
          누적 {receipt.totalXp} XP
        </small>
      </div>
      <button
        className={styles.close}
        type='button'
        aria-label='보상 알림 닫기'
        onClick={() => setReceipts((previous) => previous.slice(1))}>
        ×
      </button>
    </aside>
  );
}
