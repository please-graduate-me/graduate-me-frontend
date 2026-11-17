import { ClickableCard } from '@/components/ui/composites/ClickableCard';
import { Badge } from '@/components/ui/primitives/Badge';
import { Heading } from '@/components/ui/primitives/Heading';
import { Icon } from '@/components/ui/primitives/Icon';
import { RelativeTime } from '@/components/ui/primitives/RelativeTime';
import type { QuestionSummary } from '@/domains/questions/model/contracts';
import { sourceLabel } from '@/domains/learning/lib/format';
import * as styles from './QuestionCard.css';

/** 내 질문 하나를 근거 자료, 답변 상태와 담당 도우미가 보이는 이동 카드로 표시한다. */
export function QuestionCard({ item }: { item: QuestionSummary }) {
  return (
    <ClickableCard
      href={`/questions/${encodeURIComponent(item.id)}`}
      label={item.title}
      hasHoverBorder
      className={styles.card}>
      <span
        aria-hidden='true'
        className={`${styles.thumb} ${styles.thumbKind[item.source.kind]}`}>
        {item.source.kind === 'pdf' ? (
          // PDF는 자료 보관함 타일과 같은 겹친 보라 문서 그림으로 영상과 구분한다.
          <svg
            width='22'
            height='26'
            viewBox='0 0 22 26'>
            <rect
              x='4'
              y='0'
              width='18'
              height='22'
              rx='4'
              fill='#C9C2FB'
            />
            <rect
              x='0'
              y='4'
              width='18'
              height='22'
              rx='4'
              fill='#8B7CF6'
            />
            <rect
              x='4'
              y='11'
              width='9'
              height='3'
              rx='1.5'
              fill='#FFFFFF'
            />
            <rect
              x='4'
              y='17'
              width='6'
              height='3'
              rx='1.5'
              fill='#FFFFFF'
            />
          </svg>
        ) : (
          <Icon
            name='play'
            size={22}
          />
        )}
      </span>
      <div className={styles.body}>
        <Heading
          level={2}
          className={styles.title}>
          {item.title}
        </Heading>
        <p className={styles.source}>
          {item.source.title} · {sourceLabel(item.source)}
        </p>
      </div>
      <Badge tone={item.status === 'answered' ? 'success' : 'review'}>
        {item.status === 'answered' ? '답변 완료' : '답변 대기'}
      </Badge>
      <dl className={styles.details}>
        <div className={styles.detail}>
          <dt className={styles.term}>답변 도우미</dt>
          <dd className={styles.value}>{item.assignee?.name ?? '배정 대기'}</dd>
        </div>
        <div className={styles.detail}>
          <dt className={styles.term}>최근 활동</dt>
          <dd className={styles.value}>
            <RelativeTime value={item.updatedAt} />
          </dd>
        </div>
      </dl>
    </ClickableCard>
  );
}
