import { createFileRoute } from '@tanstack/react-router';
import { listMaterialsQuery } from '@/domains/materials/api/queries';
import { MaterialLibrary } from './-components/MaterialLibrary';

/** URL 조건과 인증된 조회 결과를 화면에 연결한다. */
export const Route = createFileRoute('/_authenticated/materials/')({
  validateSearch: (search: Record<string, unknown>) => ({
    add: typeof search.add === 'string' ? search.add : undefined,
  }),
  loaderDeps: ({ search }) => search,
  loader: async ({ context, deps: search }) => {
    const initial = await context.queryClient.fetchQuery(listMaterialsQuery());

    return { initial, search };
  },
  component: MaterialsPage,
});

function MaterialsPage() {
  const { initial, search } = Route.useLoaderData();

  return (
    <MaterialLibrary
      initial={initial.items}
      initiallyAdding={search.add === '1'}
    />
  );
}
