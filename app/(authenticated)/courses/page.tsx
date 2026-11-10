import { requireSession } from '../requireSession';
import { listCourses } from '@/domains/courses/api/courses';
import { CourseList } from './_components/CourseList';

/** 수업 가입이 없어도 개인 학습은 그대로 제공한다. */
export default async function CoursesPage() {
  const { transport } = await requireSession();
  const initial = await listCourses(transport);

  return <CourseList initial={initial} />;
}
