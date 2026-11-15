'use client';
import Image from 'next/image';
import { useState } from 'react';
import { Icon } from '@/components/ui/primitives/Icon';
import { MediaPlayButton } from '@/components/ui/primitives/MediaPlayButton';
import * as motion from '@/lib/styles/motion.css';
import * as styles from './SharedVideoPlayer.css';

/** 초 단위 위치를 플레이어 시간 표기 m:ss로 바꾼다. */
const clock = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;

/** 공유 구간을 진행 막대 위에 표시한 포스터를 먼저 보여 주고 재생을 누르면 실제 영상을 연다. */
export function SharedVideoPlayer({
  youtubeId,
  title,
  duration,
  segment,
  query,
}: {
  youtubeId: string;
  title: string;
  duration: number | null;
  segment: { start: number; end: number } | null;
  query: string;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [thumbnailFailed, setThumbnailFailed] = useState(false);
  // 전체 길이를 모르면 막대 위 위치를 계산할 수 없어 구간 강조와 전체 시간을 숨긴다.
  const hasDuration = duration !== null && duration > 0;

  if (isPlaying)
    return (
      <iframe
        className={styles.frame}
        src={`https://www.youtube.com/embed/${youtubeId}?${query}&autoplay=1`}
        title={title}
        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
        allowFullScreen
        referrerPolicy='strict-origin-when-cross-origin'
      />
    );

  const position = segment?.start ?? 0;

  const timeLabel = hasDuration
    ? `${clock(position)} / ${clock(duration)}`
    : segment
      ? clock(position)
      : null;

  return (
    <div className={styles.poster}>
      {!thumbnailFailed && (
        <Image
          unoptimized
          src={`https://i.ytimg.com/vi/${encodeURIComponent(youtubeId)}/hqdefault.jpg`}
          alt=''
          fill
          sizes='960px'
          className={styles.image}
          onError={() => setThumbnailFailed(true)}
        />
      )}
      <MediaPlayButton
        label={`${title} 재생`}
        className={styles.play}
        onClick={() => setIsPlaying(true)}
      />
      <div
        aria-hidden='true'
        className={styles.controls}>
        <Icon
          name='play'
          size={18}
        />
        <span className={styles.track}>
          {hasDuration && segment && (
            <span
              className={`${styles.segment} ${motion.glow}`}
              // 구간 위치는 영상마다 달라 실행 중 계산한 비율을 인라인으로 넘긴다.
              style={{
                left: `${(segment.start / duration) * 100}%`,
                width: `${Math.max(((segment.end - segment.start) / duration) * 100, 1)}%`,
              }}
            />
          )}
        </span>
        {timeLabel && <span className={styles.time}>{timeLabel}</span>}
      </div>
    </div>
  );
}
