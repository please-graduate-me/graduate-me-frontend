import { createFileRoute, notFound } from '@tanstack/react-router';
import { getQuestionQuery } from '@/domains/questions/api/queries';
import { ApiError } from '@/lib/api/request';
import { QuestionThread } from './-components/QuestionThread';

/** URL 조건과 인증된 조회 결과를 화면에 연결한다. */
export const Route = createFileRoute('/_authenticated/questions/$id/')({
  loader: async ({ context, params }) => {
    const { id } = params;

    const initial = await context.queryClient
      .fetchQuery(getQuestionQuery(id))
      .catch((error) => {
        if (error instanceof ApiError && error.status === 404) throw notFound();
        throw error;
      });

    return { initial };
  },
  component: QuestionPage,
});

function QuestionPage() {
  const { initial } = Route.useLoaderData();

  return <QuestionThread initial={initial} />;
}
