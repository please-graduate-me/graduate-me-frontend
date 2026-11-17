import { createFileRoute, notFound } from '@tanstack/react-router';
import { getLearningPolicyQuery } from '@/domains/learning/api/queries';
import { getMaterialQuery } from '@/domains/materials/api/queries';
import { sourceInputSchema } from '@/domains/materials/model/source';
import { ApiError } from '@/lib/api/request';
import { PdfStudy } from './-components/PdfStudy';

/** URL 조건과 인증된 조회 결과를 화면에 연결한다. */
export const Route = createFileRoute('/_authenticated/materials/$id/')({
  validateSearch: (search: Record<string, unknown>) => ({
    page: typeof search.page === 'string' ? search.page : undefined,
    quote: typeof search.quote === 'string' ? search.quote : undefined,
    rect: typeof search.rect === 'string' ? search.rect : undefined,
    version: typeof search.version === 'string' ? search.version : undefined,
    ocrId: typeof search.ocrId === 'string' ? search.ocrId : undefined,
  }),
  loaderDeps: ({ search }) => search,
  loader: async ({ context, params, deps: search }) => {
    const { id } = params;

    const requestedVersion = Number(search.version);

    const policyPromise = context.queryClient
      .fetchQuery(getLearningPolicyQuery())
      .catch(() => null);

    const material = await context.queryClient
      .fetchQuery(
        getMaterialQuery(
          id,
          Number.isInteger(requestedVersion) && requestedVersion > 0
            ? requestedVersion
            : undefined
        )
      )
      .catch((error) => {
        if (error instanceof ApiError && error.status === 404) throw notFound();
        throw error;
      });

    const requested = Number(search.page);

    const page =
      Number.isInteger(requested) &&
      requested >= 1 &&
      requested <= material.pageCount
        ? requested
        : material.currentPage;

    let rects: unknown[] = [];

    try {
      if (search.rect) rects = [JSON.parse(search.rect)];
    } catch {
      rects = [];
    }

    const selection = sourceInputSchema.safeParse({
      kind: 'pdf',
      materialId: material.id,
      page,
      quote: search.quote,
      ocrId: search.ocrId,
      version: Number(search.version ?? 1),
      rects,
    });

    const policy = await policyPromise;

    return { search, material, page, selection, policy };
  },
  component: MaterialPage,
});

function MaterialPage() {
  const { search, material, page, selection, policy } = Route.useLoaderData();

  return (
    <PdfStudy
      key={`${material.id}:${material.version ?? 1}:${page}:${search.ocrId ?? ''}:${search.quote ?? ''}`}
      selection={
        selection.success &&
        (selection.data.version ?? 1) === (material.version ?? 1)
          ? selection.data
          : undefined
      }
      initial={{ ...material, currentPage: page }}
      policy={policy}
    />
  );
}
