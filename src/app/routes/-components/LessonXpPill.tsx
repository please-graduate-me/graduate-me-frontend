import { useEffect, useState } from 'react';
import { Icon } from '@/components/ui/primitives/Icon';
import { VisuallyHidden } from '@/components/ui/primitives/VisuallyHidden';
import { getGrowth } from '@/domains/growth/api/growth';
import { rewardEventName } from '@/domains/growth/lib/rewardEvents';
import { rewardReceiptSchema } from '@/domains/growth/model/contracts';
import * as styles from './LessonXpPill.css';

const numberFormat = new Intl.NumberFormat('ko-KR');

/** 레슨 상단에 누적 XP를 보여 주고 정답 보상이 지급되면 영수증의 누적값으로 바로 갱신한다. */
export function LessonXpPill() {
  const [totalXp, setTotalXp] = useState<number | null>(null);

  useEffect(() => {
    let active = true;

    void getGrowth()
      .then((value) => {
        if (active) setTotalXp(value.totalXp);
      })
      // 누적 XP는 보조 정보라 조회에 실패해도 학습을 막지 않고 숨긴다.
      .catch(() => undefined);

    function receive(event: Event) {
      const result = rewardReceiptSchema.safeParse(
        (event as CustomEvent<unknown>).detail
      );

      if (result.success) setTotalXp(result.data.totalXp);
    }

    window.addEventListener(rewardEventName, receive);

    return () => {
      active = false;
      window.removeEventListener(rewardEventName, receive);
    };
  }, []);

  if (totalXp === null) return null;

  return (
    <span className={styles.root}>
      <Icon
        name='zap'
        size={16}
        className={styles.icon}
      />
      <VisuallyHidden>누적 </VisuallyHidden>
      {numberFormat.format(totalXp)}
      <VisuallyHidden> XP</VisuallyHidden>
    </span>
  );
}
