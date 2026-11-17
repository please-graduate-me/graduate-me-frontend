import { DropdownMenu } from '@/components/ui/composites/DropdownMenu';
import type { VideoHistory } from '@/domains/videos/model/contracts';
import { formatDate } from '@/domains/learning/lib/format';
import { Icon } from '@/components/ui/primitives/Icon';
import { MaterialTile } from './MaterialTile';

/** 등록한 영상의 정답 진도를 타일로 보여 주고 준비 상태가 아니면 요약 줄에 알리며 관심·목록 제거 메뉴를 둔다. */
export function VideoTile({
  video,
  isLatest = false,
  busy,
  onFavorite,
  onRemove,
}: {
  video: VideoHistory[number];
  isLatest?: boolean;
  busy: boolean;
  onFavorite: () => void;
  onRemove: () => void;
}) {
  const href = `/learn/${encodeURIComponent(video.videoId)}`;
  const completed = Math.min(video.completedCount ?? 0, video.count);
  const ratio = video.count > 0 ? (completed / video.count) * 100 : 0;

  // 모든 구절을 통과하기 전에는 반올림으로 100%처럼 보이지 않게 99에서 멈춘다.
  const progress = video.isComplete
    ? Math.floor(ratio)
    : Math.min(99, Math.floor(ratio));

  const ready = video.status === 'ready';

  return (
    <MaterialTile
      kind='video'
      seed={video.videoId}
      href={href}
      title={video.title}
      progress={progress}
      progressLabel={video.title + ' 정답 진도'}
      caption={
        ready
          ? `구절 ${completed} / ${video.count}`
          : video.status === 'failed'
            ? '분석 실패'
            : '자료 준비 중'
      }
      captionTone={
        ready ? 'muted' : video.status === 'failed' ? 'error' : 'warning'
      }
      complete={video.isComplete ? 'ink' : undefined}
      pill={isLatest ? { label: '이어서', tone: 'accent' } : undefined}
      hint={[
        video.language === 'th' ? '태국어 영상' : '영어 영상',
        video.favorite ? '관심 영상' : '',
        `${formatDate(video.updatedAt)} 학습`,
      ]
        .filter(Boolean)
        .join(' · ')}
      action={
        <DropdownMenu
          button={{
            label: video.title + ' 관리',
            variant: 'ghost',
            size: 'sm',
            isIconOnly: true,
            icon: (
              <Icon
                name='ellipsis'
                size={16}
              />
            ),
          }}
          items={[
            {
              label: video.favorite ? '관심 해제' : '관심 영상으로 저장',
              isDisabled: busy,
              onClick: onFavorite,
            },
            {
              label: '내 목록에서 제거',
              variant: 'danger',
              isDisabled: busy,
              onClick: onRemove,
            },
          ]}
        />
      }
    />
  );
}
