import { notFound } from 'next/navigation';
import { requireSession } from '../../requireSession';
import { getLearningPolicy } from '@/domains/learning/api/policy';
import { getMaterial } from '@/domains/materials/api/materials';
import { sourceInputSchema } from '@/domains/materials/model/source';
import { ApiError } from '@/lib/api/request';
import { PdfStudy } from './_components/PdfStudy';

/** 개인 원본 접근을 확인하고 공유된 페이지 위치를 복원한다. */
export default async function MaterialPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    page?: string;
    quote?: string;
    rect?: string;
    version?: string;
    ocrId?: string;
  }>;
}) {
  const { transport } = await requireSession();
  const [{ id }, search] = await Promise.all([params, searchParams]);

  const requestedVersion = Number(search.version);

  const policyPromise = getLearningPolicy(transport).catch(() => null);

  const material = await getMaterial(
    id,
    transport,
    Number.isInteger(requestedVersion) && requestedVersion > 0
      ? requestedVersion
      : undefined
  ).catch((error) => {
    if (error instanceof ApiError && error.status === 404) notFound();
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
      policy={await policyPromise}
    />
  );
}
