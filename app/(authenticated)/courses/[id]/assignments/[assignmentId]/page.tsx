import { requireSession } from '../../../../requireSession';
import { getCourse, getAssignment } from '@/domains/courses/api/courses';
import { AssignmentStudy } from './_components/AssignmentStudy';

/** 수강생의 정답 공개 정책과 담당자의 조회 범위를 서버에서 확인한다. */
export default async function AssignmentPage({
  params,
}: {
  params: Promise<{ id: string; assignmentId: string }>;
}) {
  const { transport } = await requireSession();
  const { id, assignmentId } = await params;

  const [course, initial] = await Promise.all([
    getCourse(id, transport),
    getAssignment(id, assignmentId, transport),
  ]);

  return (
    <AssignmentStudy
      initial={initial}
      canSubmit={course.course.role === 'student'}
    />
  );
}
