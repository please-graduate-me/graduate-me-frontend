import { Card } from '@/components/ui/primitives/Card';
import { Heading } from '@/components/ui/primitives/Heading';
import { Badge } from '@/components/ui/primitives/Badge';
import { Icon } from '@/components/ui/primitives/Icon';
import { ButtonLink } from '@/components/ui/primitives/ButtonLink';
import type { CourseDetail } from '@/domains/courses/model/contracts';
import { formatDate } from '@/domains/learning/lib/format';
import * as styles from './CourseAssignmentCard.css';

const modes = {
  reading: '읽기',
  full: '전체 받아쓰기',
  blank: '빈칸 받아쓰기',
} as const;

/** 과제 하나의 자료, 제출 조건과 이동 동작을 카드로 보이고 제출 상태는 수강생에게만 표시한다. */
export function CourseAssignmentCard({
  courseId,
  item,
  showStatus,
}: {
  courseId: string;
  item: CourseDetail['assignments'][number];
  showStatus: boolean;
}) {
  return (
    <Card
      as='article'
      className={styles.card}>
      {item.source.kind === 'video' ? (
        <svg
          aria-hidden='true'
          className={styles.kind}
          width='56'
          height='56'
          viewBox='0 0 56 56'>
          <rect
            className={styles.videoBack}
            width='56'
            height='56'
            rx='14'
          />
          <path
            className={styles.videoPlay}
            d='M23 19v18l14-9-14-9z'
          />
        </svg>
      ) : (
        <svg
          aria-hidden='true'
          className={styles.kind}
          width='56'
          height='56'
          viewBox='0 0 56 56'>
          <rect
            className={styles.pdfBack}
            width='56'
            height='56'
            rx='14'
          />
          <rect
            className={styles.pdfSheetBack}
            x='20'
            y='9'
            width='24'
            height='32'
            rx='5'
          />
          <rect
            className={styles.pdfSheet}
            x='13'
            y='15'
            width='24'
            height='32'
            rx='5'
          />
          <rect
            className={styles.pdfLine}
            x='18'
            y='24'
            width='13'
            height='4'
            rx='2'
          />
          <rect
            className={styles.pdfLine}
            x='18'
            y='32'
            width='9'
            height='4'
            rx='2'
          />
        </svg>
      )}
      <div className={styles.body}>
        <Heading
          level={3}
          className={styles.title}>
          {item.title}
        </Heading>
        <p className={styles.meta}>
          {item.source.title} · {modes[item.mode]} · {item.taskCount}개 · 과제 v
          {item.version}
        </p>
        <ul
          aria-label='제출 조건'
          className={styles.conditions}>
          <li className={styles.condition}>
            <Icon
              name='clock'
              size={13}
            />
            기한 {formatDate(item.dueAt)}
          </li>
          <li className={styles.condition}>
            기한 후 제출 {item.allowLate ? '허용' : '불가'}
          </li>
          <li className={styles.condition}>
            재제출 {item.allowResubmit ? '허용' : '불가'}
          </li>
        </ul>
      </div>
      <div className={styles.side}>
        {showStatus && (
          <Badge tone={item.submission ? 'success' : 'warning'}>
            {item.submission
              ? `${item.submission.late ? '기한 후 ' : ''}제출 완료 · v${item.submission.version}`
              : '미제출'}
          </Badge>
        )}
        <ButtonLink
          href={`/courses/${encodeURIComponent(courseId)}/assignments/${encodeURIComponent(item.id)}`}
          variant='secondary'>
          과제와 제출 이력 보기
          <Icon
            name='chevron-right'
            size={16}
          />
        </ButtonLink>
      </div>
    </Card>
  );
}
