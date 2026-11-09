import { notFound } from 'next/navigation';
import { requireSession } from '../../requireSession';
import { getMaterial } from '@/domains/materials/api/materials';
import { ApiError } from '@/lib/api/request';
import { PdfStudy } from './_components/PdfStudy';

/** 개인 원본 접근을 확인하고 공유된 페이지 위치를 복원한다. */
export default async function MaterialPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { transport } = await requireSession();
  const [{ id }, search] = await Promise.all([params, searchParams]);

  const material = await getMaterial(id, transport).catch((error) => {
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

  return (
    <PdfStudy
      key={material.id}
      initial={{ ...material, currentPage: page }}
    />
  );
}
