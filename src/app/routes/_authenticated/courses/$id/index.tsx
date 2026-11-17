import { createFileRoute } from '@tanstack/react-router';
import { Banner } from '@/components/ui/composites/Banner';
import { Heading } from '@/components/ui/primitives/Heading';
import { CourseManagement } from '../-components/CourseManagement';
import { getCourseQuery } from '@/domains/courses/api/queries';
import { ButtonLink } from '@/components/ui/primitives/ButtonLink';
import { Badge } from '@/components/ui/primitives/Badge';
import { CourseAssignmentCard } from './-components/CourseAssignmentCard';
import { CourseAssignmentCreate } from './-components/CourseAssignmentCreate';
import * as styles from './index.css';

const roles = {
  teacher: { label: '교수·담당자', tone: 'review' },
  assistant: { label: '조교', tone: 'info' },
  student: { label: '수강생', tone: 'success' },
} as const;

/** URL 조건과 인증된 조회 결과를 화면에 연결한다. */
export const Route = createFileRoute('/_authenticated/courses/$id/')({
  loader: async ({ context, params }) => {
    const { session } = context;
    const { id } = params;
    const value = await context.queryClient.fetchQuery(getCourseQuery(id));
    const role = roles[value.course.role];
    const isManager = value.course.role !== 'student';

    return { session, id, value, role, isManager };
  },
  component: CoursePage,
});

function CoursePage() {
  const { session, id, value, role, isManager } = Route.useLoaderData();

  return (
    <div className={styles.page}>
      <ButtonLink
        href='/courses'
        variant='ghost'
        startIcon='chevron-left'
        className={styles.back}>
        내 수업
      </ButtonLink>
      <div className={styles.title}>
        <div className={styles.badges}>
          <Badge tone='neutral'>
            {value.course.language === 'en' ? '영어' : '태국어'}
          </Badge>
          <Badge tone={role.tone}>{role.label}</Badge>
        </div>
        <Heading level={1}>{value.course.title}</Heading>
      </div>
      <Banner
        status='note'
        icon='info'>
        과제 제출은 개인 받아쓰기 진도·답안과 별도로 기록됩니다. 수업 참여만으로
        비공개 원본 전체를 열 수 있는 권한이 생기지 않습니다.
      </Banner>
      {value.course.ownerUnavailable && (
        <Banner
          status='quote'
          icon='info'>
          수업 개설자의 계정이 탈퇴한 상태입니다. 기존 과제와 허용된 제출 기록은
          보존됩니다.
        </Banner>
      )}
      <div className={styles.columns}>
        <section
          aria-labelledby='course-assignments'
          className={styles.assignments}>
          <div className={styles.assignmentsHeading}>
            <Heading
              level={2}
              id='course-assignments'
              className={styles.sectionTitle}>
              과제
              <span className={styles.count}>{value.assignments.length}</span>
            </Heading>
            {isManager && (
              <CourseAssignmentCreate
                courseId={value.course.id}
                language={value.course.language}
              />
            )}
          </div>
          {value.assignments.length === 0 ? (
            <p className={styles.empty}>아직 배정된 과제가 없습니다.</p>
          ) : (
            <ul className={styles.list}>
              {value.assignments.map((item) => (
                <li key={item.id}>
                  <CourseAssignmentCard
                    courseId={id}
                    item={item}
                    // 담당자는 본인 제출이 없어 미제출 표지가 오해를 주므로 수강생에게만 보인다.
                    showStatus={!isManager}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>
        <CourseManagement
          value={value}
          currentUserId={session.user.id}
        />
      </div>
    </div>
  );
}
