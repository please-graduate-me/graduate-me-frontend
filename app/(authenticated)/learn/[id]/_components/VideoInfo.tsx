'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/primitives/Button';
import { setVideoLike, setVideoFavorite } from '@/domains/videos/api/videos';
import type { Lesson } from '@/domains/videos/model/contracts';
import * as styles from './VideoInfo.css';

/** 학습 진도와 독립된 영상 정보와 서비스 내 좋아요를 표시한다. */
export function VideoInfo({
  video,
  initialFavorite,
}: {
  video: Lesson['video'];
  initialFavorite: boolean;
}) {
  const [favorite, setFavorite] = useState(initialFavorite);
  const [reaction, setReaction] = useState({
    liked: video.liked,
    likeCount: video.likeCount,
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function toggleFavorite() {
    setBusy(true);
    setError('');
    try {
      await setVideoFavorite(video.id, !favorite);
      setFavorite(!favorite);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function toggleLike() {
    setBusy(true);
    setError('');
    try {
      setReaction(await setVideoLike(video.id, !reaction.liked));
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className={styles.container}>
      <p className={styles.description}>
        YouTube 카테고리: {video.category ?? '미분류'}
      </p>
      <p className={styles.description}>
        음성 받은 시각:{' '}
        {video.downloadedAt ? (
          <time dateTime={video.downloadedAt}>
            {new Intl.DateTimeFormat('ko-KR', {
              dateStyle: 'medium',
              timeStyle: 'short',
              timeZone: 'Asia/Seoul',
            }).format(new Date(video.downloadedAt))}{' '}
            (한국 시간)
          </time>
        ) : (
          '기록 없음'
        )}
      </p>
      <Button
        variant='secondary'
        aria-pressed={reaction.liked}
        disabled={busy}
        onClick={() => void toggleLike()}>
        {reaction.liked ? '좋아요 취소' : '좋아요'} · {reaction.likeCount}
      </Button>
      <p className={styles.description}>
        이 서비스에서 학습에 도움이 된 영상에 좋아요를 남겨 주세요.
      </p>
      <Button
        variant='secondary'
        aria-pressed={favorite}
        disabled={busy}
        onClick={() => void toggleFavorite()}>
        {favorite ? '관심 영상 해제' : '관심 영상으로 표시'}
      </Button>
      <p className={styles.description}>
        관심 영상 표시는 내 목록에서만 사용합니다.
      </p>
      {error && <p role='alert'>{error}</p>}
    </div>
  );
}
