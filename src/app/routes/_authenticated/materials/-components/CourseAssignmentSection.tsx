import type { MyAssignments } from '@/domains/courses/model/contracts';
import { formatDate } from '@/domains/learning/lib/format';
import { daysUntilDue, dueLabel } from './assignmentDue';
import { MaterialSection } from './MaterialSection';
import { MaterialTile } from './MaterialTile';

const modeLabels = {
  full: '받아쓰기 과제',
  blank: '빈칸 채우기 과제',
  reading: '읽기 과제',
} as const;

/** 학생으로 참여한 수업 하나의 과제를 마감 알약과 제출 상태가 있는 타일 묶음으로 보여 준다. */
export function CourseAssignmentSection({
  courseId,
  courseTitle,
  assignments,
  now,
}: {
  courseId: string;
  courseTitle: string;
  assignments: MyAssignments['items'];
  now: number;
}) {
  // 서버가 미제출·마감 순으로 주지만 필터 뒤에도 같은 순서를 보장하려고 다시 정렬한다.
  const ordered = [...assignments].sort((a, b) =>
    a.submitted !== b.submitted
      ? a.submitted
        ? 1
        : -1
      : Date.parse(a.dueAt) - Date.parse(b.dueAt)
  );

  const open = assignments.filter(
    (item) => !item.submitted && daysUntilDue(item.dueAt, now) >= 0
  ).length;

  return (
    <MaterialSection
      icon='graduation-cap'
      tone='info'
      title={`수업 과제 · ${courseTitle}`}
      description={
        open > 0
          ? `담당 조교가 올린 과제예요 · 마감 ${open}개 남음`
          : '담당 조교가 올린 과제예요'
      }>
      {ordered.map((item) => {
        const days = daysUntilDue(item.dueAt, now);

        return (
          <MaterialTile
            key={item.id}
            kind={item.source.kind}
            seed={item.id}
            href={`/courses/${encodeURIComponent(courseId)}/assignments/${encodeURIComponent(item.id)}`}
            title={item.title}
            caption={item.submitted ? '제출 완료' : modeLabels[item.mode]}
            captionTone={item.submitted ? 'accent' : 'muted'}
            complete={item.submitted ? 'accent' : undefined}
            pill={
              item.submitted
                ? undefined
                : { label: dueLabel(days), tone: 'warning' }
            }
            hint={`${item.source.title} · ${formatDate(item.dueAt)} 마감`}
          />
        );
      })}
    </MaterialSection>
  );
}
