import { requireSession } from '../requireSession';
import { listMaterials } from '@/domains/materials/api/materials';
import { MaterialLibrary } from './_components/MaterialLibrary';

/** 인증된 사용자의 원문 자료와 새 자료 등록 진입을 연결한다. */
export default async function MaterialsPage({
  searchParams,
}: {
  searchParams: Promise<{ add?: string }>;
}) {
  const { transport } = await requireSession();

  const [initial, search] = await Promise.all([
    listMaterials(transport),
    searchParams,
  ]);

  return (
    <MaterialLibrary
      initial={initial.items}
      initiallyAdding={search.add === '1'}
    />
  );
}
