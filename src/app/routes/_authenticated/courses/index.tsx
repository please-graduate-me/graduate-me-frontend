import { createFileRoute } from '@tanstack/react-router';
import { listCoursesQuery } from '@/domains/courses/api/queries';
import { CourseList } from './-components/CourseList';

/** URL 조건과 인증된 조회 결과를 화면에 연결한다. */
export const Route = createFileRoute('/_authenticated/courses/')({
  loader: async ({ context }) => {
    const initial = await context.queryClient.fetchQuery(listCoursesQuery());

    return { initial };
  },
  component: CoursesPage,
});

function CoursesPage() {
  const { initial } = Route.useLoaderData();

  return <CourseList initial={initial} />;
}
