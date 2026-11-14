'use client';
import { Avatar } from '@astryxdesign/core/Avatar';
import { Card } from '@astryxdesign/core/Card';
import type { CommunityPost } from '@/domains/community/model/contracts';
import { formatDate } from '@/domains/learning/lib/format';
import { Button } from '@/components/ui/primitives/Button';
import * as styles from './CommunityComment.css';

/** 조교 답변은 청록 카드로, 일반 댓글은 아바타 옆 본문으로 구분해 표시한다. */
export function CommunityComment({
  comment,
  canDelete,
  busy,
  onDelete,
}: {
  comment: CommunityPost['comments'][number];
  canDelete: boolean;
  busy: boolean;
  onDelete: () => void;
}) {
  const name = comment.author.name ?? '학습자';

  const avatar = (
    <span
      aria-hidden='true'
      className={styles.avatar}>
      <Avatar
        name={name}
        size='md'
        tooltip={false}
      />
    </span>
  );

  const remove = canDelete && (
    <Button
      type='button'
      variant='ghost'
      size='small'
      className={styles.remove}
      disabled={busy}
      onClick={onDelete}>
      댓글 삭제
    </Button>
  );

  if (comment.author.isHelper)
    return (
      <Card variant='teal'>
        <div className={styles.answer}>
          <div className={styles.answerHeader}>
            {avatar}
            {name}
            <span className={styles.helperTag}>조교</span>
            <span className={styles.answerTime}>
              {formatDate(comment.createdAt)}
            </span>
          </div>
          <p className={styles.answerBody}>{comment.body}</p>
          {remove}
        </div>
      </Card>
    );

  return (
    <div className={styles.comment}>
      {avatar}
      <div className={styles.commentContent}>
        <p className={styles.commentHeader}>
          {name}{' '}
          <span className={styles.commentTime}>
            · {formatDate(comment.createdAt)}
          </span>
        </p>
        <p className={styles.commentBody}>{comment.body}</p>
        {remove}
      </div>
    </div>
  );
}
