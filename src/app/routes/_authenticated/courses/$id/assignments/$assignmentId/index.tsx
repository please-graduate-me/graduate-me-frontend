import { createFileRoute } from '@tanstack/react-router';
import {
  getCourseQuery,
  getAssignmentQuery,
} from '@/domains/courses/api/queries';
import { AssignmentStudy } from './-components/AssignmentStudy';

/** URL 조건과 인증된 조회 결과를 화면에 연결한다. */
export const Route = createFileRoute(
  '/_authenticated/courses/$id/assignments/$assignmentId/'
)({
  loader: async ({ context, params }) => {
    const { id, assignmentId } = params;

    const [course, initial] = await Promise.all([
      context.queryClient.fetchQuery(getCourseQuery(id)),
      context.queryClient.fetchQuery(getAssignmentQuery(id, assignmentId)),
    ]);

    return { course, initial };
  },
  component: AssignmentPage,
});

function AssignmentPage() {
  const { course, initial } = Route.useLoaderData();

  return (
    <AssignmentStudy
      initial={initial}
      canSubmit={course.course.role === 'student'}
    />
  );
}
