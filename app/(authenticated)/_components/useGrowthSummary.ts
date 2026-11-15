'use client';
import { useEffect, useState } from 'react';
import { getGrowth } from '@/domains/growth/api/growth';
import { rewardEventName } from '@/domains/growth/lib/rewardEvents';
import type { GrowthSummary } from '@/domains/growth/model/contracts';

/** 헤더 수치와 예상 XP 표시에 쓸 성장 현황을 읽고 보상 지급 직후 다시 읽으며 보조 정보라 실패하면 null로 둔다. */
export function useGrowthSummary() {
  const [value, setValue] = useState<GrowthSummary | null>(null);

  useEffect(() => {
    let active = true;
    let serial = 0;

    async function refresh() {
      const request = ++serial;

      try {
        const data = await getGrowth();

        if (active && request === serial) setValue(data);
      } catch {
        if (active && request === serial) setValue(null);
      }
    }

    void refresh();
    window.addEventListener(rewardEventName, refresh);

    return () => {
      active = false;
      window.removeEventListener(rewardEventName, refresh);
    };
  }, []);

  return value;
}
