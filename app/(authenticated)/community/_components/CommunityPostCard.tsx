'use client';
import { Avatar } from '@/components/ui/primitives/Avatar';
import { Badge } from '@/components/ui/primitives/Badge';
import { Card } from '@/components/ui/primitives/Card';
import { Heading } from '@/components/ui/primitives/Heading';
import { Link } from '@/components/ui/primitives/Link';
import { Text } from '@/components/ui/primitives/Text';
import type { CommunityPosts } from '@/domains/community/model/contracts';
import { formatDate, sourceLabel } from '@/domains/learning/lib/format';
import { Icon } from '@/components/ui/primitives/Icon';
import * as styles from './CommunityPostCard.css';

/** 목록의 글 하나를 공개 범위, 공유 원문과 반응 수가 보이는 카드로 표시한다. */
export function CommunityPostCard({
  item,
}: {
  item: CommunityPosts['items'][number];
}) {
  const authorName = item.author.name ?? '학습자';

  return (
    <Card className={styles.card}>
      <div className={styles.content}>
        <div className={styles.header}>
          <Badge tone={item.visibility === 'public' ? 'review' : 'info'}>
            {item.visibility === 'public' ? '공개 글' : '지정 계정'}
          </Badge>
          <span className={styles.time}>{formatDate(item.createdAt)}</span>
        </div>
        <Heading level={2}>
          <Link href={`/community/${encodeURIComponent(item.id)}`}>
            {item.title}
          </Link>
        </Heading>
        <Text
          as='p'
          display='block'
          color='secondary'
          maxLines={2}>
          {item.body.slice(0, 200)}
        </Text>
        {item.source && (
          <blockquote className={styles.quote}>
            <span className={styles.quoteText}>{item.source.quote}</span>
            <span className={styles.quoteSource}>
              {item.source.title} · {sourceLabel(item.source)}
            </span>
          </blockquote>
        )}
        <div className={styles.footer}>
          <span className={styles.author}>
            <span aria-hidden='true'>
              <Avatar
                name={authorName}
                size='sm'
                tooltip={false}
              />
            </span>
            {authorName}
            {item.author.isHelper && <Badge tone='brand'>조교</Badge>}
          </span>
          {item.taggedHelpers.map((helper) => (
            <span
              key={helper.id}
              className={styles.tag}>
              @ {helper.name ?? '조교'}
              {helper.name && ' 조교'}
            </span>
          ))}
          <span className={styles.stats}>
            <span className={styles.stat}>
              <Icon
                name='thumbs-up'
                size={16}
              />
              추천 {item.likes}
            </span>
            <span className={styles.stat}>
              <Icon
                name='message-circle'
                size={16}
              />
              댓글 {item.comments}
            </span>
          </span>
        </div>
      </div>
    </Card>
  );
}
