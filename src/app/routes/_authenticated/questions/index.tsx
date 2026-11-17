import { createFileRoute } from '@tanstack/react-router';
import { listQuestionsQuery } from '@/domains/questions/api/queries';
import { QuestionList } from './-components/QuestionList';

/** URL 조건과 인증된 조회 결과를 화면에 연결한다. */
export const Route = createFileRoute('/_authenticated/questions/')({
  loader: async ({ context }) => {
    const initial = await context.queryClient.fetchQuery(listQuestionsQuery());

    return { initial };
  },
  component: QuestionsPage,
});

function QuestionsPage() {
  const { initial } = Route.useLoaderData();

  return <QuestionList initial={initial.items} />;
}
