import { createFileRoute } from '@tanstack/react-router';
import { getLearningProfileQuery } from '@/domains/users/api/queries';
import { listCommunityPostsQuery } from '@/domains/community/api/queries';
import { sourceInputSchema } from '@/domains/materials/model/source';
import { CommunityList } from './-components/CommunityList';

/** URL 조건과 인증된 조회 결과를 화면에 연결한다. */
export const Route = createFileRoute('/_authenticated/community/')({
  validateSearch: (search: Record<string, unknown>) => ({
    source: typeof search.source === 'string' ? search.source : undefined,
    language: typeof search.language === 'string' ? search.language : undefined,
    compose: typeof search.compose === 'string' ? search.compose : undefined,
  }),
  loaderDeps: ({ search }) => search,
  loader: async ({ context, deps: search }) => {
    const profile = await context.queryClient.fetchQuery(
      getLearningProfileQuery()
    );

    let source: unknown;

    try {
      source = search.source ? JSON.parse(search.source) : undefined;
    } catch {
      source = undefined;
    }

    const parsed = sourceInputSchema.safeParse(source);

    const selectedLanguage =
      search.language === 'en' || search.language === 'th'
        ? search.language
        : profile.targetLanguage;

    const initial = await context.queryClient.fetchQuery(
      listCommunityPostsQuery({ language: selectedLanguage })
    );

    return { profile, search, parsed, selectedLanguage, initial };
  },
  component: CommunityPage,
});

function CommunityPage() {
  const { profile, search, parsed, selectedLanguage, initial } =
    Route.useLoaderData();

  return (
    <CommunityList
      initialLanguage={selectedLanguage}
      initial={initial}
      source={parsed.success ? parsed.data : undefined}
      isHelper={profile.isHelper}
      // 나의 질문 보관함의 질문하기 동작이 조교 태그 글쓰기를 바로 열도록 받는다.
      initialCompose={search.compose === '1'}
    />
  );
}
