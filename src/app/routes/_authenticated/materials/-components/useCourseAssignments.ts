import { useEffect, useState } from 'react';
import { listMyAssignments } from '@/domains/courses/api/courses';
import type { MyAssignments } from '@/domains/courses/model/contracts';

/** 수강 중인 수업의 과제 요약과 수업별 학습 언어, 조회 시각을 불러오며 보조 정보라 실패하면 빈 목록으로 둔다. */
export function useCourseAssignments() {
  const [state, setState] = useState<{
    items: MyAssignments['items'];
    languages: Record<string, 'en' | 'th'>;
    loadedAt: number;
  }>({ items: [], languages: {}, loadedAt: 0 });

  useEffect(() => {
    let active = true;

    void (async () => {
      let items: MyAssignments['items'] = [];

      try {
        items = (await listMyAssignments()).items;
      } catch {
        items = [];
      }

      if (!active) return;

      // 마감 표지가 렌더링마다 흔들리지 않게 조회 시각 하나로 남은 날을 센다.
      setState({
        items,
        languages: Object.fromEntries(
          items.map((item) => [item.courseId, item.courseLanguage])
        ),
        loadedAt: Date.now(),
      });
    })();

    return () => {
      active = false;
    };
  }, []);

  return state;
}
