import { Heading } from '@/components/ui/primitives/Heading';
import { Text } from '@/components/ui/primitives/Text';
import { requireSession } from '../../requireSession';
import { Link } from '@/components/ui/primitives/Link';
import { Badge } from '@/components/ui/primitives/Badge';
import { Icon } from '@/components/ui/primitives/Icon';
import { notFound } from 'next/navigation';
import { getSharedLesson } from '@/domains/shares/api/shares';
import { videoPaths } from '@/domains/videos/config/paths';
import { ApiError } from '@/lib/api/request';
import { SharedEntry } from './_components/SharedEntry';
import { SharedVideoPlayer } from './_components/SharedVideoPlayer';
import * as styles from './page.css';

/** 로그인 확인을 마친 사용자에게만 공유받은 영상과 구절을 제공한다. */
export default async function SharedVideo({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { transport } = await requireSession();

  const lesson = await getSharedLesson(id, transport).catch((error) => {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  });

  const query = new URLSearchParams({
    rel: '0',
    ...(lesson.segment
      ? {
          start: String(Math.floor(lesson.segment.start)),
          end: String(Math.ceil(lesson.segment.end)),
        }
      : {}),
  });

  return (
    <>
      <Link
        className={styles.back}
        href={videoPaths.home}>
        <Icon
          name='chevron-left'
          size={18}
        />
        홈
      </Link>
      <div className={styles.page}>
        <div className={styles.info}>
          <Heading level={1}>{lesson.video.title}</Heading>
          <Text
            as='p'
            display='block'
            className={styles.meta}>
            <Badge tone='brand'>
              {lesson.segment ? '공유받은 구절' : '공유받은 영상'}
            </Badge>
            <span className={styles.category}>
              {lesson.video.category ?? '미분류'}
            </span>
            {lesson.segment && (
              <span className={styles.range}>
                <Icon
                  name='clock'
                  size={16}
                />
                {lesson.segment.start.toFixed(1)}초 ~{' '}
                {lesson.segment.end.toFixed(1)}초
              </span>
            )}
          </Text>
        </div>
        <SharedVideoPlayer
          youtubeId={lesson.video.youtubeId}
          title={lesson.video.title}
          duration={lesson.video.duration}
          segment={lesson.segment}
          query={query.toString()}
        />
        <SharedEntry
          key={id}
          id={id}
          segment={Boolean(lesson.segment)}
        />
      </div>
    </>
  );
}
