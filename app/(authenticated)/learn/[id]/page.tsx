import { requireSession } from '../../requireSession';
import { getLesson } from '@/domains/videos/api/videos';
import { ApiError } from '@/lib/api/request';
import { notFound } from 'next/navigation';
import { LessonLoader } from './_components/LessonLoader';

/** 인증과 자원 존재 여부를 확인한 후 학습 화면에 진입시킨다. */
export default async function Learn({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ segment?: string }>;
}) {
  const { transport } = await requireSession();
  const [{ id }, search] = await Promise.all([params, searchParams]);

  const initial = await getLesson(id, transport).catch((error) => {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  });

  const requestedIndex = initial.segments.findIndex(
    (segment) => segment.id === search.segment
  );

  if (requestedIndex >= 0) initial.progress.currentIndex = requestedIndex;

  return (
    <LessonLoader
      key={`${id}:${search.segment ?? ''}`}
      initial={initial}
    />
  );
}
