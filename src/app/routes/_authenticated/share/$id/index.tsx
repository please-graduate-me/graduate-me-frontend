import { createFileRoute, notFound } from '@tanstack/react-router';
import { Heading } from '@/components/ui/primitives/Heading';
import { Text } from '@/components/ui/primitives/Text';
import { Link } from '@/components/ui/primitives/Link';
import { Badge } from '@/components/ui/primitives/Badge';
import { Icon } from '@/components/ui/primitives/Icon';
import { getSharedLessonQuery } from '@/domains/shares/api/queries';
import { videoPaths } from '@/domains/videos/config/paths';
import { ApiError } from '@/lib/api/request';
import { SharedEntry } from './-components/SharedEntry';
import { SharedVideoPlayer } from './-components/SharedVideoPlayer';
import * as styles from './index.css';

/** URL 조건과 인증된 조회 결과를 화면에 연결한다. */
export const Route = createFileRoute('/_authenticated/share/$id/')({
  loader: async ({ context, params }) => {
    const { id } = params;

    const lesson = await context.queryClient
      .fetchQuery(getSharedLessonQuery(id))
      .catch((error) => {
        if (error instanceof ApiError && error.status === 404) throw notFound();
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

    return { id, lesson, query };
  },
  component: SharedVideo,
});

function SharedVideo() {
  const { id, lesson, query } = Route.useLoaderData();

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
