'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { MaterialSummary } from '@/domains/materials/model/contracts';
import type { VideoHistory } from '@/domains/videos/model/contracts';
import { videoPaths } from '@/domains/videos/config/paths';
import { materialPaths } from '@/domains/materials/config/paths';
import { Badge } from '@/components/ui/primitives/Badge';
import { Icon } from '@/components/ui/primitives/Icon';
import { ButtonLink } from '@/components/ui/primitives/ButtonLink';
import * as styles from './ResumeCard.css';

/** 최근에 읽거나 들은 실제 자료의 진행 위치로 돌아가게 한다. */
export function ResumeCard({
  item,
}: {
  item: MaterialSummary | VideoHistory[number];
}) {
  const video = 'videoId' in item;
  const [thumbnailFailed, setThumbnailFailed] = useState(false);

  const current = video
    ? Math.min(item.completedCount ?? 0, item.count)
    : item.currentPage;

  const total = video ? item.count : item.pageCount;

  const href = video
    ? videoPaths.lesson(item.videoId)
    : materialPaths.detail(item.id, item.currentPage);

  const progress = total > 0 ? Math.min(100, (current / total) * 100) : 0;

  const shownProgress =
    video && !item.isComplete
      ? Math.min(99, Math.floor(progress))
      : Math.floor(progress);

  return (
    <article className={styles.root}>
      <div className={styles.row}>
        <Link
          href={href}
          className={styles.cover}
          data-kind={video ? 'video' : 'pdf'}
          tabIndex={-1}
          aria-hidden='true'>
          {video && item.youtubeId && !thumbnailFailed ? (
            <Image
              unoptimized
              src={`https://i.ytimg.com/vi/${encodeURIComponent(item.youtubeId)}/hqdefault.jpg`}
              alt=''
              width={100}
              height={142}
              className={styles.thumbnail}
              onError={() => setThumbnailFailed(true)}
            />
          ) : video ? (
            <Icon
              name='play'
              size={32}
            />
          ) : (
            <>
              <small>
                {item.language === 'th' ? '태국어 읽기' : '영어 읽기'}
              </small>
              <strong>{String(current).padStart(2, '0')}</strong>
              <span>{item.filename}</span>
            </>
          )}
        </Link>
        <div className={styles.information}>
          <Badge tone='brand'>
            <Icon
              name={video ? 'play' : 'file-text'}
              size={14}
            />
            {video
              ? '영상 · ' + (item.language === 'th' ? '태국어' : '영어')
              : 'PDF · ' + (item.language === 'th' ? '태국어' : '영어')}
          </Badge>
          <h3>
            <Link href={href}>{item.title}</Link>
          </h3>
          <p>
            {video
              ? '정답 구절 ' + current + ' / ' + total
              : current + '페이지에서 이어 읽기'}
          </p>
          <ButtonLink
            href={href}
            variant='secondary'>
            {video ? '계속 듣기' : '이어서 읽기'}
          </ButtonLink>
        </div>
      </div>
      <div
        className={styles.progress}
        role='progressbar'
        aria-label={item.title + (video ? ' 정답 진도' : ' 읽기 위치')}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={shownProgress}>
        <span style={{ width: shownProgress + '%' }} />
      </div>
    </article>
  );
}
