import { createFileRoute, notFound } from '@tanstack/react-router';
import { getArchivedVideoSourceQuery } from '@/domains/videos/api/queries';
import { sourceInputSchema } from '@/domains/materials/model/source';
import { ArchivedVideoSource } from './-components/ArchivedVideoSource';
import { getLessonQuery } from '@/domains/videos/api/queries';
import { ApiError } from '@/lib/api/request';
import { LessonLoader } from './-components/LessonLoader';

/** URL 조건과 인증된 조회 결과를 화면에 연결한다. */
export const Route = createFileRoute('/_authenticated/learn/$id/')({
  validateSearch: (search: Record<string, unknown>) => ({
    segment: typeof search.segment === 'string' ? search.segment : undefined,
    version: typeof search.version === 'string' ? search.version : undefined,
    quote: typeof search.quote === 'string' ? search.quote : undefined,
  }),
  loaderDeps: ({ search }) => search,
  loader: async ({ context, params, deps: search }) => {
    const { id } = params;

    const initialValue = await context.queryClient
      .fetchQuery(getLessonQuery(id))
      .catch((error) => {
        if (error instanceof ApiError && error.status === 404) throw notFound();
        throw error;
      });

    const initial = structuredClone(initialValue);

    const requestedIndex = initial.segments.findIndex(
      (segment) => segment.id === search.segment
    );

    if (requestedIndex >= 0) {
      initial.progress.currentIndex = requestedIndex;

      initial.progress.playbackPosition =
        initial.segments[requestedIndex].start;

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
      const archive = await context.queryClient
        .fetchQuery(
          getArchivedVideoSourceQuery(id, segment.id, requestedVersion)
        )
        .catch((error) => {
          if (error instanceof ApiError && error.status === 404)
            throw notFound();
          throw error;
        });

      return { archive, quote: search.quote, initial, selection: undefined };
    }

    const selection = sourceInputSchema.safeParse({
      kind: 'video',
      videoId: id,
      segmentId: search.segment,
      quote: search.quote,
      version: segment?.version ?? 1,
    });

    return {
      initial,
      selection,
      archive: undefined,
      quote: undefined,
      id,
      search,
    };
  },
  component: Learn,
});

function Learn() {
  const data = Route.useLoaderData();

  if (data.archive)
    return (
      <ArchivedVideoSource
        value={data.archive}
        quote={data.quote}
      />
    );
  const { initial, selection, id, search } = data;

  return (
    <LessonLoader
      key={`${id}:${search.segment ?? ''}`}
      initial={initial}
      selection={selection.success ? selection.data : undefined}
    />
  );
}
