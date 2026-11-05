import { requireSession } from '../../requireSession';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSharedLesson } from '@/domains/shares/api/shares';
import { videoPaths } from '@/domains/videos/config/paths';
import { ApiError } from '@/lib/api/request';
import { SharedEntry } from './_components/SharedEntry';
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
        ← 홈
      </Link>
      <div className={styles.page}>
        <div className={styles.info}>
          <h1>{lesson.video.title}</h1>
          <p className={styles.meta}>
            <span>{lesson.segment ? '공유받은 구절' : '공유받은 영상'}</span>
            <span>{lesson.video.category ?? '미분류'}</span>
            {lesson.segment && (
              <span>
                {lesson.segment.start.toFixed(1)}초 ~{' '}
                {lesson.segment.end.toFixed(1)}초
              </span>
            )}
          </p>
        </div>
        <iframe
          className={styles.player}
          src={`https://www.youtube.com/embed/${lesson.video.youtubeId}?${query}`}
          title={lesson.video.title}
          allow='accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
          allowFullScreen
          referrerPolicy='strict-origin-when-cross-origin'
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
