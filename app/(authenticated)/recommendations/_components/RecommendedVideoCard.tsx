'use client';
import { useEffect, useRef } from 'react';
import { recordRecommendationEvent } from '@/domains/recommendations/api/recommendations';
import type { Recommendations } from '@/domains/recommendations/model/contracts';
import { Button } from '@/components/ui/primitives/Button';
import { ButtonLink } from '@/components/ui/primitives/ButtonLink';
import { Badge } from '@/components/ui/primitives/Badge';
import * as styles from '@/lib/styles/workspace.css';

/** 화면에 실제 들어온 추천만 기록하고 집계 실패가 학습 선택을 막지 않게 한다. */
export function RecommendedVideoCard({
  item,
  busy,
  onDismiss,
}: {
  item: Recommendations['items'][number];
  busy: boolean;
  onDismiss: () => void;
}) {
  const ref = useRef<HTMLElement>(null);
  const shown = useRef<string | null>(null);
  const selected = useRef<string | null>(null);

  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    // 목록에 포함된 것과 실제로 화면에 들어온 노출을 구분한다.
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        shown.current ??= crypto.randomUUID();

        void recordRecommendationEvent(item.id, shown.current, 'shown')
          .then(() => observer.disconnect())
          .catch(() => undefined);
      },
      { threshold: 0.1 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [item.id]);

  return (
    <article
      ref={ref}
      className={styles.message}>
      <h2>{item.title}</h2>
      <div className={styles.row}>
        <Badge tone='brand'>{item.language === 'en' ? '영어' : '태국어'}</Badge>
        <span className={styles.meta}>
          {item.duration === null
            ? '길이 미확인'
            : `${Math.floor(item.duration / 60)}분 ${Math.floor(item.duration % 60)}초`}{' '}
          · {item.category || '주제 미분석'} · {item.difficulty}
        </span>
      </div>
      <p>추천 이유: {item.reason}</p>
      <p className={styles.meta}>
        난이도는 확보된 문장 길이 등의 단서를 참고한 추정이며 공인 수준 판정이
        아닙니다.
      </p>
      <div className={styles.row}>
        <ButtonLink
          href={`/learn/${encodeURIComponent(item.id)}`}
          onClick={() => {
            selected.current ??= crypto.randomUUID();

            void recordRecommendationEvent(
              item.id,
              selected.current,
              'selected'
            ).catch(() => undefined);
          }}>
          이 영상 학습하기
        </ButtonLink>
        <Button
          variant='ghost'
          disabled={busy}
          onClick={onDismiss}>
          관심 없음
        </Button>
      </div>
    </article>
  );
}
