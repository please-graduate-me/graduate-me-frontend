import { Avatar } from '@/components/ui/primitives/Avatar';
import { Badge } from '@/components/ui/primitives/Badge';
import { Card } from '@/components/ui/primitives/Card';
import { RelativeTime } from '@/components/ui/primitives/RelativeTime';
import type { CommunityPost } from '@/domains/community/model/contracts';
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
        // 조교 답변은 이름과 무관하게 청록 단색으로 묶어 역할을 먼저 알린다.
        tone={comment.author.isHelper ? 'helper' : 'auto'}
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
            <Badge
              tone='solid'
              size='small'
              shape='square'>
              조교
            </Badge>
            <RelativeTime
              value={comment.createdAt}
              className={styles.answerTime}
            />
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
            · <RelativeTime value={comment.createdAt} />
          </span>
        </p>
        <p className={styles.commentBody}>{comment.body}</p>
        {remove}
      </div>
    </div>
  );
}
