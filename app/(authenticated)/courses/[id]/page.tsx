import { Banner } from '@/components/ui/composites/Banner';
import { Heading } from '@/components/ui/primitives/Heading';
import { Text } from '@/components/ui/primitives/Text';
import { Card } from '@/components/ui/primitives/Card';
import { CourseManagement } from '../_components/CourseManagement';
import { requireSession } from '../../requireSession';
import { getCourse } from '@/domains/courses/api/courses';
import { ButtonLink } from '@/components/ui/primitives/ButtonLink';
import { Badge } from '@/components/ui/primitives/Badge';
import { formatDate } from '@/domains/learning/lib/format';
import * as styles from '@/lib/styles/workspace.css';

/** 수업 안에서 허용된 과제와 현재 제출 상태를 표시한다. */
export default async function CoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { transport } = await requireSession();
  const { id } = await params;
  const value = await getCourse(id, transport);

  return (
    <div className={styles.page}>
      <ButtonLink
        href='/courses'
        variant='ghost'>
        ← 내 수업
      </ButtonLink>
      <Heading level={1}>{value.course.title}</Heading>
      <Banner
        status='info'
        title='안내'>
        과제 제출은 개인 받아쓰기 진도·답안과 별도로 기록됩니다. 수업 참여만으로
        비공개 원본 전체를 열 수 있는 권한이 생기지 않습니다.
      </Banner>
      {value.course.ownerUnavailable && (
        <Banner
          status='info'
          title='안내'>
          수업 개설자의 계정이 탈퇴한 상태입니다. 기존 과제와 허용된 제출 기록은
          보존됩니다.
        </Banner>
      )}
      <CourseManagement value={value} />
      {value.assignments.length === 0 && (
        <Text
          as='p'
          display='block'>
          아직 배정된 과제가 없습니다.
        </Text>
      )}
      {value.assignments.map((item) => (
        <Card
          className={styles.message}
          key={item.id}>
          <Heading level={2}>{item.title}</Heading>
          <Text
            as='p'
            display='block'>
            {item.source.title} ·{' '}
            {item.mode === 'reading'
              ? '읽기'
              : item.mode === 'full'
                ? '전체 받아쓰기'
                : '빈칸 받아쓰기'}{' '}
            · {item.taskCount}개 · 과제 v{item.version}
          </Text>
          <Text
            as='p'
            display='block'>
            기한: {formatDate(item.dueAt)} · 기한 후 제출{' '}
            {item.allowLate ? '허용' : '불가'} · 재제출{' '}
            {item.allowResubmit ? '허용' : '불가'}
          </Text>
          <div className={styles.row}>
            <Badge tone={item.submission ? 'success' : 'warning'}>
              {item.submission
                ? `${item.submission.late ? '기한 후 ' : ''}제출 완료 · v${item.submission.version}`
                : '미제출'}
            </Badge>
            <ButtonLink
              href={`/courses/${encodeURIComponent(id)}/assignments/${encodeURIComponent(item.id)}`}
              variant='secondary'>
              과제와 제출 이력 보기
            </ButtonLink>
          </div>
        </Card>
      ))}
    </div>
  );
}
