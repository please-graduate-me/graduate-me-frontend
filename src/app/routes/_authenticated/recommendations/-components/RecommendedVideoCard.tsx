import { Card } from '@/components/ui/primitives/Card';
import { Heading } from '@/components/ui/primitives/Heading';
import { Text } from '@/components/ui/primitives/Text';
import { useEffect, useRef, useState } from 'react';
import { recordRecommendationEvent } from '@/domains/recommendations/api/recommendations';
import type { Recommendations } from '@/domains/recommendations/model/contracts';
import { Button } from '@/components/ui/primitives/Button';
import { ButtonLink } from '@/components/ui/primitives/ButtonLink';
import { Badge } from '@/components/ui/primitives/Badge';
import { Icon } from '@/components/ui/primitives/Icon';
import * as styles from './RecommendedVideoCard.css';

/** 초 단위 길이를 썸네일 위 m:ss 표기로 바꾼다. */
const clock = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;

/** 화면에 실제 들어온 추천만 기록하고 집계 실패가 학습 선택을 막지 않게 한다. */
export function RecommendedVideoCard({
  item,
  tone,
  busy,
  isDismissing,
  onDismiss,
}: {
  item: Recommendations['items'][number];
  tone: number;
  busy: boolean;
  isDismissing: boolean;
  onDismiss: () => void;
}) {
  const ref = useRef<HTMLElement>(null);
  const shown = useRef<string | null>(null);
  const selected = useRef<string | null>(null);
  const [thumbnailFailed, setThumbnailFailed] = useState(false);

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
    <Card
      ref={ref}
      as='article'
      className={styles.root}>
      <div
        aria-hidden='true'
        className={styles.thumb}
        data-tone={tone % 4}>
        <span className={styles.stripe} />
        <span className={styles.stripe} />
        <span className={styles.bubble} />
        {item.youtubeId && !thumbnailFailed && (
          <img
            loading='lazy'
            src={`https://i.ytimg.com/vi/${encodeURIComponent(item.youtubeId)}/hqdefault.jpg`}
            alt=''
            width={480}
            height={360}
            className={styles.image}
            onError={() => setThumbnailFailed(true)}
          />
        )}
        <span className={styles.play}>
          <Icon
            name='play'
            size={22}
          />
        </span>
        <span className={styles.clock}>
          {item.duration === null ? '--:--' : clock(item.duration)}
        </span>
      </div>
      <div className={styles.body}>
        <Heading
          level={3}
          className={styles.title}>
          {item.title}
        </Heading>
        <div className={styles.meta}>
          <Badge tone='review'>
            {item.language === 'en' ? '영어' : '태국어'}
          </Badge>
          <Text
            color='secondary'
            className={styles.metaText}>
            {item.duration === null
              ? '길이 미확인'
              : `${Math.floor(item.duration / 60)}분 ${Math.floor(item.duration % 60)}초`}{' '}
            · {item.category || '주제 미분석'} · {item.difficulty}
          </Text>
        </div>
        <Text
          as='p'
          display='block'
          className={styles.reason}>
          <strong className={styles.reasonLabel}>추천 이유</strong>{' '}
          {item.reason}
        </Text>
        <div className={styles.actions}>
          <ButtonLink
            href={`/learn/${encodeURIComponent(item.id)}`}
            className={styles.start}
            onClick={() => {
              selected.current ??= crypto.randomUUID();

              void recordRecommendationEvent(
                item.id,
                selected.current,
                'selected'
              ).catch(() => undefined);
            }}>
            <Icon
              name='play'
              size={14}
            />
            이 영상 학습하기
          </ButtonLink>
          <Button
            type='button'
            variant='ghost'
            loading={isDismissing}
            disabled={busy && !isDismissing}
            aria-label={`${item.title} 관심 없음`}
            onClick={onDismiss}>
            관심 없음
          </Button>
        </div>
      </div>
    </Card>
  );
}
