'use client';
import { Link } from '@astryxdesign/core/Link';
import type { VideoHistory } from '@/domains/videos/model/contracts';
import { formatDate } from '@/domains/learning/lib/format';
import { Badge } from '@/components/ui/primitives/Badge';
import { Icon } from '@/components/ui/primitives/Icon';
import { MaterialTile } from './MaterialTile';

/** 등록한 영상의 정답 진도와 준비 상태를 타일로 보여 준다. */
export function VideoTile({ video }: { video: VideoHistory[number] }) {
  const href = `/learn/${encodeURIComponent(video.videoId)}`;
  const completed = Math.min(video.completedCount ?? 0, video.count);
  const ratio = video.count > 0 ? (completed / video.count) * 100 : 0;

  // 모든 구절을 통과하기 전에는 반올림으로 100%처럼 보이지 않게 99에서 멈춘다.
  const progress = video.isComplete
    ? Math.floor(ratio)
    : Math.min(99, Math.floor(ratio));

  return (
    <MaterialTile
      kind='video'
      href={href}
      title={video.title}
      progress={progress}
      progressLabel={video.title + ' 정답 진도'}
      complete={video.isComplete}
      details={
        <>
          <span>
            {video.language === 'th' ? '태국어' : '영어'} · 영상 · 정답 구절{' '}
            {video.completedCount ?? 0} / {video.count}
          </span>
          <span>
            {video.isComplete
              ? '모든 학습 구절 정답 통과'
              : '저장한 위치에서 이어 학습'}
          </span>
        </>
      }
      status={
        <>
          <Badge
            tone={
              video.status === 'ready'
                ? 'success'
                : video.status === 'failed'
                  ? 'error'
                  : 'warning'
            }>
            {video.status === 'ready'
              ? '학습 가능'
              : video.status === 'failed'
                ? '분석 실패'
                : '자료 준비 중'}
          </Badge>
          <time>{formatDate(video.updatedAt)}</time>
        </>
      }
      action={
        <Link
          href={href}
          aria-label={`${video.title} 열기`}>
          <Icon
            name='arrow-up-right'
            size={18}
          />
        </Link>
      }
    />
  );
}
