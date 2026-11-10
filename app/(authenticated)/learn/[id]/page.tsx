import { requireSession } from '../../requireSession';
import { getArchivedVideoSource } from '@/domains/videos/api/archive';
import { sourceInputSchema } from '@/domains/materials/model/source';
import { ArchivedVideoSource } from './_components/ArchivedVideoSource';
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
  searchParams: Promise<{ segment?: string; version?: string; quote?: string }>;
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

  if (requestedIndex >= 0) {
    initial.progress.currentIndex = requestedIndex;
    initial.progress.playbackPosition = initial.segments[requestedIndex].start;
    initial.progress.watchMode = 'dictation';
  }

  const segment = initial.segments[requestedIndex];
  const requestedVersion = Number(search.version);

  if (
    segment &&
    Number.isInteger(requestedVersion) &&
    requestedVersion > 0 &&
    requestedVersion !== (segment.version ?? 1)
  ) {
    const archive = await getArchivedVideoSource(
      id,
      segment.id,
      requestedVersion,
      transport
    ).catch((error) => {
      if (error instanceof ApiError && error.status === 404) notFound();
      throw error;
    });

    return (
      <ArchivedVideoSource
        value={archive}
        quote={search.quote}
      />
    );
  }

  const selection = sourceInputSchema.safeParse({
    kind: 'video',
    videoId: id,
    segmentId: search.segment,
    quote: search.quote,
    version: segment?.version ?? 1,
  });

  return (
    <LessonLoader
      key={`${id}:${search.segment ?? ''}`}
      initial={initial}
      selection={selection.success ? selection.data : undefined}
    />
  );
}
